# AGENTS.md — Business Table (Grafana Panel Plugin)

Frontend-only Grafana panel plugin (`volkovlabs-table-panel`).
Node >= 24, npm, webpack (via `.config/`), TypeScript 5.9+, React 18 + React 19.

## Build & Dev Commands

```bash
npm run build          # Production build (webpack)
npm run dev            # Dev build with watch mode + live reload
npm run typecheck      # tsc --noEmit
npm run lint           # ESLint (ts/tsx/js/jsx)
npm run lint:fix       # ESLint with auto-fix
npm run test           # Jest in watch mode (changed files only)
npm run test:ci        # Jest full run (CI, 4 workers)
npm run test:e2e       # Playwright E2E tests
npm run test:e2e:dev   # Playwright interactive UI mode
npm run test:e2e:docker # Full Docker Compose (Grafana + tests)
npm run start          # Docker compose: Grafana + plugin (dev profile)
npm run stop           # Docker compose down
```

### Running a Single Test

```bash
npx jest src/components/Table/Table.test.tsx           # Single file
npx jest src/components/Table/Table.test.tsx -t "Should render"  # Single test by name
npx jest --testPathPattern="useTable"                  # Pattern match on path
```

Jest config: `resetMocks: true` (mocks reset between tests),
`randomize: true` (random test order), timezone forced to UTC.

## Project Structure

```text
src/
  components/       # React components (editors/, Table/, TablePanel/, ui/)
  hooks/            # Custom React hooks (useTable, useAutoSave, usePagination, etc.)
  types/            # TypeScript type definitions with barrel exports
  utils/            # Utility functions (actions, editor, export, table, test, etc.)
  constants.ts      # TEST_IDS, default configs, page sizes, regex patterns
  migration.ts      # Panel options migration handler
  module.ts         # PanelPlugin entry point
  plugin.json       # Plugin manifest
  __mocks__/        # Jest manual mocks for @grafana/*, @hello-pangea/dnd, etc.
test/               # Playwright E2E tests + helpers
provisioning/       # Grafana dashboard/datasource provisioning JSON
```

Path alias: `@/` maps to `src/` (webpack, tsconfig, and jest all resolve it).

## Code Style

### Import Ordering

Imports follow this strict order with blank lines between groups:

1. `@grafana/*` packages (data, runtime, ui, schema, e2e-selectors)
2. Third-party packages (`@tanstack/*`, `@emotion/css`, `react`, `semver`, etc.)
3. Path-aliased imports (`@/constants`, `@/hooks`, `@/types`, `@/utils`)
4. Relative imports (`./`, `../`)

```typescript
import { PanelProps } from '@grafana/data';
import { config } from '@grafana/runtime';
import { Alert, Button, useStyles2 } from '@grafana/ui';

import { Table as TableInstance } from '@tanstack/react-table';
import React, { useCallback, useMemo, useState } from 'react';

import { TEST_IDS } from '@/constants';
import { useContentSizes, useTable } from '@/hooks';
import { PanelOptions } from '@/types';

import { Table } from '../Table';
import { getStyles } from './TablePanel.styles';
```

### Naming Conventions

| Element          | Convention                       | Example                                          |
| ---------------- | -------------------------------- | ------------------------------------------------ |
| Components       | PascalCase files + named exports | `TablePanel.tsx`, `export const TablePanel`      |
| Hooks            | `use` prefix, camelCase          | `useAutoSave.ts`, `useTable.ts`                  |
| Type files       | kebab-case                       | `column-editor.ts`, `nested-object.ts`           |
| Interfaces/Types | PascalCase                       | `PanelOptions`, `ColumnConfig`                   |
| Enums            | PascalCase name, SCREAMING_SNAKE | `CellType.COLORED_TEXT`, `ColumnAlignment.START` |
| Constants        | SCREAMING_SNAKE_CASE             | `TEST_IDS`, `AUTO_SAVE_TIMEOUT`                  |
| Styles files     | `Component.styles.ts`            | `TablePanel.styles.ts`                           |

### JSDoc Comments

This codebase uses **pervasive JSDoc comments**. Add `/** ... */` blocks above:

- Every interface and each of its properties (include `@type` tags on properties)
- Every function and constant declaration
- Logical sections within function bodies (state, theme, callbacks, return)

```typescript
/**
 * Query Options Mapper
 */
export interface QueryOptionsMapper {
  /**
   * Source
   *
   * @type {number}
   */
  source: string | number;
}
```

### TypeScript Patterns

- **Enums over string unions** for configuration values.
- **Named exports only** — no default exports in source files.
- **Barrel exports** via `index.ts` in every directory using `export *`.
- **`Props` type** defined at component scope or derived via
  `React.ComponentProps<typeof X>`.

### React Components

- **Functional components only** using `React.FC<Props>` with arrow functions.
- Props destructured in the function signature, not inside the body.
- Styles via `@emotion/css` + Grafana's `useStyles2(getStyles)` pattern.
- Style functions: `(theme: GrafanaTheme2) => ({ className: css\`...\` })`.
- Wrap callbacks in `useCallback` with explicit dependency arrays.
- All testable elements must use `data-testid={TEST_IDS.section.element}`.
- Centralized test IDs live in `src/constants/tests.ts`.

### Error Handling

- Use **try/catch** in async effects; store errors in state with `setError(e)`.
- Display errors with Grafana's `<Alert severity="error">` component.
- Format: `error instanceof Error ? error.message : \`${error}\``.
- Wrap `new Function(...)` calls in try/catch; return a no-op on failure and log with `console.error`.
- Effects that subscribe must return cleanup functions calling `unsubscribe()`.

### Styles

Use `@emotion/css` with the `getStyles` pattern and `useStyles2`:

```typescript
// TablePanel.styles.ts
import { css } from '@emotion/css';
import { GrafanaTheme2 } from '@grafana/data';

export const getStyles = (theme: GrafanaTheme2) => ({
  root: css`
    display: flex;
  `,
});

// TablePanel.tsx
const styles = useStyles2(getStyles);
```

### Formatting (Prettier)

See `.prettierrc.js`. Print width 120, single quotes, 2-space indent.

## Testing Conventions

### Unit Tests (Jest + Testing Library)

- Use `describe()` / `it()` — never `test()`.
- **Component factory pattern** — every test file defines
  `getComponent(props: Partial<Props>)`:

  ```typescript
  const getComponent = (props: Partial<Props>) => {
    return <Component defaultProp={value} {...(props as any)} />;
  };
  ```

- **Selectors** via `@/utils/test-selectors`:

  ```typescript
  const selectors = getJestSelectors(TEST_IDS.someComponent)(screen);
  expect(selectors.root()).toBeInTheDocument();
  ```

- **Mocks**: `jest.mock()` at module level. Add JSDoc comment above
  each mock. Use `jest.mocked()` for type-safe mock access.
- **Test data factories** in `src/utils/test.ts` — use
  `createColumnConfig()`, `createPanelOptions()`, `createField()`,
  etc. All accept `Partial<T>`.
- **Async**: use `async/await` with `act()`. For timers:
  `jest.useFakeTimers()` + `jest.runOnlyPendingTimers()`.
- **Hook tests**: `renderHook(() => useHookName(...))`
  from `@testing-library/react`.

### E2E Tests (Playwright)

- Framework: `@grafana/plugin-e2e` with Playwright.
- Tests in `test/` directory, helpers in `test/utils/`.
- Helper classes: `PanelHelper`, `TableHelper`, `TableRowHelper`, etc.
- Provisioned dashboards in `provisioning/dashboards/`.

## Critical Rules

- **No Volkov Labs references.** Do not use `volkovlabs.io`
  URLs or add `@volkovlabs/*` packages. All have been
  replaced with local implementations. Use `grafana.com`
  equivalents.
- **Never modify `.config/`** — managed by Grafana plugin tooling.
- **Never change `id` or `type`** in `src/plugin.json`.
  Changes to `plugin.json` require a Grafana server restart.
- Grafana API docs:
  <https://grafana.com/developers/plugin-tools/llms.txt>
- `@grafana/ui` component reference:
  <https://developers.grafana.com/ui/latest/index.html>
- **Check `test/Dockerfile`** uses the latest versioned
  `noble` Playwright image from `mcr.microsoft.com/playwright`.
  When bumping `@playwright/test` in `package.json`, also
  update the `FROM mcr.microsoft.com/playwright:vX.Y.Z-noble`
  pin in `test/Dockerfile` to the same version — the base
  image ships with a specific browser build that has to
  match the `@playwright/test` library.
- **`@grafana/data`, `@grafana/runtime`, and `@grafana/ui`
  are pinned to exact versions** (no caret) in `package.json`.
  `@grafana/ui` regularly lags the other two by a patch, so
  caret ranges let npm resolve them to mismatched versions.
  Bump all three together as a set when updating.
- **`test-exclude` has a top-level override** to `^7.0.1`
  in `package.json`. `babel-plugin-istanbul@7` pulls in
  `test-exclude@6`, which calls `promisify(require('glob'))`
  and breaks under the `glob@11` override used elsewhere in
  this file. v7+ uses a destructured glob import and works
  with any glob version. Keep the override in place.
- Code owners: `@grafana/dataviz-squad`.

### Pre-commit Checklist

Run all of these before committing and fix any issues:

1. `npm run typecheck` (when `src/` files changed)
2. `npm run lint` (fix with `npm run lint:fix`)
3. `npx cspell -c cspell.config.json "**/*.{ts,tsx,js,go,md,mdx,yml,yaml,json,scss,css}"`
4. `npx markdownlint-cli2` on any changed `.md` files

### Commit and Push Rules

- **NEVER commit unless the user explicitly asks.**
- **NEVER push unless the user explicitly asks.**
  Never chain `git commit && git push` in one command.
- **Never add `Co-Authored-By` trailers** or "Generated
  with Claude" attribution to commits, PRs, or output.
- **Prefer subagents** for research, code exploration,
  and multi-step work. Launch multiple agents in parallel
  when tasks are independent.

## Branching Policy

- **Never commit directly to `main`**. Always create a new branch for changes.
- Use descriptive branch names (e.g., `feat/add-feature`, `fix/bug-description`).
- **After pushing, always update the PR summary** if a
  PR exists for the current branch. Treat push and PR
  update as an atomic pair — never stop between them.
  Use `gh pr edit` to update the title and body with
  well-formatted text that reflects all changes across
  the entire branch.
- **Always create pull requests as drafts**
  (`gh pr create --draft`).
- When checking out a branch or `main`, always
  `git fetch` and `git pull` to ensure you have the
  latest changes.
- **Always run `git status`** before constructing
  `git add` commands. Only add files that are unstaged
  or untracked — do not add files that are already
  staged or deleted.

## Changelog Policy

**Always update `CHANGELOG.md` when making changes.** Every commit that
modifies code, documentation, dependencies, or configuration must have a
corresponding entry in the changelog under the current unreleased version
section. Add entries as part of the same commit or as a follow-up commit
before pushing.

Categorize under `### Added`, `### Changed`, `### Removed`, `### Fixed`,
or `### Project Updates` as appropriate. Group related items together
rather than listing one entry per commit — keep the changelog concise
and scannable for reviewers. After each commit, update the changelog
as needed, then run `npx markdownlint-cli2 CHANGELOG.md` and
`npx cspell -c cspell.config.json CHANGELOG.md` before committing
the changelog update.

## CI/CD

- **CI** (`.github/workflows/push.yml`): Runs on push to `main` and all PRs.
  Uses `grafana/plugin-ci-workflows`. E2E tests run via Docker Compose against
  Grafana `>=12.3 <=13.0`. The dev image is skipped but the React 19 preview
  image is included (`run-playwright-with-skip-grafana-react-19-preview-image: false`).
- **CD** (`.github/workflows/publish.yml`): Manual dispatch to dev/ops/prod environments.
- **Do NOT pin `grafana/plugin-ci-workflows` to a commit SHA.** Grafana's CI
  enforces tagged releases only (e.g., `@ci-cd-workflows/v7`). SHA pinning
  will fail the "Check for release channel" job. All other GitHub Actions
  should be pinned to SHAs.

## PR Summary Policy

- **Wrap PR summary lines at 120 characters** — use the
  full width, do not wrap shorter than necessary.
- **Use categories in PR summaries** to organize changes.
  Group bullet points under headings like `### Added`,
  `### Fixed`, `### Changed`, `### Removed`,
  `### Dependencies`, `### CI/CD`, `### Documentation`,
  `### AGENTS.md`, `### Tooling`, etc.
- Always include a `## Test plan` section with a
  checklist of manual or automated verification steps.

## ESLint

See `eslint.config.mjs`. Key rules: `no-console` and `no-debugger`
are errors, `@typescript-eslint/no-deprecated` is a warning.
