import * as z from "zod";

import * as constants from "./constants.ts";
import { Buff } from "./buff.ts";

export const SpecialityLevel = z.object({
  level: constants.SpecialityLevelName,
  buff: z.array(Buff),
});
export type SpecialityLevel = z.infer<typeof SpecialityLevel>;

export const Speciality = z.object({
  name: z.string(),
  levels: z.array(SpecialityLevel),
});
export type Speciality = z.infer<typeof Speciality>;
