import type { PurpleGeneralAscendingLevels } from "../../../../types/PurpleGeneralAscendingLevels";
import { z } from "zod";

 /**
 * @description Ascending Levels for Purple Generals
 */
export const purpleGeneralAscendingLevelsSchema = z.enum(["None", "1Purple", "2Purple", "3Purple", "4Purple", "5Purple"]).default("None").describe("Ascending Levels for Purple Generals") as z.ZodType<PurpleGeneralAscendingLevels>;

 export type PurpleGeneralAscendingLevelsSchema = z.infer<typeof purpleGeneralAscendingLevelsSchema>;