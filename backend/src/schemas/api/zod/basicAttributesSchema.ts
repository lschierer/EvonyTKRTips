import type { BasicAttributes } from "../types/BasicAttributes";
import { basicAttributesObjectSchema } from "./basicAttributesObjectSchema";
import { z } from "zod";

export const basicAttributesSchema = z.object({
  Attack: basicAttributesObjectSchema,
  Defense: basicAttributesObjectSchema,
  Politics: basicAttributesObjectSchema,
  Leadership: basicAttributesObjectSchema,
}) as z.ZodType<BasicAttributes>;

export type BasicAttributesSchema = z.infer<typeof basicAttributesSchema>;
