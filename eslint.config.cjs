// ESLint v9+ flat config.
//
// Important: ESLint can only auto-fix rules that are marked as fixable.
// Many common TS rules (e.g. unused-vars) are NOT auto-fixable.
// To make `eslint --fix` actually format code, we enable `eslint-plugin-prettier`.

const tsPlugin = require("@typescript-eslint/eslint-plugin")
const tsParser = require("@typescript-eslint/parser")
const prettierPlugin = require("eslint-plugin-prettier")
const prettierConfig = require("eslint-config-prettier")

module.exports = [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/coverage/**",
    ],
  },
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: {
        // Browser + ES2021 globals
        console: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        Promise: "readonly",
        Set: "readonly",
        Map: "readonly",
        WeakMap: "readonly",
        WeakSet: "readonly",
        Symbol: "readonly",
        BigInt: "readonly",
        globalThis: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      // Keep legacy behavior
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "off",

      // Make `eslint --fix` apply Prettier formatting
      "prettier/prettier": "warn",

      // Disable rules that conflict with Prettier
      ...prettierConfig.rules,
    },
  },
]
