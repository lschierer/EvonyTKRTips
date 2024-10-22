import type { Speciality } from "../../../../types/Speciality";
import { specialityLevelNamesSchema } from "./specialityLevelNamesSchema";
import { z } from "zod";

 export const specialitySchema = z.object({ "name": z.string(), "levels": z.array(z.lazy(() => specialityLevelNamesSchema)) }) as z.ZodType<Speciality>;

 export type SpecialitySchema = z.infer<typeof specialitySchema>;