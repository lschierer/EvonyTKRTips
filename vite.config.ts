import { gracile, GracileConfig } from "@gracile/gracile/plugin";
import { viteSvgPlugin } from "@gracile/svg/vite";
import { defineConfig } from "vite";
import path from "path";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";
import * as postcssimport from "postcss-import";
import nesting from "tailwindcss/nesting";

const aliases = {
  "@assets": path.resolve(__dirname, "./src"),
  "@src": path.resolve(__dirname, "./src"),
  "@data": path.resolve(__dirname, "./data"),
  "@components": path.resolve(__dirname, "./src/components"),
  "@styles": path.resolve(__dirname, "./src/styles"),
  "@schemas": path.resolve(__dirname, "./src/schemas"),
  "@templates": path.resolve(__dirname, "./src/templates"),
};

const base = "./";

const gracileConfig: GracileConfig = {
  output: "server",
  dev: {
    locals: (_context) => {
      return {
        requestId: crypto.randomUUID(),
        userEmail: "admin@admin.home.arpa",
      };
    },
  },
};

export default defineConfig({
  base: base,
  server: {
    port: 3030,
  },
  resolve: {
    alias: aliases,
  },
  css: {
    devSourcemap: true,
    postcss: {
      plugins: [nesting(), tailwindcss(), autoprefixer()],
    },
  },
  plugins: [
    viteSvgPlugin({ plugins: ["preset-default"] }),
    gracile(gracileConfig),
  ],
});
