import { gracile, type GracileConfig } from "@gracile/gracile/plugin";
import { viteSvgPlugin } from "@gracile/svg/vite";
import { defineConfig } from "vite";
import path from "path";

import autoprefixer from "autoprefixer";
import tailwindcss from "tailwindcss";

import nesting from "tailwindcss/nesting";

const aliases = {
  "@assets": path.resolve(__dirname, "./src/assets"),
  "@src": path.resolve(__dirname, "./src"),
  "@components": path.resolve(__dirname, "./src/components"),
  "@styles": path.resolve(__dirname, "./src/styles"),
  "@templates": path.resolve(__dirname, "./src/templates"),
  "@backend": path.resolve(__dirname, "../backend"),
  "@schemas": path.resolve(__dirname, "../backend/src/schemas"),
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
