
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint'; 
import type { Linter } from "eslint";

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
    languageOptions: {
      parser: tseslint.parser
    }
  },
  {
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    }
  },
] satisfies Linter.Config[];


/*
eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: '.',
      },
    },
  },
  */