// eslint.config.js
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier'; // Correct Prettier plugin import

export default [
  {
    ignores: ['dist', 'node_modules'], // Ignore build & dependency directories
  },
  {
    files: ['**/*.{ts,tsx}'], // Target TypeScript files
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser, // Allow browser globals
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin, // Prettier plugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      
      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'warn',

      // React rules
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Prettier integration
      'prettier/prettier': 'error', // Use Prettier for formatting
    },
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },
  prettier, // Apply Prettier config last
];
