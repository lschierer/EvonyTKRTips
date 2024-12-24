import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

import { TopLevelSections } from "./src/lib/topLevelSections";

import mdx from "@astrojs/mdx";

import node from "@astrojs/node";

export default defineConfig({
  site: "https://www.evonytkrtips.net",
  trailingSlash: "always",
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    starlight({
      prerender: false,
      title: "Evony TKR Tips",
      logo: {
        src: "./src/assets/Logo.svg",
        replacesTitle: true,
      },
      social: {
        github: "https://github.com/lschierer/EvonyTKRTips",
      },
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 4 },
      pagefind: false,
      customCss: [
        "@spectrum-css/tokens/dist/index.css",
        "@spectrum-css/typography/dist/index.css",
        "@spectrum-css/link/dist/index.css",
        "@spectrum-css/page/dist/index.css",
        "./src/styles/global.css",
      ],
      components: {
        Header: "./src/components/Header.astro",
        ThemeProvider: "./src/components/ThemeProvider.astro",
        PageFrame: "./src/components/PageFrame.astro",
      },
      sidebar: TopLevelSections.options.map((section) => {
        return {
          label: section.replaceAll("_", " "),
          autogenerate: {
            directory: section.replaceAll(" ", ""),
            collapsed: true,
          },
          collapsed: true,
        };
      }),
    }),
    mdx(),
  ],
});
