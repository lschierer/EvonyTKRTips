import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

import { General } from "@schemas/generals";
import { SkillBook } from "@schemas/skillBooks";
import { ConfictGroup } from "@schemas/generalConflictGroups";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  generals: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/generals",
    }),
    schema: General,
  }),
  conflictGroups: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/generalConflictGroups",
    }),
    schema: ConfictGroup,
  }),
  skillBooks: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/skillBooks",
    }),
    schema: SkillBook,
  }),
};
