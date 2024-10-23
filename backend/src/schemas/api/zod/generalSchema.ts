import type { General } from "../types/General";
import { ascendingLevelSchema } from "./ascendingLevelSchema";
import { ascendingSummarySchema } from "./ascendingSummarySchema";
import { basicAttributesObjectSchema } from "./basicAttributesObjectSchema";
import { basicAttributesObjectSummarySchema } from "./basicAttributesObjectSummarySchema";
import { builtinBookSchema } from "./builtinBookSchema";
import { generalEvaluationTypesSchema } from "./generalEvaluationTypesSchema";
import { skinSchema } from "./skinSchema";
import { specialityEffectSchema } from "./specialityEffectSchema";
import { specialitySchema } from "./specialitySchema";
import { standardBookSchema } from "./standardBookSchema";
import { z } from "zod";

export const generalSchema = z.object({
  name: z.string(),
  skin: z.union([skinSchema, z.string()]),
  type: z.union([
    generalEvaluationTypesSchema,
    z.array(generalEvaluationTypesSchema),
  ]),
  level: z.number().int().min(1).max(45),
  ascending: z.union([
    z.boolean(),
    ascendingLevelSchema,
    ascendingSummarySchema,
  ]),
  otherBooks: z.union([z.array(z.string()), z.array(standardBookSchema)]),
  builtInBook: z.union([builtinBookSchema, z.string()]),
  specialities: z.union([
    z.array(z.string()),
    z.array(specialitySchema),
    z.array(specialityEffectSchema),
  ]),
  basicAttributes: z.union([
    basicAttributesObjectSchema,
    basicAttributesObjectSummarySchema,
  ]),
}) as z.ZodType<General>;

export type GeneralSchema = z.infer<typeof generalSchema>;
