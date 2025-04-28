import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import globals from "globals";

export default tseslint.config(
  {
    ignores: [
      "**/dist/**",
      "**/public/**",
      "packages/infrastructure/.sst/**",
      "packages/starlight/.astro/**",
      "packages/greenwood/.greenwood/**",
      "packages/greenwood/node_modules/greenwoodspectrumtheme/dist/**",
    ],
  },
  {
    ignores: ["packages/greenwood/node_modules/greenwoodspectrumtheme/dist/**"],
    extends: [
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
    ],
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        {
          allowNumber: true,
        },
      ],
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
      parserOptions: {
        projectService: {
          allowDefaultProject: ["eslint.config.mts"],
        },
        tsconfigRootDir: import.meta.dirname,
        projectFolderIgnoreList: ["**/node_modules/**"],
      },
    },
  },
  {
    files: ["**/*/*.js", "**/*/*.mjs"],
    ignores: ["packages/greenwood/public/**"],
    extends: [eslint.configs.recommended, tseslint.configs.disableTypeChecked],
  },
  {
    files: [
      "packages/greenwood/src/schemas/*.ts",
      "packages/greenwood/src/schemas/*.mts",
      "packages/starlight/src/schemas/*.ts",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  // Add a new configuration specifically for packages/infrastructure
  {
    files: [
      "packages/infrastructure/**/*.ts",
      "packages/infrastructure/**/*.mts",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["packages/infrastructure/sst.config.ts"],
    rules: {
      "@typescript-eslint/triple-slash-reference": "off",
    },
  }
);
