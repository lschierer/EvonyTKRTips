import type { Config } from "tailwindcss";
import tailwindTypography from "@tailwindcss/typography";
const colors = require("tailwindcss/colors");

export default {
  content: ["./server.ts", "src/**/*.ts"],
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        SpectrumCyan: {
          100: "#c5f8ff",
          200: "#a4f0ff",
          300: "#88e7fa",
          400: "#60d8f3",
          500: "#33c5e8",
          600: "#12b0da",
          700: "#019cc8",
          800: "#0086b4",
          900: "#00719f",
          1000: "#005d89",
          1100: "#004a73",
          1200: "#00395d",
          1300: "#002a46",
        },
      },
    },
  },
  plugins: [tailwindTypography()],
} satisfies Config;
