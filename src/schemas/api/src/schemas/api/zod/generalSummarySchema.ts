import type { GeneralSummary } from "../../../../types/GeneralSummary";
import { z } from "zod";

 /**
 * @description The minimal information necessary to find a General
 */
export const generalSummarySchema = z.object({ "name": z.string().optional(), "type": z.string().optional() }).describe("The minimal information necessary to find a General") as z.ZodType<GeneralSummary>;

 export type GeneralSummarySchema = z.infer<typeof generalSummarySchema>;