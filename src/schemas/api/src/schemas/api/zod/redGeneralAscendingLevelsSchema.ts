import type { RedGeneralAscendingLevels } from "../../../../types/RedGeneralAscendingLevels";
import { z } from "zod";

 /**
 * @description AscendingLevels for Red Generals
 */
export const redGeneralAscendingLevelsSchema = z.enum(["None", "1Red", "2Red", "3Red", "4Red", "5Red"]).default("None").describe("AscendingLevels for Red Generals") as z.ZodType<RedGeneralAscendingLevels>;

 export type RedGeneralAscendingLevelsSchema = z.infer<typeof redGeneralAscendingLevelsSchema>;