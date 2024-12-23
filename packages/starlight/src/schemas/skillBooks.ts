import * as z from "zod";

import { Buff } from "./buff";

export const SkillBook = z.object({
  name: z.string(),
  buff: Buff,
});
export type SkillBook = z.infer<typeof SkillBook>;
