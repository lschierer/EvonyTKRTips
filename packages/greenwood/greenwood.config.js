import { greenwoodPluginTypeScript } from "@greenwood/plugin-typescript";
import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";

export default {
  activeContent: true,
  isolation: true,
  optimization: "default",
  prerender: false,
  staticRouter: false,
  markdown: {
    plugins: ["rehype-autolink-headings", "remark-gfm", "remark-rehype"],
    settings: {
      commonmark: true,
    },
  },
  plugins: [
    greenwoodPluginTypeScript({
      extendConfig: true,
    }),
    greenwoodPluginPostCss({
      extendConfig: true,
    }),
  ],
};
