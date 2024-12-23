import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

export const Value = z.object({
  number: z.number(),
  unit: constants.Unit,
});
export type Value = z.infer<typeof Value>;

export const Ascending = z.object({
  level: constants.AscendingLevel,
  buff: z.array(Buff),
});
export type Ascending = z.infer<typeof Ascending>;

export const GeneralAscending = z.object({
  ascending: z.array(Ascending),
});
export type GeneralAscending = z.infer<typeof GeneralAscending>;
