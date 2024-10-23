import type { BasicAttributesObjectSummary } from "../types/BasicAttributesObjectSummary";
import { z } from "zod";

/**
 * @description A simplified representation of a BasicAttributesObject, typically used in list views.
 */
export const basicAttributesObjectSummarySchema = z
  .object({
    Base: z.number().optional(),
    //Total: z.number().optional(),
    Increment: z.number().optional(),
  })
  .describe(
    "A simplified representation of a BasicAttributesObject, typically used in list views."
  ) as z.ZodType<BasicAttributesObjectSummary>;

export type BasicAttributesObjectSummarySchema = z.infer<
  typeof basicAttributesObjectSummarySchema
>;
