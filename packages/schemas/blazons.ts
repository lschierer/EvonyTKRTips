import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

export const Blazon = z.object({
  type: constants.BlazonType,
  set: z.string(),
  level: z.string(),
  buff: z.array(Buff),
});
export type Blazon = z.infer<typeof Blazon>;

export const Set = z.object({
  earth: Blazon,
  wind: Blazon,
  fire: Blazon,
  ocean: Blazon,
  shadow: Blazon,
  light: Blazon,
});
export type Set = z.infer<typeof Set>;
