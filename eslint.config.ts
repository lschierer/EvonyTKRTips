
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint'; 
import type { Linter } from "eslint";
import globals from "globals";

export default [
  {
    ignores: [
      ".sst"
    ],
  },
  eslint.configs.recommended,
  {
    files: [
      "**/*.ts",
    ],
    ignores: [
      "packages/frontend/src/schemas/**/*.ts",
    ],
    languageOptions: {
      // @ts-expect-error 
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
  },
  {
    files: [
      "packages/frontend/src/schemas/**/*.ts",
    ],
    rules: {
      "no-redeclare": "off"
    },
    languageOptions: {
      // @ts-expect-error 
      parser: tseslint.parser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },
  },
  {
    files: [
      "infrastructure/*.ts",
    ],

  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    }
  },
] satisfies Linter.Config[];


