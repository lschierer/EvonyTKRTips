import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

import { General } from "@schemas/generals";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  generals: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/generals",
    }),
    schema: General,
  }),
};
