import { gracile } from "@gracile/gracile/plugin";
import { defineConfig } from "vite";
import path from "path";
import devServer from "@hono/vite-dev-server";
import bunAdapter from "@hono/vite-dev-server/bun";

export default defineConfig({
  server: {
    port: 3030,
  },
  resolve: {
    alias: {
      "@src": path.resolve(__dirname, "./src"),
      "@data": path.resolve(__dirname, "./data"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@schemas": path.resolve(__dirname, "./src/schemas"),
      "@templates": path.resolve(__dirname, "./src/templates"),
    },
  },
  plugins: [
    devServer({
      entry: "./server.ts",
      injectClientScript: false,
      adapter: bunAdapter,
      exclude: ["/api/*"],
    }),
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
});
