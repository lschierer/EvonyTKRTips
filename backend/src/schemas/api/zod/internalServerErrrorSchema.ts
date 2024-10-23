import type { InternalServerErrror } from "../types/InternalServerErrror";
import { z } from "zod";

 export const internalServerErrrorSchema = z.object({ "message": z.string() }) as z.ZodType<InternalServerErrror>;

 export type InternalServerErrrorSchema = z.infer<typeof internalServerErrrorSchema>;