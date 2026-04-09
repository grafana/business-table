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
