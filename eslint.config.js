// import js from '@eslint/js'
// import globals from 'globals'
// import reactHooks from 'eslint-plugin-react-hooks'
// import reactRefresh from 'eslint-plugin-react-refresh'
// import tseslint from 'typescript-eslint'
// import { globalIgnores } from 'eslint/config'

// export default tseslint.config([
//   globalIgnores(['dist']),
//   {
//     files: ['**/*.{ts,tsx}'],
//     extends: [
//       js.configs.recommended,
//       tseslint.configs.recommended,
//       reactHooks.configs['recommended-latest'],
//       reactRefresh.configs.vite,
//     ],
//     languageOptions: {
//       ecmaVersion: 2020,
//       globals: globals.browser,
//     },
//   },
// ])

import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { globalIgnores } from "eslint/config";

export default [
  globalIgnores(["dist", "node_modules", "vite.config.ts"]),

  //Base JS
  js.configs.recommended,

  //Typescript
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,

  //Project Files
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: "./tsconfig.eslint.json", // ✅ cho phép type-aware linting
        tsconfigRootDir: import.meta.dirname,
      },
    },

    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },

    rules: {
      // React Hooks V7
      ...reactHooks.configs.recommended.rules,
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh
      "react-refresh/only-export-components": "off", // 👈 tắt hoàn toàn

      // TypeScript
      "@typescript-eslint/no-explicit-any": "off", // 👈 cho phép any
      // "@typescript-eslint/no-explicit-any": "error", // 👈 không cho phép any

      // Style
      semi: ["error", "always"],
      quotes: ["error", "double"],
    },
  },
];
