import type { BasicAttributesSummary } from "../../../../types/BasicAttributesSummary";
import { z } from "zod";

 /**
 * @description A summary form of the Basic Attributes, after they have been instantiated at a particular level and computed.
 */
export const basicAttributesSummarySchema = z.object({ "attack": z.number().int().optional(), "defense": z.number().int().optional(), "politics": z.number().int().optional(), "leadership": z.number().int().optional(), "attack_base": z.number().int().optional(), "defense_base": z.number().int().optional(), "politics_base": z.number().int().optional(), "leadership_base": z.number().int().optional(), "attack_increment": z.number().int().optional(), "defense_increment": z.number().int().optional(), "politics_increment": z.number().int().optional(), "leadership_increment": z.number().int().optional() }).describe("A summary form of the Basic Attributes, after they have been instantiated at a particular level and computed. ") as z.ZodType<BasicAttributesSummary>;

 export type BasicAttributesSummarySchema = z.infer<typeof basicAttributesSummarySchema>;