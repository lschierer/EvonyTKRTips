import type { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";

const DEBUG = false;

/*TODO: handle the case when not the rally leader */
export const genericPvMBuffEval = (
  buff: Buff,
  attribute: constants.Attrbute,
  troopClass?: constants.ClassEnum
) => {
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
        if (
          !c.localeCompare(constants.DebuffCondition.Enum["Reduces Monster"])
        ) {
          if (DEBUG) {
            console.log(
              `While this is a monster effect, it is a *debuff* and will count separately. return true as invalid here.`
            );
          }
          return true;
        } else if (
          c.localeCompare(constants.BuffCondition.Enum["Against Monsters"])
        ) {
          if (c.localeCompare(constants.BuffCondition.Enum.Attacking)) {
            if (c.localeCompare(constants.BuffCondition.Enum.Marching)) {
              if (
                c.localeCompare(constants.BuffCondition.Enum["brings a dragon"])
              ) {
                if (
                  c.localeCompare(
                    constants.BuffCondition.Enum[
                      "brings dragon or beast to attack"
                    ]
                  )
                ) {
                  if (
                    c.localeCompare(
                      constants.BuffCondition.Enum["dragon to the attack"]
                    )
                  ) {
                    if (
                      c.localeCompare(
                        constants.BuffCondition.Enum[
                          "leading the army to attack"
                        ]
                      )
                    ) {
                      if (
                        c.localeCompare(
                          constants.BuffCondition.Enum["When Rallying"]
                        )
                      ) {
                        if (DEBUG) {
                          console.log(
                            `condition ${c} is invalid, return true for bad buff`
                          );
                        }
                        return true;
                      }
                    } else {
                      if (DEBUG) {
                        console.log(
                          `buff leading the army to attack is valid, return false`
                        );
                      }
                    }
                  } else {
                    if (DEBUG) {
                      console.log(
                        `buff dragon to the attack is valid, return false`
                      );
                    }
                  }
                } else {
                  if (DEBUG) {
                    console.log(
                      `buff condition brings dragon or best to attack is valid, return false`
                    );
                  }
                }
              } else {
                if (DEBUG) {
                  console.log(
                    `Buff Condition brings a dragon is valid, return false`
                  );
                }
              }
            } else {
              if (DEBUG) {
                console.log(
                  `BuffCondition Marching is a valid Buff Condition. return false`
                );
              }
            }
          } else {
            if (DEBUG) {
              console.log(
                `BuffCondition Attacking is a valid Buff Condition return false`
              );
            }
          }
        } else {
          if (DEBUG) {
            console.log(
              `buff Against Monsters is a valid Buff Condition. return false.`
            );
          }
        }
        return false;
      })
        ? true
        : false;
      if (badCondition == undefined) {
      }
    }
    if (!badCondition) {
      if (troopClass) {
        if (
          buff.class &&
          buff.class.localeCompare(constants.ClassEnum.Enum.Monsters)
        ) {
          if (!troopClass.localeCompare(buff.class)) {
            rValue += buff.value.number;
          }
        } else {
          rValue += buff.value.number;
        }
      } else {
        rValue += buff.value.number;
      }
    }
  }
  return rValue;
};
