import type { SpecialityLevel } from "../types/SpecialityLevel";
import { buffSchema } from "./buffSchema";
import { specialityLevelNamesSchema } from "./specialityLevelNamesSchema";
import { z } from "zod";

 export const specialityLevelSchema = z.object({ "Buffs": z.array(z.lazy(() => buffSchema)), "level": z.lazy(() => specialityLevelNamesSchema), "active": z.union([z.boolean(), z.null()]) }) as z.ZodType<SpecialityLevel>;

 export type SpecialityLevelSchema = z.infer<typeof specialityLevelSchema>;