import type { BasicAttributes } from "../../../../types/BasicAttributes";
import { basicAttributesObjectSchema } from "./basicAttributesObjectSchema";
import { z } from "zod";

 export const basicAttributesSchema = z.object({ "Attack": z.lazy(() => basicAttributesObjectSchema), "Defense": z.lazy(() => basicAttributesObjectSchema), "Politics": z.lazy(() => basicAttributesObjectSchema), "Leadership": z.lazy(() => basicAttributesObjectSchema) }) as z.ZodType<BasicAttributes>;

 export type BasicAttributesSchema = z.infer<typeof basicAttributesSchema>;