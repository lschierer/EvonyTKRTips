import type { Config } from "tailwindcss";
import tailwindTypography from "@tailwindcss/typography";
import colors from "tailwindcss/colors";

export default {
  content: {
    files: ["./src/**/*.{js,ts}"],
  },
  darkMode: "selector",
  theme: {
    extend: {
      colors: {
        mintcream: "#F5FFFA",
        darkslategray: "#2f4f4f ",
        SpectrumCyan: {
          100: "var(--spectrum-cyan-100)",
          200: "var(--spectrum-cyan-200)",
          300: "var(--spectrum-cyan-300)",
          400: "var(--spectrum-cyan-400)",
          500: "var(--spectrum-cyan-500)",
          600: "var(--spectrum-cyan-600)",
          700: "var(--spectrum-cyan-700)",
          800: "var(--spectrum-cyan-800)",
          900: "var(--spectrum-cyan-900)",
          1000: "var(--spectrum-cyan-1000)",
          1100: "var(--spectrum-cyan-1100)",
          1200: "var(--spectrum-cyan-1200)",
          1300: "var(--spectrum-cyan-1300)",
        },
      },
    },
  },
  plugins: [tailwindTypography()],
} satisfies Config;
