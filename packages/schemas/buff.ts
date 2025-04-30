import { z } from "zod";
import * as constants from "./constants";

export const Buff = z.object({
  attribute: constants.Attribute,
  value: constants.Value,
  class: constants.TroopClass.optional(),
  condition: z.array(constants.Condition).optional(),
});
export type Buff = z.infer<typeof Buff>;

export const SummarizedBuff = z.object({
  attribute: constants.Attribute,
  class: constants.TroopClass.optional(),
  condition: constants.Condition.array().optional(),
  totalValue: z.number(),
  unit: constants.Unit,
  sources: z
    .object({
      id: z.string(),
      level: z.string(),
      value: z.number(),
    })
    .array(),
});
export type SummarizedBuff = z.infer<typeof SummarizedBuff>;

export const BuffSummaryResponse = z.object({
  summary: SummarizedBuff.array(),
  count: z.number(),
  dataType: z.string(),
  name: z.string().optional(),
  maxLevel: z.string().optional(),
  error: z
    .object({
      status: z.number(),
      code: z.string(),
      message: z.string(),
      details: z.record(z.string(), z.unknown()),
    })
    .optional(),
});
export type BuffSummaryResponse = z.infer<typeof BuffSummaryResponse>;
