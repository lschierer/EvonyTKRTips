import { gracile } from "@gracile/gracile/plugin";
import { defineConfig } from "vite";
import path from "path";

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
    },
  },
  plugins: [
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
