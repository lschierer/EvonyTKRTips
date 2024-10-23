import type { BasicAttributesSummary } from "../types/BasicAttributesSummary";
import { z } from "zod";
import { basicAttributesObjectSummarySchema } from "./basicAttributesObjectSummarySchema";
/**
 * @description A summary form of the Basic Attributes, after they have been instantiated at a particular level and computed.
 */
export const basicAttributesSummarySchema = z
  .object({
    Leadership: basicAttributesObjectSummarySchema,
    Attack: basicAttributesObjectSummarySchema,
    Defense: basicAttributesObjectSummarySchema,
    Politics: basicAttributesObjectSummarySchema,
  })
  .describe(
    "A summary form of the Basic Attributes, after they have been instantiated at a particular level and computed. "
  ) as z.ZodType<BasicAttributesSummary>;

export type BasicAttributesSummarySchema = z.infer<
  typeof basicAttributesSummarySchema
>;
