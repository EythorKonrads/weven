// @ts-check
import { defineConfig, globalIgnores } from 'eslint/config';
import expoConfig from 'eslint-config-expo/flat.js';
import prettierConfig from 'eslint-config-prettier/flat';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const frameworkImports = {
  patterns: [
    {
      group: ['react', 'react/*', 'react-dom', 'react-dom/*', 'react-native', 'react-native/*'],
      message: 'packages/core is pure TypeScript: no React or React Native.',
    },
    {
      group: ['expo', 'expo-*', 'expo/*', '@expo/*'],
      message: 'packages/core must not import Expo.',
    },
    { group: ['@supabase/*'], message: 'packages/core must not import Supabase.' },
  ],
};

export default defineConfig([
  globalIgnores([
    '**/node_modules/',
    '**/.expo/',
    '**/dist/',
    '**/web-build/',
    '**/expo-env.d.ts',
    'packages/core/src/database.types.ts',
    'supabase/functions/', // Deno; linted by `deno lint` when Edge Functions grow
    'factory/',
    '.claude/',
  ]),

  // Expo's config brings React, react-hooks, import and the @typescript-eslint plugin.
  ...expoConfig,

  // typescript-eslint's recommended rules on top (the plugin is already registered by Expo).
  {
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      ...Object.assign({}, ...tseslint.configs.recommended.map((config) => config.rules ?? {})),
      '@typescript-eslint/no-explicit-any': 'error',
      // tsc resolves imports (including the @/ alias) more accurately than eslint-plugin-import.
      'import/no-unresolved': 'off',
    },
  },

  {
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error',
      // Flags idiomatic namespace use like fc.assert and i18n.use.
      'import/no-named-as-default-member': 'off',
    },
  },

  // Import boundary: packages/core stays framework-free.
  {
    files: ['packages/core/**/*.ts'],
    rules: {
      'no-restricted-imports': ['error', frameworkImports],
      '@typescript-eslint/no-restricted-imports': ['error', frameworkImports],
    },
  },

  // Node-run config files.
  {
    files: ['**/*.config.{js,cjs,mjs,ts}', '**/jest.setup.{js,ts}'],
    languageOptions: { globals: globals.node },
  },

  // Formatting belongs to Prettier.
  prettierConfig,
]);
