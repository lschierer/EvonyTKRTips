import * as z from "zod";

import * as constants from "./constants.ts";
import { Buff } from "./buff.ts";

export const AscendingLevel = z.object({
  level: constants.AscendingLevel,
  buff: z.array(Buff),
});
export type AscendingLevel = z.infer<typeof AscendingLevel>;

export const GeneralAscending = z.object({
  id: z.string(),
  general: z.string(),
  ascending: z.array(AscendingLevel),
});
export type GeneralAscending = z.infer<typeof GeneralAscending>;
