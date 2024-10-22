import type { General } from "../../../../types/General";
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

 export const generalSchema = z.object({ "name": z.string(), "skin": z.union([z.lazy(() => skinSchema), z.string()]), "type": z.union([z.lazy(() => generalEvaluationTypesSchema), z.array(z.lazy(() => generalEvaluationTypesSchema))]), "level": z.number().int().min(1).max(45), "ascending": z.union([z.boolean(), z.lazy(() => ascendingLevelSchema), z.lazy(() => ascendingSummarySchema)]), "otherBooks": z.union([z.array(z.string()), z.array(z.lazy(() => standardBookSchema))]), "builtInBook": z.union([z.lazy(() => builtinBookSchema), z.string()]), "specialities": z.union([z.array(z.string()), z.array(z.lazy(() => specialitySchema)), z.array(z.lazy(() => specialityEffectSchema))]), "basicAttributes": z.union([z.lazy(() => basicAttributesObjectSchema), z.lazy(() => basicAttributesObjectSummarySchema)]) }) as z.ZodType<General>;

 export type GeneralSchema = z.infer<typeof generalSchema>;