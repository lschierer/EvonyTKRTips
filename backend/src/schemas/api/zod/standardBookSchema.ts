import type { StandardBook } from "../types/StandardBook";
import { buffSchema } from "./buffSchema";
import { z } from "zod";

/**
 * @description Standard Books that can be added to a General
 */
export const standardBookSchema = z
  .object({
    name: z.string(),
    buffs: z.array(buffSchema),
    level: z.number().int().min(1).max(4),
  })
  .describe(
    "Standard Books that can be added to a General"
  ) as z.ZodType<StandardBook>;

export type StandardBookSchema = z.infer<typeof standardBookSchema>;
