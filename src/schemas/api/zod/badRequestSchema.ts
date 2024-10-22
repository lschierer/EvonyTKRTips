import type { BadRequest } from "../types/BadRequest";
import { z } from "zod";

 export const badRequestSchema = z.object({ "errors": z.array(z.object({ "message": z.string() })).optional(), "message": z.string() }) as z.ZodType<BadRequest>;

 export type BadRequestSchema = z.infer<typeof badRequestSchema>;