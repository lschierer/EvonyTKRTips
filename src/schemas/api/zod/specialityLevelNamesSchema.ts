import type { SpecialityLevelNames } from "../types/SpecialityLevelNames";
import { z } from "zod";

 export const specialityLevelNamesSchema = z.enum(["None", "Green", "Blue", "Purple", "Orange", "Gold"]).default("None") as z.ZodType<SpecialityLevelNames>;

 export type SpecialityLevelNamesSchema = z.infer<typeof specialityLevelNamesSchema>;