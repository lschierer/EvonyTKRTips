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

export const SpecialityLevelSelection = z
  .array(constants.SpecialityLevelName)
  .length(4)
  .refine((value) => {
    if (value[3].localeCompare(constants.SpecialityLevelName.Enum.None)) {
      if (
        value[0].localeCompare(constants.SpecialityLevelName.Enum.Gold) ||
        value[1].localeCompare(constants.SpecialityLevelName.Enum.Gold) ||
        value[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)
      ) {
        return false;
      } else if (
        !value[0].localeCompare(constants.SpecialityLevelName.Enum.Gold) &&
        !value[1].localeCompare(constants.SpecialityLevelName.Enum.Gold) &&
        !value[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)
      ) {
        if (!value[3].localeCompare(constants.SpecialityLevelName.Enum.None)) {
          return false;
        }
      }
    }
    return true;
  });
export type SpecialityLevelSelection = z.infer<typeof SpecialityLevelSelection>;
