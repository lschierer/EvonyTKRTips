import { signal, Signal } from "@lit-labs/signals";
import * as constants from "../../../schemas/constants.ts";

import { z } from "zod";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/generals/pairing/pairingstores.ts");

export const generalusecase: Signal.State<constants.BuffActivation> = signal(
  constants.BuffActivation.Enum.Overall
);

export const generalSpeciality: Signal.State<constants.GeneralType> = signal(
  constants.GeneralType.Enum.mounted_specialist
);

export const primaryDragon: Signal.State<boolean> = signal(false);
export const primaryBeast: Signal.State<boolean> = signal(false);
export const secondaryDragon: Signal.State<boolean> = signal(false);
export const secondaryBeast: Signal.State<boolean> = signal(false);

export const ascendingLevel: Signal.State<constants.AscendingLevel> = signal(
  constants.AscendingLevel.Enum.None
);

export const primarySpecialitySignals: Signal.State<constants.SpecialityLevelName>[] =
  [
    signal(constants.SpecialityLevelName.Enum.None),
    signal(constants.SpecialityLevelName.Enum.None),
    signal(constants.SpecialityLevelName.Enum.None),
    signal(constants.SpecialityLevelName.Enum.None),
  ];

export const secondarySpecialitySignals: Signal.State<constants.SpecialityLevelName>[] =
  [
    signal(constants.SpecialityLevelName.Enum.None),
    signal(constants.SpecialityLevelName.Enum.None),
    signal(constants.SpecialityLevelName.Enum.None),
    signal(constants.SpecialityLevelName.Enum.None),
  ];

export const SpecialitySelection = z
  .array(constants.SpecialityLevelName)
  .length(4)
  .refine((val) => {
    if (val[3].localeCompare(constants.SpecialityLevelName.Enum.None)) {
      console.log(`val3 is not None`);
      if (!val[0].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
        console.log(`val 0 is gold`);
        if (!val[1].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
          console.log(`val 1 is gold`);
          if (!val[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
            console.log(`val 2 is gold`);
            if (DEBUG) {
              console.log(`first refine is true`);
            }
            return true;
          }
        }
      }
    } else {
      console.log(`big else`);
      if (val[0].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
        console.log(`val 0 is not gold`);
        if (val[1].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
          console.log(`val 1 is not gold`);
          if (val[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
            console.log(`val 2 is not gold`);
            if (
              !val[3].localeCompare(constants.SpecialityLevelName.Enum.None)
            ) {
              console.log(`val 3 is none`);
              if (DEBUG) {
                console.log(`first refine else is true`);
              }
              return true;
            } else {
              console.log(` 3 not gold, 4th not none`);
            }
          } else {
            console.log(`3 is gold`);
            if (
              !val[3].localeCompare(constants.SpecialityLevelName.Enum.None)
            ) {
              return true;
            }
          }
        } else {
          console.log(`2 is gold`);
          if (!val[3].localeCompare(constants.SpecialityLevelName.Enum.None)) {
            return true;
          }
        }
      } else if (
        val[3].localeCompare(constants.SpecialityLevelName.Enum.None)
      ) {
        return true;
      } else if (
        !val[1].localeCompare(constants.SpecialityLevelName.Enum.Gold)
      ) {
        if (!val[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
          if (val[3].localeCompare(constants.SpecialityLevelName.Enum.None)) {
            return true;
          }
        }
      }
    }
    if (DEBUG) {
      console.log(`first refine is false`);
    }
    return false;
  });
export type SpecialitySelection = z.infer<typeof SpecialitySelection>;
