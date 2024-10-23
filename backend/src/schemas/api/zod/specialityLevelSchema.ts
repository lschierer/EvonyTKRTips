import type { SpecialityLevel } from "../types/SpecialityLevel";
import { buffSchema } from "./buffSchema";
import { specialityLevelNamesSchema } from "./specialityLevelNamesSchema";
import { z } from "zod";

export const specialityLevelSchema = z.object({
  Buffs: z.array(buffSchema),
  level: specialityLevelNamesSchema,
  active: z.boolean().optional(),
}) as z.ZodType<SpecialityLevel>;

export type SpecialityLevelSchema = z.infer<typeof specialityLevelSchema>;
