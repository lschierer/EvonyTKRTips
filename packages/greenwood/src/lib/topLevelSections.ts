import { z } from "zod";

export const TopLevelSections = z.enum([
  "Generals",
  "Monsters",
  "PvP",
  "Reference",
]);
export type TopLevelSections = z.infer<typeof TopLevelSections>;
