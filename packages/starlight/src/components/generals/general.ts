import { General, GeneralType, GeneralPair } from "@schemas/generals";
import { AscendingLevel, GeneralAscending } from "@schemas/ascending";
import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import { MarchSize as MarchSizeBooks } from "@schemas/standardSkillBooks";

import { type StoreValue, subscribeKeys } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";
import type { SkillBook } from "@schemas/skillBooks";
import type { Speciality } from "@schemas/specialities";
import { Level } from "@schemas/covenants";

const DEBUG = false;
const DEBUG2 = false;
const DEBUG3 = false;

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

  public get monsterAttack() {
    const bookEval = (book: SkillBook) => {
      let rValue = 0;
      if (book) {
        if (book) {
          const buffs = book.buff;
          if (Array.isArray(buffs)) {
            buffs.map((buff) => {
              if (
                !buff.attribute.localeCompare(constants.Attribute.Enum.Attack)
              ) {
                rValue += buff.value.number;
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

  public get reinforcingAttack() {
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
                      constants.BuffCondition.Enum["Reinforcing"]
                    ) ||
                    buff.condition.includes(
                      constants.BuffCondition.Enum[
                        "When Defending Outside The Main City"
                      ]
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

export class GeneralPairStats {
  protected _primary: General;
  protected _secondary: General;
  protected _baseAttribute: BaseAttribute;
  protected _baseSkill: BaseSkill;
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
  }

  public get baseAttribute() {
    return this._baseAttribute;
  }

  public get baseSkill() {
    return this._baseSkill;
  }

  public get mountedPvMAttack() {
    let rValue = 0;
    if (this._type.localeCompare(GeneralType.Enum.mounted_specialist)) {
      rValue += this._baseAttribute.attack_total;
      rValue += this._baseSkill.monsterAttack;
    }
    return rValue;
  }
}
