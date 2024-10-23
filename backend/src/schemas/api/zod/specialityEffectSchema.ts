import type { SpecialityEffect } from "../types/SpecialityEffect";
import { buffSchema } from "./buffSchema";
import { specialityLevelNamesSchema } from "./specialityLevelNamesSchema";
import { z } from "zod";

/**
 * @description The Effective Buff Provided by a Speciality at a particular level\n
 */
export const specialityEffectSchema = z
  .object({
    buff: z.array(buffSchema),
    name: z.string(),
    activeLevel: specialityLevelNamesSchema,
  })
  .describe(
    "The Effective Buff Provided by a Speciality at a particular level\n"
  ) as z.ZodType<SpecialityEffect>;

export type SpecialityEffectSchema = z.infer<typeof specialityEffectSchema>;
