import type { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import * as stores from "../../store";

const DEBUG = false;
const DEBUG2 = false;

export const PvPAttackingDebuff = (
  buff: Buff,
  attribute: constants.Attribute,
  debuffClass: constants.ClassEnum
) => {
  const dragon = stores.selectedValues.get().dragon ?? false;
  const beast = stores.selectedValues.get().beast ?? false;

  const validConditions = new Set<constants.Condition>();
  if (dragon) {
    validConditions.add(constants.BuffCondition.Enum["brings a dragon"]);
    validConditions.add(
      constants.BuffCondition.Enum["brings dragon or beast to attack"]
    );
    validConditions.add(constants.BuffCondition.Enum["dragon to the attack"]);
    validConditions.add(
      constants.DebuffCondition.Enum["Reduces Enemy with a Dragon"]
    );
  }
  if (beast) {
    validConditions.add(
      constants.BuffCondition.Enum["brings dragon or beast to attack"]
    );
  }
  validConditions.add(constants.DebuffCondition.Enum.Enemy);
  validConditions.add(constants.DebuffCondition.Enum["Enemy In City"]);
  validConditions.add(constants.DebuffCondition.Enum.Reduces);
  validConditions.add(
    constants.DebuffCondition.Enum["Reduces Enemy in Attack"]
  );
  let rValue = 0;
  if (!attribute.localeCompare(buff.attribute)) {
    let badCondition: boolean = false;
    if (buff.condition) {
      badCondition = buff.condition.find((c) => {
        if (validConditions.has(c)) {
          return true;
        }
        return false;
      })
        ? true
        : false;
      if (!badCondition) {
        if (buff.class) {
          if (!buff.class.localeCompare(debuffClass)) {
            rValue += buff.value.number;
          }
        } else {
          rValue += buff.value.number;
        }
      }
    } else {
      rValue += buff.value.number;
    }
  }
  return rValue;
};
