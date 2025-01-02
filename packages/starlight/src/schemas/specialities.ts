import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

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
