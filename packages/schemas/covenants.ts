import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

export const Level = z.object({
  category: constants.CovenantCategory,
  type: constants.BuffType,
  buff: z.array(Buff),
});
export type Level = z.infer<typeof Level>;

export const Covenant = z.object({
  name: z.string(),
  generals: z.array(z.string()),
  levels: z.array(Level),
});
export type Covenant = z.infer<typeof Covenant>;
