import type { AscendingLevel } from "../types/AscendingLevel";
import { ascendingLevelNamesSchema } from "./ascendingLevelNamesSchema";
import { buffSchema } from "./buffSchema";
import { z } from "zod";

/**
 * @description The effect of one star of ascending
 */
export const ascendingLevelSchema = z
  .object({
    buffs: z.array(buffSchema),
    level: ascendingLevelNamesSchema,
    active: z.union([z.boolean(), z.null()]),
  })
  .describe(
    "The effect of any one star of ascending"
  ) as z.ZodType<AscendingLevel>;

export type AscendingLevelSchema = z.infer<typeof ascendingLevelSchema>;