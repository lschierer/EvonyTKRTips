import * as constants from "@schemas/constants";
import { type BookConflict } from "@schemas/generalConflictGroups";

import { type General, type GeneralPair } from "@schemas/generals";

import * as stores from "../store";
import AllStandardSkillBooks from "@lib/standardSkillBooks";
import { genericBook } from "./genericBook";

import debugFunction from "@lib/debug";
const DEBUG = debugFunction(
  "components/generals/generics/genericStandardSkillBook.ts"
);
const DEBUG2 = debugFunction(
  "components/generals/generics/genericStandardSkillBook.ts"
);
const DEBUG4 = debugFunction(
  "components/generals/generics/genericStandardSkillBook.ts"
);

export class StandardSkills {
  protected _primary: General;
  protected _secondary: General;
  protected _bookConflicts: BookConflict[] = new Array<BookConflict>();
  protected troopClass: constants.ClassEnum;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;

    this.troopClass = !stores.generalSpecalist
      .get()
      .localeCompare(constants.GeneralType.Enum.ground_specialist)
      ? constants.ClassEnum.Enum["Ground Troops"]
      : !stores.generalSpecalist
            .get()
            .localeCompare(constants.GeneralType.Enum.mounted_specialist)
        ? constants.ClassEnum.Enum["Mounted Troops"]
        : !stores.generalSpecalist
              .get()
              .localeCompare(constants.GeneralType.Enum.ranged_specialist)
          ? constants.ClassEnum.Enum["Ranged Troops"]
          : !stores.generalSpecalist
                .get()
                .localeCompare(constants.GeneralType.Enum.siege_specialist)
            ? constants.ClassEnum.Enum["Siege Machines"]
            : constants.ClassEnum.Enum.All;

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

  public get Attack() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Attack,
      false,
      true,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get PvMAttack() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Attack,
      false,
      true,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get Defense() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Defense,
      false,
      false,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get PvMDefense() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Defense,
      false,
      true,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get HP() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.HP,
      false,
      false,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get PvMHP() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.HP,
      false,
      true,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get reduceAttack() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Attack,
      true,
      false,
      false,
      this.troopClass
    );
    if (DEBUG) {
      console.log(
        `PvMreduceAttack ${this._primary.id}/${this._secondary.id}returning ${rValue} \n\n`
      );
    }
    return rValue;
  }

  public get PvMreduceAttack() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Attack,
      true,
      true,
      false,
      this.troopClass
    );
    if (DEBUG) {
      console.log(
        `PvMreduceAttack ${this._primary.id}/${this._secondary.id}returning ${rValue} \n\n`
      );
    }
    return rValue;
  }

  public get reduceDefense() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Defense,
      true,
      false,
      false,
      this.troopClass
    );
    if (DEBUG) {
      console.log(
        `PvMreduceDefense ${this._primary.id}/${this._secondary.id}returning ${rValue} \n\n`
      );
    }
    return rValue;
  }

  public get PvMreduceDefense() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Defense,
      true,
      true,
      false,
      this.troopClass
    );
    if (DEBUG) {
      console.log(
        `PvMreduceDefense ${this._primary.id}/${this._secondary.id}returning ${rValue} \n\n`
      );
    }
    return rValue;
  }

  public get reduceHP() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.HP,
      true,
      false,
      false,
      this.troopClass
    );
    if (DEBUG) {
      console.log(
        `PvMreduceHP ${this._primary.id}/${this._secondary.id}returning ${rValue} \n\n`
      );
    }
    return rValue;
  }

  public get PvMreduceHP() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.HP,
      true,
      true,
      false,
      this.troopClass
    );
    if (DEBUG) {
      console.log(
        `PvMreduceHP ${this._primary.id}/${this._secondary.id}returning ${rValue} \n\n`
      );
    }
    return rValue;
  }

  public get MarchSizeIncrease() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum["March Size Capacity"],
      false,
      false,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get marchSpeed() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum["Marching Speed"],
      false,
      false,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get PvMmarchSpeed() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum["Marching Speed"],
      false,
      true,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get doubleDrop() {
    if (DEBUG4) {
      console.log(`doubleDrop for StandardSkills`);
    }
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum["Double Items Drop Rate"],
      false,
      true,
      false
    );
    return rValue;
  }

  public get reduceStaminaCost() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum["Stamina cost"],
      false,
      false,
      false
    );
    return rValue;
  }

  public get PvMreduceStaminaCost() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum["Stamina cost"],
      false,
      true,
      false
    );
    return rValue;
  }
}

export const genericStandardSkillBooksEval = (
  primary: General,
  secondary: General,
  bookConflicts: BookConflict[],
  attribute: constants.Attribute,
  debuffAttribute = false,
  pvm = false,
  reinforcing = false,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  AllStandardSkillBooks.map((ssb) => {
    if (bookConflicts.length > 0) {
      if (DEBUG) {
        console.log(
          `StandardSkills ${primary.id}/${secondary.id} comparison against book conflicts `
        );
      }
      const matched = bookConflicts.find((bc) => {
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
            !bc.book.name.toLowerCase().localeCompare(ssb.name.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      })
        ? true
        : false;
      if (!matched) {
        if (DEBUG) {
          console.log(
            `StandardSkills ${primary.id}/${secondary.id} no conflict for ${ssb.name}`
          );
        }
        if (ssb.level == 4) {
          rValue += genericBook(
            ssb,
            null,
            attribute,
            debuffAttribute,
            pvm,
            reinforcing,
            troopClass
          );
        }
      }
    } else {
      if (DEBUG) {
        console.log(
          `StandardSkills ${primary.id}/${secondary.id} no skill book conflicts`
        );
      }
      /* always only evaluate the biggest of each type of skill book */
      if (ssb.level == 4) {
        rValue += genericBook(
          ssb,
          null,
          attribute,
          debuffAttribute,
          pvm,
          reinforcing,
          troopClass
        );
      }
    }
  });
  return rValue;
};
