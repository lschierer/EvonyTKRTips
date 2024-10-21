import { gracile } from "@gracile/gracile/plugin";
import { viteSvgPlugin } from "@gracile/svg/vite";

import { defineConfig } from "vite";
import path from "path";

const aliases = {
  "@assets": path.resolve(__dirname, "./src"),
  "@src": path.resolve(__dirname, "./src"),
  "@data": path.resolve(__dirname, "./data"),
  "@components": path.resolve(__dirname, "./src/components"),
  "@styles": path.resolve(__dirname, "./src/styles"),
  "@schemas": path.resolve(__dirname, "./src/schemas"),
  "@templates": path.resolve(__dirname, "./src/templates"),
};

export default defineConfig(({ command, mode }) => {
  if (command === "serve") {
    return {
      base: "https://www.evonytkrtips.net/",
      server: {
        port: 3030,
      },
      resolve: {
        alias: aliases,
      },
      plugins: [
        gracile({
          output: "server",
        }),
      ],
    };
  } else {
    return {
      server: {
        port: 3030,
      },
      resolve: {
        alias: aliases,
      },
      plugins: [
        viteSvgPlugin({ plugins: ["preset-default"] }),
        gracile({
          output: "server",
          dev: {
            locals: (_context) => {
              return {
                requestId: crypto.randomUUID(),
                userEmail: "admin@admin.home.arpa",
              };
            },
          },
        }),
      ],
    };
  }
});
