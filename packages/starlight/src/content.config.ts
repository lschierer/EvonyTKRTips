import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

import { General } from "@schemas/generals";
import { GeneralAscending } from "@schemas/ascending";
import { SkillBook } from "@schemas/skillBooks";
import { ConfictGroup } from "@schemas/generalConflictGroups";
import { Speciality } from "@schemas/specialities";
import { z } from "astro:schema";

export const collections = {
  docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
  generals: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/generals",
    }),
    schema: General,
  }),
  ascending: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/ascendingAttributes",
    }),
    schema: GeneralAscending,
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
    schema: z.union([SkillBook, z.array(SkillBook)]),
  }),
  specialities: defineCollection({
    loader: glob({
      pattern: "*.json",
      base: "./src/content/specialities",
    }),
    schema: Speciality,
  }),
};
