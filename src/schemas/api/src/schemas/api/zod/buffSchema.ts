import type { Buff } from "../../../../types/Buff";
import { buffAttributesSchema } from "./buffAttributesSchema";
import { conditionSchema } from "./conditionSchema";
import { z } from "zod";

 export const buffSchema = z.object({ "unit": z.string(), "value": z.number().int(), "passive": z.boolean().optional(), "attribute": z.union([z.lazy(() => buffAttributesSchema), z.array(z.lazy(() => buffAttributesSchema))]), "conditions": z.lazy(() => conditionSchema) }) as z.ZodType<Buff>;

 export type BuffSchema = z.infer<typeof buffSchema>;