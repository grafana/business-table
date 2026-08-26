#!/usr/bin/env node
/**
 * Pre-flight check for CI/CD workflows.
 *
 * Catches the two failure modes that surface only as a GitHub `startup_failure` — a red run
 * with zero jobs and zero check-runs, which is easy to mistake for a transient outage:
 *
 *   1. Input drift. A `with:` key we pass was renamed or removed in the reusable workflow at
 *      the ref we pin, or the callee gained a required input we do not supply.
 *   2. Blocked actions. An action pinned *inside* a reusable workflow we call is denied by the
 *      repository's allowed-actions policy. We never reference it directly, so grepping our
 *      own workflows finds nothing.
 *
 * Both are decidable without running anything. Requires an authenticated `gh` CLI.
 *
 * Usage: node scripts/preflight-workflows.mjs [--repo owner/name] [--json]
 */

import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import yaml from 'js-yaml';

const WORKFLOW_DIR = '.github/workflows';
const REUSABLE_RE = /^([\w.-]+)\/([\w.-]+)\/(\.github\/workflows\/[\w.-]+\.ya?ml)@(.+)$/;

const args = process.argv.slice(2);
const asJson = args.includes('--json');
const repoArg = args[args.indexOf('--repo') + 1];

const problems = [];
const notes = [];

/**
 * `gh api` wrapper. Returns null rather than throwing so one unreachable ref does not mask
 * every other finding in the report.
 */
const gh = (path, { allowFail = false } = {}) => {
  try {
    return JSON.parse(execFileSync('gh', ['api', path], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }));
  } catch (error) {
    if (allowFail) {
      return null;
    }
    throw new Error(`gh api ${path} failed: ${error.message}`);
  }
};

const currentRepo = () => {
  if (repoArg) {
    return repoArg;
  }
  const url = execFileSync('git', ['remote', 'get-url', 'origin'], { encoding: 'utf8' }).trim();
  return url.replace(/^.*github\.com[:/]/, '').replace(/\.git$/, '');
};

const fetchWorkflow = (owner, repo, path, ref) => {
  const res = gh(`repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(ref)}`, { allowFail: true });
  if (!res?.content) {
    return null;
  }
  return Buffer.from(res.content, 'base64').toString('utf8');
};

/**
 * Every `uses:` in a workflow, whatever the nesting depth. Job-level and step-level `uses`
 * live at different depths, so walk rather than index.
 */
const collectUses = (node, out = []) => {
  if (Array.isArray(node)) {
    node.forEach((n) => collectUses(n, out));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'uses' && typeof value === 'string') {
        out.push(value);
      } else {
        collectUses(value, out);
      }
    }
  }
  return out;
};

/** Job-level reusable-workflow calls, paired with the `with:` block we hand them. */
const collectReusableCalls = (doc) =>
  Object.entries(doc?.jobs ?? {})
    .filter(([, job]) => typeof job?.uses === 'string' && REUSABLE_RE.test(job.uses))
    .map(([name, job]) => ({ job: name, uses: job.uses, with: Object.keys(job.with ?? {}) }));

const declaredInputs = (src) => {
  const doc = yaml.load(src);
  // `on:` parses to boolean true under YAML 1.1 (the Norway problem), so accept either key.
  const on = doc?.on ?? doc?.[true];
  const inputs = on?.workflow_call?.inputs ?? {};
  return {
    all: new Set(Object.keys(inputs)),
    required: Object.entries(inputs)
      .filter(([, spec]) => spec?.required === true && spec?.default === undefined)
      .map(([name]) => name),
  };
};

/** Translate a GitHub allow/deny pattern into a matcher. `*` is the only wildcard. */
const patternToRe = (pattern) => new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*')}$`);

/**
 * Every check here needs to read workflows and policy from the API. Offline, or without an
 * authenticated CLI, we cannot tell a genuinely bad ref from an unreachable one - so skip
 * rather than block a commit on a verdict we cannot actually reach.
 */
const ghReady = () => {
  try {
    execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
};

// ---------------------------------------------------------------------------

if (!ghReady()) {
  console.log('Pre-flight: SKIPPED - `gh` is unavailable, unauthenticated, or offline.');
  process.exit(0);
}

const repoSlug = currentRepo();

const localWorkflows = readdirSync(WORKFLOW_DIR)
  .filter((f) => /\.ya?ml$/.test(f))
  .map((f) => ({ file: f, src: readFileSync(join(WORKFLOW_DIR, f), 'utf8') }));

// Actions referenced by our own workflows, plus every reusable workflow we reach.
const actionRefs = new Map();
const seenWorkflows = new Set();

const noteAction = (ref, origin) => {
  if (REUSABLE_RE.test(ref) || ref.startsWith('./') || ref.startsWith('docker://')) {
    return;
  }
  if (!actionRefs.has(ref)) {
    actionRefs.set(ref, new Set());
  }
  actionRefs.get(ref).add(origin);
};

/** Walk a reusable workflow: check the inputs we pass, then recurse into what it calls. */
const walk = (usesRef, passedInputs, origin) => {
  const match = usesRef.match(REUSABLE_RE);
  if (!match) {
    return;
  }
  const [, wfOwner, wfRepo, wfPath, wfRef] = match;
  const key = `${wfOwner}/${wfRepo}/${wfPath}@${wfRef}`;

  const src = fetchWorkflow(wfOwner, wfRepo, wfPath, wfRef);
  if (src === null) {
    problems.push({
      kind: 'unresolvable-ref',
      where: origin,
      detail: `cannot fetch ${key} — bad ref, renamed workflow, or no access`,
    });
    return;
  }

  if (passedInputs) {
    const { all, required } = declaredInputs(src);
    const unknown = passedInputs.filter((i) => !all.has(i));
    const missing = required.filter((r) => !passedInputs.includes(r));
    if (unknown.length) {
      problems.push({
        kind: 'unknown-input',
        where: origin,
        detail: `${key} does not accept: ${unknown.join(', ')}`,
      });
    }
    if (missing.length) {
      problems.push({
        kind: 'missing-required-input',
        where: origin,
        detail: `${key} requires: ${missing.join(', ')}`,
      });
    }
  }

  if (seenWorkflows.has(key)) {
    return;
  }
  seenWorkflows.add(key);

  const doc = yaml.load(src);
  for (const ref of collectUses(doc)) {
    noteAction(ref, key);
    if (REUSABLE_RE.test(ref)) {
      // Nested reusable workflows: inputs are wired by the parent, so only scan for actions.
      walk(ref, null, key);
    }
  }
};

for (const { file, src } of localWorkflows) {
  const doc = yaml.load(src);
  for (const ref of collectUses(doc)) {
    noteAction(ref, file);
  }
  for (const call of collectReusableCalls(doc)) {
    walk(call.uses, call.with, `${file} (job: ${call.job})`);
  }
}

// --- allowed-actions policy ---------------------------------------------------

const permissions = gh(`repos/${repoSlug}/actions/permissions`, { allowFail: true });
if (permissions?.allowed_actions === 'selected') {
  const policy = gh(`repos/${repoSlug}/actions/permissions/selected-actions`, { allowFail: true });
  const patterns = policy?.patterns_allowed ?? [];
  const deny = patterns.filter((p) => p.startsWith('!')).map((p) => ({ raw: p, re: patternToRe(p.slice(1)) }));
  const allow = patterns.filter((p) => !p.startsWith('!')).map((p) => ({ raw: p, re: patternToRe(p) }));

  for (const [ref, origins] of actionRefs) {
    const blocked = deny.find((d) => d.re.test(ref));
    if (blocked) {
      problems.push({
        kind: 'blocked-action',
        where: [...origins].join(', '),
        detail: `${ref} is denied by policy pattern ${blocked.raw}`,
      });
      continue;
    }
    const isGitHubOwned = permissions.github_owned_allowed && ref.startsWith('actions/');
    if (!isGitHubOwned && allow.length && !allow.some((a) => a.re.test(ref))) {
      problems.push({
        kind: 'action-not-allowlisted',
        where: [...origins].join(', '),
        detail: `${ref} matches no allow pattern`,
      });
    }
  }
  notes.push(`policy: ${allow.length} allow / ${deny.length} deny patterns`);
} else {
  notes.push(`policy: allowed_actions=${permissions?.allowed_actions ?? 'unreadable'} — action checks skipped`);
}

// --- report -------------------------------------------------------------------

if (asJson) {
  console.log(JSON.stringify({ repo: repoSlug, problems, notes }, null, 2));
} else {
  console.log(`Pre-flight: ${repoSlug}`);
  console.log(`  local workflows:   ${localWorkflows.length}`);
  console.log(`  reusable resolved: ${seenWorkflows.size}`);
  console.log(`  actions checked:   ${actionRefs.size}`);
  notes.forEach((n) => console.log(`  ${n}`));
  console.log('');
  if (problems.length === 0) {
    console.log('PASS — no startup-blocking problems found.');
  } else {
    console.log(`FAIL — ${problems.length} problem(s):\n`);
    for (const p of problems) {
      console.log(`  [${p.kind}] ${p.where}`);
      console.log(`      ${p.detail}\n`);
    }
  }
}

process.exit(problems.length ? 1 : 0);
