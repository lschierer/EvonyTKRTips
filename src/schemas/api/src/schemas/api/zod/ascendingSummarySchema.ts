import type { AscendingSummary } from "../../../../types/AscendingSummary";
import { z } from "zod";

 /**
 * @description A simplified representation of a Ascending, typically used in list views.\n
 */
export const ascendingSummarySchema = z.object({ "levels": z.array(z.string()).optional(), "ascendingLevelNamesId": z.string().optional() }).describe("A simplified representation of a Ascending, typically used in list views.\n") as z.ZodType<AscendingSummary>;

 export type AscendingSummarySchema = z.infer<typeof ascendingSummarySchema>;