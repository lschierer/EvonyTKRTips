import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

export const AscendingLevel = z.object({
  level: constants.AscendingLevel,
  buff: z.array(Buff),
});
export type AscendingLevel = z.infer<typeof AscendingLevel>;

export const GeneralAscending = z.object({
  ascending: z.array(AscendingLevel),
});
export type GeneralAscending = z.infer<typeof GeneralAscending>;
