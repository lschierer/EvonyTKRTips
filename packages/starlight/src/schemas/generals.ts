import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

export const Display = z.enum(["summary"]);
export type Display = z.infer<typeof Display>;

export const GeneralType = z.enum([
  "ground_specialist",
  "mayor",
  "mounted_specialist",
  "ranged_specialist",
  "siege_specialist",
]);
export type GeneralType = z.infer<typeof GeneralType>;

export const BasicAttribute = z.object({
  base: z.number(),
  increment: z.number(),
});
export type BasicAttribute = z.infer<typeof BasicAttribute>;

export const Note = z.object({
  severity: z.string(),
  text: z.string(),
});
export type Note = z.infer<typeof Note>;

export const BasicAttributes = z.object({
  attack: BasicAttribute,
  defense: BasicAttribute,
  leadership: BasicAttribute,
  politics: BasicAttribute,
});
export type BasicAttributes = z.infer<typeof BasicAttributes>;

export const General = z.object({
  ascending: z.boolean(),
  basic_attributes: BasicAttributes,
  book: z.string(),
  display: Display.optional(),
  id: z.string(),
  note: z.array(Note).optional(),
  specialities: z.array(z.string()),
  stars: constants.AscendingLevel,
  type: z.array(GeneralType),
  extra: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  level: z.number().min(0).max(45).optional(),
});
export type General = z.infer<typeof General>;
