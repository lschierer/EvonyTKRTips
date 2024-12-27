import {
  Tabulator,
  AccessorModule,
  ColumnCalcsModule,
  DataTreeModule,
  EditModule,
  FilterModule,
  FormatModule,
  MutatorModule,
  ReactiveDataModule,
  ResponsiveLayoutModule,
  ResizeColumnsModule,
  SortModule,
} from "tabulator-tables";
Tabulator.registerModule([
  AccessorModule,
  ColumnCalcsModule,
  DataTreeModule,
  EditModule,
  FilterModule,
  FormatModule,
  MutatorModule,
  ReactiveDataModule,
  ResponsiveLayoutModule,
  ResizeColumnsModule,
  SortModule,
]);
import { General, GeneralType } from "@schemas/generals";
import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";

import { type StoreValue, subscribeKeys } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";
import type { SkillBook } from "@schemas/skillBooks";

const DEBUG = true;

export type TableData = {
  primary: General;
  secondary: General;
};

export const definePairs = () => {
  const generals = stores.generals.get();
  const pairs = new Array<TableData>();

  if (generals.length == 0) {
    return new Array<TableData>();
  } else {
    const filtered = generals.filter((g) => {
      let match = false;
      const types = stores.selectedValues.get().type;
      g.type.forEach((t) => {
        if (types.includes(t)) {
          if (DEBUG) {
            console.log(`matched ${t} to ${types.join(" ")}`);
          }
          match = true;
        }
      });
      return match;
    });
    const permutations = d3.cross(filtered, filtered).filter((pair) => {
      return pair[0].id.localeCompare(pair[1].id);
    });
    if (DEBUG) {
      console.log(
        `identified ${permutations.length} pairs, some of which conflict.`
      );
    }
    permutations.map((pair) => {
      const td: TableData = {
        primary: pair[0],
        secondary: pair[1],
      };
      /*if (DEBUG) {
        console.log(
          `pusing pair ${td.primary.id}/${td.secondary.id}: ${JSON.stringify(td)}`
        );
        }*/
      pairs.push(td);
    });
  }
  pairs.sort((a, b) => {
    const ap = a.primary.id;
    const as = a.secondary.id;
    const bp = b.primary.id;
    const bs = b.secondary.id;
    if (!ap.localeCompare(bp)) {
      return as.localeCompare(bs);
    } else {
      return ap.localeCompare(bp);
    }
  });
  if (DEBUG) {
    const limiter = pairs[0].primary.id;
    return pairs.filter((predicate) => {
      return !predicate.primary.id.localeCompare(limiter);
    });
  } else {
    return pairs;
  }
};

const overallToughness = "Overall Toughness";
const overallAttack = "Overall Attack";

let subscribed = false;

export const defineTable = () => {
  const tableData: TableData[] = definePairs();
  stores.generals.listen((value, oldvalue) => {
    if (DEBUG) {
      console.log(`stores.listen from defineTable called`);
    }
    const data = value.map((datum) => {
      const td = definePairs();
      table.replaceData(td);
    });
  });
  const table = new Tabulator("#generals-table", {
    data: tableData,
    reactiveData: true,
    layout: "fitDataFill",
    columnDefaults: {
      headerWordWrap: true,
      headerVertical: true,

      sorter: "number",
      resizable: true,
    },
    columns: [
      {
        title: "Primary",
        field: "primary.id",
        headerVertical: false,
        width: "20vw",
        sorter: "string",
      },
      {
        title: "Secondary",
        field: "secondary.id",
        headerVertical: false,
        width: "20vw",
        sorter: "string",
      },
      {
        title: "March Size Increase",
        field: "marchsizeincrease",
        mutator: marchsizeMutator,
      },
      {
        title: "Monster Mounted Attack",
        field: "MountedPvM.attack",
        visible: true,
        mutator: MountedPvMMutator,
      },

      {
        title: "Details",
        field: "details",
        headerVertical: false,
        visible: false,
        columns: [
          {
            title: "level",
            field: "primary.level",
            visible: true,
            mutateLink: ["overallAttack", "overallToughness"],
          },
          {
            title: "March Size Details",
            headerVertical: false,

            field: "marchsizeincreasedetails",
            visible: true,
            columns: [
              {
                title: "Attributes",
                field: "marchsize.attributes",
                visible: true,
                mutator: marchsizeattributesmutator,
                mutateLink: ["marchsizeincrease"],
              },
              {
                title: "Base Skill",
                field: "marchsize.baseSkill",
                visible: true,
                mutator: marchSizeBaseSkillMutator,
                mutateLink: ["marchsizeincrease"],
              },
            ],
          },
          {
            title: "Mounted PvM Attack",
            field: "MountedPvM.attackDetails",
            headerVertical: false,
            visible: true,
            columns: [
              {
                title: "Mounted PVM Attack Base Attribute",
                field: "MountedPvM.attackDetails.baseAttribute",
                headerVertical: false,
                visible: true,
                mutator: AttackAttributesMutator,
                mutateLink: ["MountedPvM.attack"],
              },
              {
                title: "Mounted PVM Attack Attribute Increment",
                field: "MountedPvM.attackDetails.attributeIncrement",
                headerVertical: false,
                visible: true,
                mutator: AttackattributeIncrementMutator,
                mutateLink: ["MountedPvM.attack"],
              },
              {
                title: "Mounted PVM Attack Attribute Total",
                field: "MountedPvM.attackDetails.attributeTotal",
                headerVertical: false,

                visible: true,
                mutator: MountedPvMAttackAttributeTotalMutator,
                mutateLink: ["MountedPvM.attack"],
              },
              {
                title: "Mounted PvP Attack Base Skill",
                field: "MountedPvM.attackDetails.baseSkill",
                headerVertical: false,
                visible: true,
                mutator: MountedPvMBaseSkillMutator,
                mutateLink: ["MountedPvM.attack"],
              },
            ],
          },
          {
            title: "Attacking Attack Details",
            field: "attackingattackincreasedetails",
            headerVertical: false,
            visible: true,
            columns: [
              {
                title: "Attributes",
                field: "d.attackingattack.attributes",
                headerVertical: false,
                visible: true,
                mutator: AttackAttributesMutator,
                mutateLink: ["attackingattack"],
              },
              {
                title: "Attribute Increment",
                field: "d.attackingattack.attributeIncrement",
                headerVertical: false,
                visible: true,
                mutator: AttackattributeIncrementMutator,
                mutateLink: ["attackingattack"],
              },
              {
                title: "Base Skill",
                field: "attackingattackincrease.baseSkill",
                headerVertical: false,
                visible: true,
                mutator: attackingAttackBaseSkillMutator,
                mutateLink: ["attackingattack"],
              },
            ],
          },

          {
            title: "built in book",
            field: "primary.book",
            visible: true,
            mutateLink: ["marchsize.baseSkill"],
          },
        ],
      },
    ],
  });
  table.on("dataProcessed", function () {
    if (DEBUG) {
      console.log(`dataProcessed event`);
    }
    if (!subscribed) {
      subscribed = true;

      subscribeKeys(
        stores.selectedValues,
        ["level", "ascending", "stars", "type"],
        (value, oldValue?, changed?: string[]) => {
          const rows: TableData[] = new Array<TableData>();
          if (changed && changed.includes("type")) {
            rows.push(...definePairs());
          } else if (changed && changed.includes("level")) {
            if (DEBUG) {
              console.log(`level is ${value.level}`);
            }
            rows.push(
              ...table.getData().map((row: TableData) => {
                const td: TableData = {
                  primary: {
                    ascending: row.primary.ascending,
                    basic_attributes: row.primary.basic_attributes,
                    book: row.primary.book,
                    id: row.primary.id,
                    specialities: row.primary.specialities,
                    stars: row.primary.stars,
                    type: row.primary.type,
                    level: value.level,
                  },
                  secondary: row.secondary,
                };
                return td;
              })
            );
          } else if (
            changed &&
            (changed.includes("ascending") || changed.includes("stars"))
          ) {
            rows.push(
              ...table.getData().map((row: TableData) => {
                const td: TableData = {
                  primary: {
                    ascending: value.ascending,
                    basic_attributes: row.primary.basic_attributes,
                    book: row.primary.book,
                    id: row.primary.id,
                    specialities: row.primary.specialities,
                    stars: value.stars,
                    type: row.primary.type,
                    level: row.primary.level,
                  },
                  secondary: row.secondary,
                };
                return td;
              })
            );
          } else {
            if (DEBUG) {
              console.log(`initial set with value but no changed`);
            }
            rows.push(
              ...table.getData().map((row: TableData) => {
                const td: TableData = {
                  primary: {
                    ascending: value.ascending,
                    basic_attributes: row.primary.basic_attributes,
                    book: row.primary.book,
                    id: row.primary.id,
                    specialities: row.primary.specialities,
                    stars: value.stars,
                    type: row.primary.type,
                    level: value.level,
                  },
                  secondary: row.secondary,
                };
                return td;
              })
            );
          }
          if (rows.length > 0) {
            table.replaceData(rows);
          } else {
            if (DEBUG) {
              console.log(`rows has no size`);
            }
          }
        }
      );
    }
  });
  return table;
};
const getIncreaseFromBook = (
  attribute: constants.Attrbute,
  book: SkillBook,
  buffConditions: constants.BuffCondition[] = new Array<constants.BuffCondition>(),
  debuffConditions: constants.DebuffCondition[] = new Array<constants.DebuffCondition>()
) => {
  let increase = 0;
  if (Array.isArray(book.buff)) {
    if (DEBUG) {
      console.log(`buff for ${book.name} is an array`);
    }
    book.buff.map((buff: Buff) => {
      if (!buff.attribute.localeCompare(attribute)) {
        if (!buff.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
          if (buffConditions.length > 0 || debuffConditions.length > 0) {
            if (buff.condition) {
              let assumeTrue = true;
              buff.condition.map((bc) => {
                const valid = constants.BuffCondition.safeParse(bc);
                if (valid.success && !buffConditions.includes(valid.data)) {
                  assumeTrue = false;
                } else {
                  const v2 = constants.DebuffCondition.safeParse(bc);
                  if (
                    v2.success &&
                    debuffConditions.length > 0 &&
                    !debuffConditions.includes(v2.data)
                  ) {
                    assumeTrue = false;
                  }
                }
              });
              if (assumeTrue) {
                increase += buff.value.number;
              }
            } else {
              increase += buff.value.number;
            }
          } else {
            increase += buff.value.number;
          }
        }
      }
    });
  } else if (!book.buff.attribute.localeCompare(attribute)) {
    if (DEBUG) {
      console.log(`book ${book.name} has non-array buff`);
    }
    const buff = book.buff;
    if (!buff.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
      if (buffConditions.length > 0 || debuffConditions.length > 0) {
        if (buff.condition) {
          let assumeTrue = true;
          buff.condition.map((bc) => {
            const valid = constants.BuffCondition.safeParse(bc);
            if (valid.success && !buffConditions.includes(valid.data)) {
              assumeTrue = false;
            } else {
              const v2 = constants.DebuffCondition.safeParse(bc);
              if (
                v2.success &&
                debuffConditions.length > 0 &&
                !debuffConditions.includes(v2.data)
              ) {
                assumeTrue = false;
              }
            }
          });
          if (assumeTrue) {
            increase += buff.value.number;
          }
        } else {
          increase += buff.value.number;
        }
      } else {
        increase += buff.value.number;
      }
    }
  }
  return increase;
};

const MountedPvMAttackAssistant = (value: number = 0, data: TableData) => {
  /*
  P332=0 ?
    SUM($O332,$Q332:$U332,$W332)-0.25<0 ?
      0
      : SUM($O332,$Q332:$U332,$W332)-0.25)
    : SUM($O332,$Q332:$U332,$W332))
  */
  value = 0;
  return value;
};

const MountedPvMMutator = (value: number = 0, data: TableData) => {
  value = 0;
  value += MountedPvMAttackAttributeTotalMutator(0, data);
  return value;
};

const attackingAttackIncreaseMutator = (value: number = 0, data: TableData) => {
  if (DEBUG) {
    console.log(`attackingAttackIncreaseMutator called`);
  }
  const attribute = AttackAttributesMutator(value, data);
  const baseSkill = attackingAttackBaseSkillMutator(value, data);
  return attribute + baseSkill;
};

const MountedPvMBaseSkillMutator = (value: number = 0, data: TableData) => {
  value = 0;
  if (data && data.primary && data.primary.book.length > 0) {
    const book = stores.skillBooks.get().find((sb) => {
      return !sb.name.localeCompare(data.primary.book);
    });
    if (book) {
      value += getIncreaseFromBook(
        constants.Attribute.Enum.Attack,
        book,
        [
          constants.BuffCondition.Enum["Against Monsters"],
          constants.BuffCondition.Enum.Attacking,
          constants.BuffCondition.Enum.Marching,
          constants.BuffCondition.Enum["brings a dragon"],
          constants.BuffCondition.Enum["brings dragon or beast to attack"],
          constants.BuffCondition.Enum["dragon to the attack"],
        ],
        [constants.DebuffCondition.Enum["Reduces Monster"]]
      );
    }
  }
  return value;
};

const MountedPvMAttackAttributeTotalMutator = (
  value: number = 0,
  data: TableData
) => {
  /* from Evony Answers "Army General Stats" tab
   * the ROUND function rounds to the specified number of decimals.
   * =ROUND(
   *    (
          (900*0.1) +(
            (
              (L332+
                (M332*2.4867*44)
              )*1.1+50+520
            )-900
          )*0.2
        )/100,3
   *  )
   */
  if (DEBUG) {
    console.log(`attackingAttackIncreaseMutator called`);
  }
  let increase = 0;
  if (data && data.primary) {
    const increment = AttackattributeIncrementMutator(value, data);
    const base = AttackAttributesMutator(value, data);
    const level = data.primary.level ?? 1;

    increase =
      (900 * 0.1 +
        ((base + increment * 2.4867 * 44) * 1.1 + 50 + 520 - 900) * 0.2) /
      100;
    increase = Math.round(increase * 1000) / 1000;
  }
  return increase;
};

const AttackattributeIncrementMutator = (
  value: number = 0,
  data: TableData
) => {
  if (DEBUG) {
    console.log(`attackingAttackIncreaseMutator called`);
  }
  let increase = 0;
  if (data && data.primary) {
    increase += data.primary.basic_attributes.attack.increment;
  }
  return increase;
};

const attackingAttackBaseSkillMutator = (
  value: number = 0,
  data: TableData
) => {
  value = 0;
  if (data && data.primary && data.primary.book.length > 0) {
    const book = stores.skillBooks.get().find((sb) => {
      return !sb.name.localeCompare(data.primary.book);
    });
    if (book) {
      value += getIncreaseFromBook(constants.Attribute.Enum.Attack, book, [
        constants.BuffCondition.Enum.Attacking,
        constants.BuffCondition.Enum.Marching,
        constants.BuffCondition.Enum["brings a dragon"],
        constants.BuffCondition.Enum["brings dragon or beast to attack"],
        constants.BuffCondition.Enum["dragon to the attack"],
      ]);
    }
  }
  return value;
};

const AttackAttributesMutator = (value: number = 0, data: TableData) => {
  let increase = 0;
  if (data && data.primary) {
    increase += data.primary.basic_attributes.attack.base;
  }
  return increase;
};

const marchsizeattributesmutator = (value: number = 0, data: TableData) => {
  return 0;
};
const marchSizeBaseSkillMutator = (value: number = 0, data: TableData) => {
  let marchSizeIncrease = 0;
  const skillbooks = stores.skillBooks.get();
  if (DEBUG) {
    console.log(`marchSizeBaseSkillMutator start`);
  }
  if (data) {
    if (data.primary) {
      if (data.primary.book.length > 0 && skillbooks.length > 0) {
        const book = skillbooks.find((b) => {
          return !b.name.localeCompare(data.primary.book);
        });
        if (book) {
          marchSizeIncrease += getIncreaseFromBook(
            constants.Attribute.Enum["March Size Capacity"],
            book
          );
        } else {
          if (DEBUG) {
            console.warn(`book not found for ${data.primary.id}`);
          }
        }
      } else {
        if (DEBUG) {
          if (skillbooks.length == 0) {
            console.warn(`no skillbooks from collection`);
          }
          if (data.primary.book.length == 0) {
            console.warn(`general ${data.primary.id} has no built in book`);
          }
        }
      }
    } else {
      console.warn(`no primary general for marchSizeBaseSkillMutator`);
    }
    if (data.secondary) {
      if (data.secondary.book.length > 0 && skillbooks.length > 0) {
        const book = skillbooks.find((b) => {
          return !b.name.localeCompare(data.secondary.book);
        });
        if (book) {
          marchSizeIncrease += getIncreaseFromBook(
            constants.Attribute.Enum["March Size Capacity"],
            book
          );
        } else {
          if (DEBUG) {
            console.warn(`book not found for ${data.secondary.id}`);
          }
        }
      } else {
        if (DEBUG) {
          if (skillbooks.length == 0) {
            console.warn(`no skillbooks from collection`);
          }
          if (data.secondary.book.length == 0) {
            console.warn(`general ${data.secondary.id} has no built in book`);
          }
        }
      }
    } else {
      console.warn(`no secondary general for marchSizeBaseSkillMutator`);
    }
  } else {
    if (DEBUG) {
      console.warn(`no data for marchSizeBaseSkillMutator`);
    }
  }

  return marchSizeIncrease;
};
const marchsizeMutator = (value: number = 0, data: TableData) => {
  const attributes = marchsizeattributesmutator(value, data);
  const baseSkill = marchSizeBaseSkillMutator(value, data);
  return attributes + baseSkill;
};

//https://evonyguidewiki.com/en/general-cultivate-en/#Relationship_between_Stats_value_Buff_value
export const attackMutator = (value: number = 0, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.attack.increment;
    const base = data.primary.basic_attributes.attack.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const defenseMutator = (value: number, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.defense.increment;
    const base = data.primary.basic_attributes.defense.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const leadershipMutator = (value: number, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.leadership.increment;
    const base = data.primary.basic_attributes.leadership.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const politicsMutator = (value: number, data: TableData) => {
  if (data) {
    const level = data.primary.level ? data.primary.level : 1;

    const increment = data.primary.basic_attributes.politics.increment;
    const base = data.primary.basic_attributes.politics.base;
    const ascending = data.primary.ascending;
    const AES_adjustment = ascending
      ? constants.BasicAESAdjustment[data.primary.stars]
      : 0;

    let step = base + AES_adjustment + (level - 1) * increment;
    /*
     * unfortunately each general has a totally random amount that each star
     * from 1 to 5 (the non ascending stars) grants to each of the basic attributes.
     * this makes it impossible to reliably account for the fact that you cannot
     * cultivate to an amount higher than your actual basic attribute is currently.
     * I am faking it by assuming you always get an increment of 70, which seems
     * to be the max possible, at each star, or 500 at star 5, which ever is
     * *lesser* (so as not to exceed the 500 max).
     */
    const basicStarAdjustment =
      level < 23
        ? level < 18
          ? level < 14
            ? level < 10
              ? level < 5
                ? 0
                : 70
              : 140
            : 210
          : 280
        : 500;
    const cultivation =
      step < basicStarAdjustment
        ? basicStarAdjustment
        : step > 500
          ? 500
          : step;

    if (DEBUG) {
      console.log(
        `${data.primary.id}:
          base: ${base},
          step: ${step},
          level: ${level},
          increment: ${increment},
          ascending: ${ascending},
          AES_adjustment: ${AES_adjustment},
          basicStarAdjustment: ${basicStarAdjustment}
          cultivation: ${cultivation},
          `
      );
      step = step + cultivation;
    }
    if (step < 900) {
      step = step * 0.1;
    } else {
      step = 90 + (step - 900) * 0.2;
    }
    return step;
  } else {
    return 1;
  }
};

export const overallToughnessMutator = (value: number, data: TableData) => {
  const level =
    stores.selectedValues.get().level != undefined
      ? (stores.selectedValues.get().level as number)
      : 1;
  const leadership = data ? data.primary.basic_attributes.leadership.base : 1;
  const defense = data ? data.primary.basic_attributes.defense.base : 1;

  const l = leadershipMutator(leadership, data);
  const d = defenseMutator(defense, data);

  return l + d;
};

export const overallAttackMutator = (value: number, data: TableData) => {
  const level =
    stores.selectedValues.get().level != undefined
      ? (stores.selectedValues.get().level as number)
      : 1;
  const attack = data ? data.primary.basic_attributes.attack.base : 1;
  const a = attackMutator(attack, data);

  return a;
};
