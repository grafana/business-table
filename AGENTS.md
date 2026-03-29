# AGENTS.md — Business Table (Grafana Panel Plugin)

Frontend-only Grafana panel plugin (`volkovlabs-table-panel`).
Node >= 24, npm, webpack (via `.config/`), TypeScript 5.9+, React 18.

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

### TypeScript Patterns

- **Enums over string unions** for configuration values.
- **JSDoc comments** on every exported interface, type, and their
  fields with `@type` annotations:

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

- **Named exports only** — no default exports in source files.
- **Barrel exports** via `index.ts` in every directory using `export *`.
- **`Props` type** defined at component scope or derived via
  `React.ComponentProps<typeof X>`.

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

Print width: 120, single quotes, trailing commas (es5), semicolons,
2-space indent, no tabs.

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

- **Selectors** via `@volkovlabs/jest-selectors`:

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

- **Never modify anything inside `.config/`** —
  managed by Grafana plugin tooling.
- **Never change `id` or `type`** in `src/plugin.json`.
- Changes to `plugin.json` require a
  **Grafana server restart**.
- Use webpack from `.config/` for builds;
  do not add a custom bundler.
- Use `secureJsonData` for secrets; `jsonData` for non-sensitive config.
- Use `@grafana/plugin-e2e` for E2E tests.
- Grafana API docs:
  <https://grafana.com/developers/plugin-tools/llms.txt>
- `@grafana/ui` component reference:
  <https://developers.grafana.com/ui/latest/index.html>
- **Always run `npx markdownlint-cli`** on any `.md`
  file you create or modify (including `AGENTS.md`,
  `README.md`, `CHANGELOG.md`) and fix all reported
  issues before committing.
- **Always run cspell** after making changes:
  `npx cspell@6.13.3 -c cspell.config.json
  "**/*.{ts,tsx,js,go,md,mdx,yml,yaml,json,scss,css}"`
  and fix any issues before committing. Add new words
  to `cspell.config.json` if they are legitimate.
- **Always update `CHANGELOG.md`** when committing any
  change. Include the changelog update in the same commit.
- **NEVER commit unless the user explicitly asks.**
  Do not commit as part of completing a task.
- **NEVER push unless the user explicitly asks.**
  Do not push as part of completing a task.
- **Prefer subagents** for research, code exploration,
  and multi-step work. Use the Task tool with
  `explore` or `general` agents rather than running
  many search/read commands directly. Launch multiple
  agents in parallel when tasks are independent.
- Code owners: `@grafana/dataviz-squad`.

## Branching Policy

- **Never commit directly to `main`**. Always create a new branch for changes.
- Use descriptive branch names (e.g., `feat/add-feature`, `fix/bug-description`).
- When pushing new commits to a PR, always update the PR summary to reflect all
  changes.
- **Always create pull requests as drafts**
  (`gh pr create --draft`).
- **Wrap PR summary lines at 120 characters.**

## Changelog Policy

**Always update `CHANGELOG.md` when making changes.** Every commit that
modifies code, documentation, dependencies, or configuration must have a
corresponding entry in the changelog under the current unreleased version
section. Add entries as part of the same commit or as a follow-up commit
before pushing.

### Additional Rules

- `no-console` and `no-debugger` are errors.
- `@typescript-eslint/no-deprecated` is a warning — avoid
  using deprecated APIs.
- Unused variables are errors (except rest siblings).

### ESLint

Flat config (ESLint 9) extending `@grafana/eslint-config/flat.js`,
`@volkovlabs/eslint-config`, and `eslint-config-prettier`. Custom rule:
`@typescript-eslint/no-empty-object-type: off`. Test files, mocks, config
files, and server dirs are excluded from linting.
