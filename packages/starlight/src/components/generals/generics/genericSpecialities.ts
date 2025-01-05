import * as constants from "@schemas/constants";
import { Speciality } from "@schemas/specialities";
import { genericPvMBuffEval } from "./genericBuff";
import * as stores from "../store";

const DEBUG = false;
const DEBUG2 = false;

const specialityEval = (
  speciality: Speciality,
  specialityNumber: 1 | 2 | 3 | 4,
  role: "primary" | "secondary",
  attribute: constants.Attribute,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  const levels = speciality.levels;
  const selections = new Array<constants.SpecialityLevelName>();
  if (DEBUG2) {
    console.log(
      `specialityEval: ${speciality.name} as ${role} #${specialityNumber}`
    );
  }
  if (!role.localeCompare("primary")) {
    const s = stores.selectedValues.get().primarySpecialityLevels;
    if (DEBUG) {
      console.log(`primary selections are\n${s.join("\n")}`);
    }
    selections.push(...s);
  } else {
    const s = stores.selectedValues.get().secondarySpecialityLevels;
    if (DEBUG) {
      console.log(`secondary selections are\n${s.join("\n")}`);
    }
    selections.push(...s);
  }
  if (
    selections[specialityNumber - 1].localeCompare(
      constants.SpecialityLevelName.Enum.None
    )
  ) {
    levels.map((level) => {
      if (!selections[specialityNumber - 1].localeCompare(level.level)) {
        if (DEBUG2) {
          console.log(`found maching level ${level.level}`);
        }
        const b = level.buff;
        if (Array.isArray(b)) {
          if (DEBUG2) {
            console.log(`buff for ${level.level} is an array`);
          }
          b.map((buff) => {
            rValue += genericPvMBuffEval(buff, attribute, troopClass);
            if (DEBUG2) {
              console.log(`rValue is now ${rValue}`);
            }
          });
        } else {
          rValue += genericPvMBuffEval(b, attribute, troopClass);
        }
      } else {
        if (
          !selections[specialityNumber - 1].localeCompare(
            constants.SpecialityLevelName.Enum.Blue
          ) &&
          !level.level.localeCompare(constants.SpecialityLevelName.Enum.Green)
        ) {
          const b = level.buff;
          if (Array.isArray(b)) {
            b.map((buff) => {
              rValue += genericPvMBuffEval(buff, attribute, troopClass);
            });
          } else {
            rValue += genericPvMBuffEval(b, attribute, troopClass);
          }
        }
        if (
          !selections[specialityNumber - 1].localeCompare(
            constants.SpecialityLevelName.Enum.Purple
          ) &&
          (!level.level.localeCompare(
            constants.SpecialityLevelName.Enum.Green
          ) ||
            !level.level.localeCompare(constants.SpecialityLevelName.Enum.Blue))
        ) {
          const b = level.buff;
          if (Array.isArray(b)) {
            b.map((buff) => {
              rValue += genericPvMBuffEval(buff, attribute, troopClass);
            });
          } else {
            rValue += genericPvMBuffEval(b, attribute, troopClass);
          }
        }
        if (
          !selections[specialityNumber - 1].localeCompare(
            constants.SpecialityLevelName.Enum.Orange
          ) &&
          (!level.level.localeCompare(
            constants.SpecialityLevelName.Enum.Green
          ) ||
            !level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Blue
            ) ||
            !level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Purple
            ))
        ) {
          const b = level.buff;
          if (Array.isArray(b)) {
            b.map((buff) => {
              rValue += genericPvMBuffEval(buff, attribute, troopClass);
            });
          } else {
            rValue += genericPvMBuffEval(b, attribute, troopClass);
          }
        }
        if (
          !selections[specialityNumber - 1].localeCompare(
            constants.SpecialityLevelName.Enum.Gold
          ) &&
          (!level.level.localeCompare(
            constants.SpecialityLevelName.Enum.Green
          ) ||
            !level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Blue
            ) ||
            !level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Purple
            ) ||
            !level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Orange
            ))
        ) {
          const b = level.buff;
          if (Array.isArray(b)) {
            b.map((buff) => {
              rValue += genericPvMBuffEval(buff, attribute, troopClass);
            });
          } else {
            rValue += genericPvMBuffEval(b, attribute, troopClass);
          }
        }
      }
    });
  }
  return rValue;
};

export const genericPvMSpeciality = (
  primary_speciality: Speciality,
  secondary_speciality: Speciality | null,
  specialityNumber: 1 | 2 | 3 | 4,
  attribute: constants.Attribute,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  if (primary_speciality) {
    rValue += specialityEval(
      primary_speciality,
      specialityNumber,
      "primary",
      attribute,
      troopClass
    );
  }
  if (secondary_speciality) {
    rValue += specialityEval(
      secondary_speciality,
      specialityNumber,
      "secondary",
      attribute,
      troopClass
    );
  }
  return rValue;
};
