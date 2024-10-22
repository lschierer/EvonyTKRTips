import type { GeneralEvaluationTypes } from "../types/GeneralEvaluationTypes";
import { z } from "zod";

 export const generalEvaluationTypesSchema = z.enum(["Ground_Specialist", "Ranged_Specialist", "Mounted_Specialist", "Siege_Specialist", "Mayor", "Wall_General", "Officer"]) as z.ZodType<GeneralEvaluationTypes>;

 export type GeneralEvaluationTypesSchema = z.infer<typeof generalEvaluationTypesSchema>;