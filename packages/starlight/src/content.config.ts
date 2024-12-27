import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

import { General } from "@schemas/generals";
import { skillBooks } from "@components/generals/store";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  generals: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/generals",
    }),
    schema: General,
  }),
  skillBooks: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/skillBooks",
    }),
  }),
};
