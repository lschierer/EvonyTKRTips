import type { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import * as stores from "../store";
import { drag } from "d3";

const DEBUG = false;

const isDebuff = (buff: Buff) => {
  if (!buff.condition) {
    return false;
  } else {
    const match = buff.condition.map((c) => {
      const valid = constants.DebuffCondition.safeParse(c);
      if (valid.success) {
        return true;
      }
      return false;
    })
      ? true
      : false;
    return match;
  }
};

/*TODO: handle the case when not the rally leader */

export const genericBuffEval = (
  buff: Buff,
  attribute: constants.Attribute,
  debuffAttribute: boolean,
  pvm: boolean = false,
  reinforcing: boolean = false,
  troopClass?: constants.ClassEnum
) => {
  const dragon = stores.selectedValues.get().dragon ?? false;
  const beast = stores.selectedValues.get().beast ?? false;
  const generalUse =
    stores.selectedValues.get().type ??
    constants.GeneralType.Enum.mounted_specialist;

  const validConditions = new Set<constants.Condition>();
  if (!generalUse.localeCompare(constants.GeneralType.Enum.wall)) {
    validConditions.add(constants.BuffCondition.Enum.Defending);
    validConditions.add(constants.BuffCondition.Enum["In Main City"]);
    validConditions.add(constants.DebuffCondition.Enum["Reduces Enemy"]);
    if (dragon) {
      validConditions.add(constants.BuffCondition.Enum["brings a dragon"]);
      validConditions.add(
        constants.DebuffCondition.Enum["Reduces Enemy with a Dragon"]
      );
    }
  } else if (!generalUse.localeCompare(constants.GeneralType.Enum.mayor)) {
    validConditions.add(constants.BuffCondition.Enum.Defending);
    validConditions.add(
      constants.BuffCondition.Enum["When City Mayor for this SubCity"]
    );
    validConditions.add(constants.DebuffCondition.Enum["Reduces Enemy"]);

    if (dragon) {
      validConditions.add(constants.BuffCondition.Enum["brings a dragon"]);
      validConditions.add(
        constants.DebuffCondition.Enum["Reduces Enemy with a Dragon"]
      );
    }
  } else {
    if (pvm && reinforcing) {
      throw new Error(
        `genericBuffEval cannot have both pvm and reinforcing set to true.`
      );
      return 0;
    } else if (pvm) {
      validConditions.add(constants.BuffCondition.Enum["Against Monsters"]);
      validConditions.add(constants.BuffCondition.Enum.Attacking);
      validConditions.add(constants.BuffCondition.Enum.Marching);
      validConditions.add(constants.BuffCondition.Enum["When Rallying"]);
      validConditions.add(
        constants.BuffCondition.Enum["leading the army to attack"]
      );
      validConditions.add(constants.DebuffCondition.Enum["Reduces Monster"]);
      if (dragon) {
        validConditions.add(constants.BuffCondition.Enum["brings a dragon"]);
        validConditions.add(
          constants.BuffCondition.Enum["dragon to the attack"]
        );
      }
      if (dragon || beast) {
        validConditions.add(
          constants.BuffCondition.Enum["brings dragon or beast to attack"]
        );
      }
    } else if (reinforcing) {
      validConditions.add(constants.BuffCondition.Enum["In Main City"]);
      validConditions.add(
        constants.BuffCondition.Enum["When Defending Outside The Main City"]
      );
      validConditions.add(constants.BuffCondition.Enum.Reinforcing);
      validConditions.add(constants.DebuffCondition.Enum.Enemy);
      validConditions.add(constants.DebuffCondition.Enum["Reduces Enemy"]);
      if (dragon) {
        validConditions.add(constants.BuffCondition.Enum["brings a dragon"]);
        validConditions.add(
          constants.DebuffCondition.Enum["Reduces Enemy with a Dragon"]
        );
      }
    } else {
      validConditions.add(constants.BuffCondition.Enum.Attacking);
      validConditions.add(constants.BuffCondition.Enum.Marching);
      validConditions.add(
        constants.BuffCondition.Enum["leading the army to attack"]
      );
      validConditions.add(constants.BuffCondition.Enum["When Rallying"]);
      validConditions.add(constants.DebuffCondition.Enum["Reduces Enemy"]);

      validConditions.add(
        constants.DebuffCondition.Enum["Reduces Enemy in Attack"]
      );
      if (dragon) {
        validConditions.add(constants.BuffCondition.Enum["brings a dragon"]);
        validConditions.add(
          constants.BuffCondition.Enum["dragon to the attack"]
        );

        validConditions.add(
          constants.DebuffCondition.Enum["Reduces Enemy with a Dragon"]
        );
      }
      if (dragon || beast) {
        validConditions.add(
          constants.BuffCondition.Enum["brings dragon or beast to attack"]
        );
      }
    }
  }

  if (DEBUG) {
    console.log(
      `genericPvMBuffEval for ${JSON.stringify(buff)}\n against ${attribute} and ${troopClass}`
    );
  }
  let rValue = 0;
  if (!buff.attribute.localeCompare(attribute)) {
    if (DEBUG) {
      console.log(`${buff.attribute} matches ${buff.attribute}`);
    }
    let badCondition: boolean = false;
    if (buff.condition) {
      if (DEBUG) {
        console.log(`there are buff conditions.`);
      }
      badCondition = buff.condition.find((c) => {
        if (validConditions.has(c)) {
          return true;
        }
        return false;
      })
        ? true
        : false;
    }
    if (!badCondition) {
      if (troopClass) {
        if (buff.class) {
          if (!troopClass.localeCompare(buff.class)) {
            if (isDebuff(buff) && debuffAttribute) {
              rValue += buff.value.number;
            }
            if (!isDebuff(buff) && !debuffAttribute) {
              rValue += buff.value.number;
            }
          }
        } else {
          if (isDebuff(buff) && debuffAttribute) {
            rValue += buff.value.number;
          }
          if (!isDebuff(buff) && !debuffAttribute) {
            rValue += buff.value.number;
          }
        }
      } else {
        if (isDebuff(buff) && debuffAttribute) {
          rValue += buff.value.number;
        }
        if (!isDebuff(buff) && !debuffAttribute) {
          rValue += buff.value.number;
        }
      }
    }
  }
  return rValue;
};
