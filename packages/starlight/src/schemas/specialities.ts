import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";

export const SpecialityLevelName = z.enum([
  "None",
  "Green",
  "Blue",
  "Purple",
  "Orange",
  "Gold",
]);
export type SpecialityLevelName = z.infer<typeof SpecialityLevelName>;

export const SpecialityLevel = z.object({
  level: SpecialityLevelName,
  buff: z.array(Buff),
});
export type SpecialityLevel = z.infer<typeof SpecialityLevel>;

export const Speciality = z.object({
  name: z.string(),
  levels: z.array(SpecialityLevel),
});
