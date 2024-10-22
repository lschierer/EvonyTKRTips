import type { Ascending } from "../types/Ascending";
import { ascendingLevelNamesSchema } from "./ascendingLevelNamesSchema";
import { ascendingLevelSchema } from "./ascendingLevelSchema";
import { z } from "zod";

 /**
 * @description The overall effeects of Ascending a General
 */
export const ascendingSchema = z.object({ "levels": z.array(z.lazy(() => ascendingLevelSchema)), "activeLevel": z.lazy(() => ascendingLevelNamesSchema) }).describe("The overall effeects of Ascending a General") as z.ZodType<Ascending>;

 export type AscendingSchema = z.infer<typeof ascendingSchema>;