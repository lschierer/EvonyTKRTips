import { defineConfig } from "@kubb/core";
import { pluginOas } from "@kubb/plugin-oas";
import { pluginTs } from "@kubb/plugin-ts";
import { pluginZod } from "@kubb/plugin-zod";

export default defineConfig(() => {
  return {
    root: ".",
    input: {
      path: "./share/evonytkrtips-backend.yaml",
    },
    output: {
      path: "./src/schemas/api",
      clean: true,
      write: true,
      mode: "split",
      barrelType: "named",
      extension: {
        ".ts": "",
        ".json": ".json",
      },
    },
    plugins: [
      pluginOas({
        contentType: "application/json",
        validate: true,
        output: {
          path: "./oas",
        },
      }),
      pluginTs({}),
      pluginZod({
        output: {
          path: "./zod",
        },
        typed: true,
        inferred: true,
      }),
    ],
  };
});
