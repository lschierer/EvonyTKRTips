import type { Config } from "tailwindcss";
import tailwindTypography from "@tailwindcss/typography";

export default {
  content: ["./server.ts", "src/**/*.ts"],
  theme: {
    extend: {},
  },
  plugins: [tailwindTypography()],
} satisfies Config;
