import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import { BookConflict } from "@schemas/generalConflictGroups";
import { General, GeneralPair, GeneralType } from "@schemas/generals";
import AllStandardSkillBooks from "@schemas/standardSkillBooks";

import * as stores from "./store";

import type { SkillBook } from "@schemas/skillBooks";
import { genericPvMBook } from "./generics/genericBook";
import { genericPvMSpeciality } from "./generics/genericSpecialities";
import { Speciality } from "@schemas/specialities";
const DEBUG = false;
const DEBUG2 = false;
const DEBUG3 = false;

class StandardSkills {
  protected _primary: General;
  protected _secondary: General;
  protected _bookConflicts: BookConflict[] = new Array<BookConflict>();

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;

    const conflictGroups = stores.conflictGroups.get();
    if (conflictGroups.length > 0) {
      conflictGroups.map((cg) => {
        if (cg.books) {
          if (
            cg.members.includes(this._primary.id) ||
            cg.members.includes(this._secondary.id)
          ) {
            this._bookConflicts.push(...cg.books);
          }
        }
      });
      if (DEBUG2) {
        console.log(
          `StandardSkills ${row.primary.id}/${row.secondary.id}: found ${this._bookConflicts.length} conflicting skillbooks`
        );
        if (this._bookConflicts.length > 0) {
          console.log(
            `StandardSkills ${row.primary.id}/${row.secondary.id}: found
            ${this._bookConflicts
              .map((bc) => {
                return `${bc.book.name}: ${bc.book.level}`;
              })
              .join("\n")}`
          );
        }
      }
    } else {
      if (DEBUG) {
        console.warn(`missing conflict groups in generals.ts`);
      }
    }
  }

  public get mountedPvMAttack() {
    let rValue = 0;
    AllStandardSkillBooks.map((ssb) => {
      if (this._bookConflicts.length > 0) {
        if (DEBUG2) {
          console.log(
            `StandardSkills ${this._primary.id}/${this._secondary.id} comparison against book conflicts `
          );
          const matched = this._bookConflicts.find((bc) => {
            /* I am evaluating as if all 6 books are on the primary general */
            /*
             * I am assuming there is no case of generals that otherwise work together
             * that both have a "when not mine" restrict on the *same* book.
             */
            /* TODO: evaluate fine grained book assignment */
            if (
              !bc.condition.localeCompare(
                constants.BookCondition.Enum["all the time"]
              )
            ) {
              if (
                !bc.book.name
                  .toLowerCase()
                  .localeCompare(ssb.name.toLowerCase())
              ) {
                return true;
              }
            }
            return false;
          })
            ? true
            : false;
          if (!matched) {
            if (DEBUG2) {
              console.log(
                `StandardSkills ${this._primary.id}/${this._secondary.id} no conflict for ${ssb.name}`
              );
            }
            if (ssb.level == 4) {
              rValue += genericPvMBook(
                ssb,
                null,
                constants.Attribute.Enum.Attack,
                constants.ClassEnum.Enum["Mounted Troops"]
              );
            }
          }
        }
      } else {
        if (DEBUG2) {
          console.log(
            `StandardSkills ${this._primary.id}/${this._secondary.id} no skill book conflicts`
          );
        }
        /* always only evaluate the biggest of each type of skill book */
        if (ssb.level == 4) {
          rValue += genericPvMBook(
            ssb,
            null,
            constants.Attribute.Enum.Attack,
            constants.ClassEnum.Enum["Mounted Troops"]
          );
        }
      }
    });
    return rValue;
  }
}

class BaseSkill {
  protected _primary: General;
  protected _secondary: General;
  protected _primary_skillBook: SkillBook | null = null;
  protected _secondary_skillBook: SkillBook | null = null;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;
    if (stores.skillBooks.value.length > 0) {
      this._primary_skillBook =
        stores.skillBooks.get().find((sb) => {
          return !sb.name.localeCompare(this._primary.book);
        }) ?? null;
      this._secondary_skillBook =
        stores.skillBooks.get().find((sb) => {
          return !sb.name.localeCompare(this._secondary.book);
        }) ?? null;
    } else {
      if (DEBUG) {
        console.warn(`missing skillbooks in generals.ts BaseSkill constructor`);
      }
    }
  }

  public get mountedPvMAttack() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericPvMBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Attack,
        constants.ClassEnum.Enum["Mounted Troops"]
      );
    }
    return 0;
  }

  public get mountedReinforcingAttack() {
    return this.genericReinforcingAttack(
      constants.ClassEnum.Enum["Mounted Troops"]
    );
  }

  protected reinforcingBuffEval = (
    buff: Buff,
    attribute: constants.Attrbute,
    troopClass?: constants.ClassEnum
  ) => {
    let rValue = 0;
    if (!buff.attribute.localeCompare(attribute)) {
      if (buff.condition) {
        if (
          buff.condition.includes(constants.BuffCondition.Enum.Defending) ||
          buff.condition.includes(
            constants.BuffCondition.Enum["brings a dragon"]
          ) ||
          buff.condition.includes(
            constants.BuffCondition.Enum["Reinforcing"]
          ) ||
          buff.condition.includes(
            constants.BuffCondition.Enum["When Defending Outside The Main City"]
          ) ||
          buff.condition.includes(constants.BuffCondition.Enum["In Main City"])
        ) {
          if (troopClass) {
            if (buff.class && !buff.class.localeCompare(troopClass)) {
              rValue += buff.value.number;
            } else if (!buff.class) {
              rValue += buff.value.number;
            }
          } else {
            rValue += buff.value.number;
          }
        }
      } else {
        if (troopClass) {
          if (buff.class) {
            if (buff.class.localeCompare(troopClass)) {
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
  public genericReinforcingAttack(troopClass: constants.ClassEnum) {
    const bookEval = (book: SkillBook) => {
      let rValue = 0;
      if (book) {
        if (book.buff) {
          const buffs = book.buff;
          if (Array.isArray(buffs)) {
            buffs.map((buff) => {
              rValue += this.reinforcingBuffEval(
                buff,
                constants.Attribute.Enum.Attack,
                troopClass
              );
            });
          } else {
            rValue += this.reinforcingBuffEval(
              buffs,
              constants.Attribute.Enum.Attack,
              troopClass
            );
          }
        }
      }
      return rValue;
    };
    let rValue = 0;
    if (this._primary_skillBook) {
      rValue += bookEval(this._primary_skillBook);
    }
    if (this._secondary_skillBook) {
      rValue += bookEval(this._secondary_skillBook);
    }
    return rValue;
  }

  public get wallAttack() {
    const bookEval = (book: SkillBook) => {
      let rValue = 0;
      if (book) {
        if (book.buff) {
          const buffs = book.buff;
          if (Array.isArray(buffs)) {
            buffs.map((buff) => {
              if (
                !buff.attribute.localeCompare(constants.Attribute.Enum.Attack)
              ) {
                if (buff.condition) {
                  if (
                    buff.condition.includes(
                      constants.BuffCondition.Enum.Defending
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["brings a dragon"]
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["In Main City"]
                    )
                  ) {
                    rValue += buff.value.number;
                  }
                } else {
                  rValue += buff.value.number;
                }
              }
            });
          }
        }
      }
      return rValue;
    };
    let rValue = 0;
    if (this._primary_skillBook) {
      rValue += bookEval(this._primary_skillBook);
    }
    if (this._secondary_skillBook) {
      rValue += bookEval(this._secondary_skillBook);
    }
    return rValue;
  }

  public get defendingAttack() {
    const bookEval = (book: SkillBook) => {
      let rValue = 0;
      if (book) {
        if (book.buff) {
          const buffs = book.buff;
          if (Array.isArray(buffs)) {
            buffs.map((buff) => {
              if (
                !buff.attribute.localeCompare(constants.Attribute.Enum.Attack)
              ) {
                if (buff.condition) {
                  if (
                    buff.condition.includes(
                      constants.BuffCondition.Enum.Defending
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["brings a dragon"]
                    )
                  ) {
                    rValue += buff.value.number;
                  }
                } else {
                  rValue += buff.value.number;
                }
              }
            });
          }
        }
      }
      return rValue;
    };
    let rValue = 0;
    if (this._primary_skillBook) {
      rValue += bookEval(this._primary_skillBook);
    }
    if (this._secondary_skillBook) {
      rValue += bookEval(this._secondary_skillBook);
    }
    return rValue;
  }

  /* TODO: I need to add a check that the user is the rally lead */
  public get marchingAttack() {
    const bookEval = (book: SkillBook) => {
      let rValue = 0;
      if (book) {
        if (book.buff) {
          const buffs = book.buff;
          if (Array.isArray(buffs)) {
            buffs.map((buff) => {
              if (
                !buff.attribute.localeCompare(constants.Attribute.Enum.Attack)
              ) {
                if (buff.condition) {
                  if (
                    buff.condition.includes(
                      constants.BuffCondition.Enum.Attacking
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum.Marching
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["brings a dragon"]
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum[
                        "brings dragon or beast to attack"
                      ]
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["dragon to the attack"]
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["leading the army to attack"]
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum["When Rallying"]
                    )
                  ) {
                    rValue += buff.value.number;
                  }
                } else {
                  rValue += buff.value.number;
                }
              }
            });
          }
        }
      }
      return rValue;
    };
    let rValue = 0;
    if (this._primary_skillBook) {
      rValue += bookEval(this._primary_skillBook);
    }
    if (this._secondary_skillBook) {
      rValue += bookEval(this._secondary_skillBook);
    }
    return rValue;
  }
}
class BaseAttribute {
  protected _primary: General;
  protected _secondary: General;
  protected _attack_base: number;
  protected _attack_increment: number;
  protected _attack_total: number;
  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;

    this._attack_base = this._primary.basic_attributes.attack.base;
    this._attack_increment = this._primary.basic_attributes.attack.increment;
    const level = Math.min(Math.max(stores.selectedValues.get().level, 1), 45);
    /*
     * Evony Answers Generals Spreadsheet Army Generals & Equipment Stats tab cell M585
     * the original formula there has a "Round(...,3)" around it,
     * I am doing what I believe is the same by the ".toFixed(3)" just before the return.
     */

    this._attack_total =
      (900 * 0.1 +
        ((this._attack_base + this._attack_increment * 2.4867 * level) * 1.1 +
          50 +
          520 -
          900) *
          0.2) /
      100;
  }
  public get attack_base() {
    return this._attack_base;
  }
  public get attack_increment() {
    return this._attack_increment;
  }
  public get attack_total() {
    return +this._attack_total.toFixed(3);
  }
}

class SpecialityStats {
  protected _primary: General;
  protected _secondary: General;
  protected _primary_specialities = new Array<Speciality>();
  protected _secondary_specialities = new Array<Speciality>();

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;

    if (stores.specialities.get().length > 0) {
      this._primary.specialities.forEach((specialityName, index) => {
        const speciality = stores.specialities.get().find((s) => {
          return !s.name.localeCompare(specialityName);
        });
        if (speciality) {
          this._primary_specialities[index] = speciality;
          if (DEBUG3) {
            console.log(
              `SpecialityStats ${this._primary.id} speciality #${index + 1} is ${speciality.name} `
            );
          }
        }
      });

      this._secondary.specialities.forEach((specialityName, index) => {
        const speciality = stores.specialities.get().find((s) => {
          return !s.name.localeCompare(specialityName);
        });
        if (speciality) {
          this._secondary_specialities[index] = speciality;
        }
      });
    } else {
      console.warn(`SpecialityStats constructor missing specialities`);
    }
  }

  public mountedPvMAttack(level: 1 | 2 | 3 | 4) {
    let rValue = 0;
    rValue += genericPvMSpeciality(
      this._primary_specialities[level - 1],
      this._secondary_specialities[level - 1],
      level,
      constants.Attribute.Enum.Attack,
      constants.ClassEnum.Enum["Mounted Troops"]
    );
    return rValue;
  }
}

export class GeneralPairStats {
  protected _primary: General;
  protected _secondary: General;
  protected _baseAttribute: BaseAttribute;
  protected _baseSkill: BaseSkill;
  protected _standardSkills: StandardSkills;
  protected _specialityStats: SpecialityStats;
  protected _type: GeneralType;

  constructor(row: GeneralPair, type: GeneralType | null = null) {
    this._primary = row.primary;
    this._secondary = row.secondary;
    this._type = type
      ? type
      : Array.isArray(row.primary.type)
        ? row.primary.type[0]
        : row.primary.type;
    this._baseAttribute = new BaseAttribute(row);
    this._baseSkill = new BaseSkill(row);
    this._standardSkills = new StandardSkills(row);
    this._specialityStats = new SpecialityStats(row);
  }

  public get baseAttribute() {
    return this._baseAttribute;
  }

  public get baseSkill() {
    return this._baseSkill;
  }

  public get standardSkillBooks() {
    return this._standardSkills;
  }

  public get specialityStats() {
    return this._specialityStats;
  }

  public get mountedPvMAttack() {
    let rValue = 0;
    if (this._type.localeCompare(GeneralType.Enum.mounted_specialist)) {
      rValue += this._baseAttribute.attack_total;
      rValue += this._baseSkill.mountedPvMAttack;
      rValue += this._standardSkills.mountedPvMAttack;
    }
    return rValue;
  }
}
