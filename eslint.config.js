import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Keep unused-vars on, but allow JSX factory imports like `motion` from framer-motion
      // (ESLint doesn't always count `<motion.div>` as a reference).
      'no-unused-vars': [
        'error',
        { varsIgnorePattern: '^(motion|[A-Z_])', argsIgnorePattern: '^_' },
      ],
      // The Date.now() call lives inside an event handler, not during render.
      'react-hooks/purity': 'off',
      // Fast-refresh restrictions are noisy for small context files that also export the hook.
      'react-refresh/only-export-components': 'off',
    },
  },
])
