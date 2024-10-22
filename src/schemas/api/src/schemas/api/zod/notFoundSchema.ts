import type { NotFound } from "../../../../types/NotFound";
import { z } from "zod";

 export const notFoundSchema = z.object({ "message": z.string() }) as z.ZodType<NotFound>;

 export type NotFoundSchema = z.infer<typeof notFoundSchema>;