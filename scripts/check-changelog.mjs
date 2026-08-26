#!/usr/bin/env node
/**
 * Changelog release-readiness check.
 *
 * Mirrors the `check-changelog` gate in .github/workflows/publish.yml so the failure shows up
 * at commit time rather than after a CD dispatch:
 *
 *   1. No `[Unreleased]` heading above the newest released version.
 *   2. That newest released version matches package.json.
 *
 * The publish workflow's error message promises (2) but only actually tests (1), so this is
 * slightly stricter than CD by design - version/changelog drift is exactly the kind of thing
 * that is cheap to fix now and expensive to discover mid-release.
 *
 * Usage: node scripts/check-changelog.mjs
 */

import { readFileSync } from 'node:fs';

const CHANGELOG = 'CHANGELOG.md';

const lines = readFileSync(CHANGELOG, 'utf8').split('\n');
const { version } = JSON.parse(readFileSync('package.json', 'utf8'));

const unreleasedIdx = lines.findIndex((l) => /^## \[Unreleased\]/.test(l));
const releaseIdx = lines.findIndex((l) => /^## \[[0-9]/.test(l));

const problems = [];

if (unreleasedIdx !== -1 && (releaseIdx === -1 || unreleasedIdx < releaseIdx)) {
  problems.push(
    `${CHANGELOG}:${unreleasedIdx + 1} has an [Unreleased] section above the newest release.\n` +
      `    CD refuses to publish with one. Stamp it as a released version (expected ${version}).`
  );
}

if (releaseIdx === -1) {
  problems.push(`${CHANGELOG} has no released version heading (expected one for ${version}).`);
} else {
  const heading = lines[releaseIdx].match(/^## \[([^\]]+)\]/)?.[1];
  if (heading !== version) {
    problems.push(
      `${CHANGELOG}:${releaseIdx + 1} newest release is [${heading}] but package.json is ${version}.\n` +
        `    Bump them together, or CD will publish a version with no matching notes.`
    );
  }
}

if (problems.length) {
  console.error(`changelog check FAILED (${problems.length}):\n`);
  problems.forEach((p) => console.error(`  - ${p}\n`));
  process.exit(1);
}

console.log(`changelog check OK - [${version}] is the newest release, no [Unreleased] section.`);
