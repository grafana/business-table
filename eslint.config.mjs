import { defineConfig } from 'eslint/config';
import prettierConfig from 'eslint-config-prettier/flat';
import grafanaConfig from '@grafana/eslint-config/flat.js';

/**
 * Config
 */
export default defineConfig([
  ...grafanaConfig,
  prettierConfig,
  {
    rules: {
      'react/prop-types': 'off',
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-deprecated': 'warn',
      // Opt-in/experimental React Compiler rules — disabled (not applicable to this codebase)
      'react-hooks/component-hook-factories': 'off',
      'react-hooks/config': 'off',
      'react-hooks/error-boundaries': 'off',
      'react-hooks/gating': 'off',
      'react-hooks/globals': 'off',
      'react-hooks/static-components': 'off',
      // Real-bug rules — warn (surface debt without blocking CI; fix in follow-up)
      'react-hooks/immutability': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/set-state-in-render': 'warn',
      'react-hooks/use-memo': 'warn',
    },
  },
  {
    ignores: [
      '.config/*',
      '.prettierrc.js',
      'coverage/*',
      'dist/*',
      'eslint.config.mjs',
      'jest*.js',
      'playwright.config.ts',
      'src/__mocks__/**',
      'src/**/*.test.ts*',
      'test/*',
      'webpack.config.ts',
    ],
  },
]);
