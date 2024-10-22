import type { BasicAttributesObject } from "../../../../types/BasicAttributesObject";
import { z } from "zod";

 export const basicAttributesObjectSchema = z.object({ "Base": z.number().min(0), "Total": z.number().min(0), "Increment": z.number().min(0) }) as z.ZodType<BasicAttributesObject>;

 export type BasicAttributesObjectSchema = z.infer<typeof basicAttributesObjectSchema>;