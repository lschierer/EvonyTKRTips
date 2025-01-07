import * as constants from "@schemas/constants";
import { AscendingLevel } from "@schemas/ascending";
import { Buff } from "@schemas/buff";
import { genericPvMBuffEval } from "./genericBuff";
import * as stores from "../store";

const DEBUG = false;

const evalSingleLevelBuffs = (
  b: Buff | Buff[],
  attribute: constants.Attribute,
  troopClass: constants.ClassEnum
) => {
  let rValue = 0;
  if (Array.isArray(b)) {
    b.map((buff) => {
      rValue += genericPvMBuffEval(buff, attribute, troopClass);
    });
  } else {
    rValue += genericPvMBuffEval(b, attribute, troopClass);
  }
  return rValue;
};
export const genericPvMAscending = (
  alevels: AscendingLevel[],
  level: constants.AscendingLevel,
  attribute: constants.Attribute,
  troopClass: constants.ClassEnum
) => {
  let rValue = 0;
  alevels.forEach((alevel) => {
    if (!alevel.level.localeCompare(level)) {
      if (DEBUG) {
        console.log(`found match to ${level}`);
      }
      const b = alevel.buff;
      rValue += evalSingleLevelBuffs(b, attribute, troopClass);
    } else {
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red2) &&
        !alevel.level.localeCompare(constants.AscendingLevel.Enum.red1)
      ) {
        const b = alevel.buff;
        rValue += evalSingleLevelBuffs(b, attribute, troopClass);
      }
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red3) &&
        (!alevel.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red2))
      ) {
        const b = alevel.buff;
        rValue += evalSingleLevelBuffs(b, attribute, troopClass);
      }
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red4) &&
        (!alevel.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red3))
      ) {
        const b = alevel.buff;
        rValue += evalSingleLevelBuffs(b, attribute, troopClass);
      }
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red5) &&
        (!alevel.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red3) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red4))
      ) {
        const b = alevel.buff;
        rValue += evalSingleLevelBuffs(b, attribute, troopClass);
      }
    }
  });
  return rValue;
};
