import * as z from "zod";

import { Buff } from "./buff.ts";

export const SkillBook = z.object({
  name: z.string(),
  level: z.number().optional(),
  buff: z.union([Buff, z.array(Buff)]),
});
export type SkillBook = z.infer<typeof SkillBook>;
