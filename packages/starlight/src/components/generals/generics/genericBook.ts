import * as constants from "@schemas/constants";
import type { SkillBook } from "@schemas/skillBooks";
import { genericBuffEval } from "./genericBuff";

import * as stores from "../store";

import { General, GeneralPair } from "@schemas/generals";

const DEBUG = false;

export class BaseSkill {
  protected _primary: General;
  protected _secondary: General;
  protected _primary_skillBook: SkillBook | null = null;
  protected _secondary_skillBook: SkillBook | null = null;
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

  public get Attack() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Attack,
        false,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMAttack() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Attack,
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get Defense() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Defense,
        false,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMDefense() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Defense,
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get HP() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.HP,
        false,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMHP() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.HP,
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get reduceAttack() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Attack,
        true,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMreduceAttack() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Attack,
        true,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMreduceDefense() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Defense,
        true,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get reduceDefense() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.Defense,
        true,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get reduceHP() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.HP,
        true,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMreduceHP() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum.HP,
        true,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get MarchSizeIncrease() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["March Size Capacity"],
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get marchSpeed() {
    let msi = 0;
    if (this._primary_skillBook && this._secondary_skillBook) {
      msi += genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["Marching Speed"],
        false,
        false,
        false,
        this.troopClass
      );
    }
    return msi;
  }

  public get PvMmarchSpeed() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["Marching Speed"],
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get doubleDrop() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["Double Items Drop Rate"],
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get reduceStaminaCost() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["Stamina cost"],
        false,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }

  public get PvMreduceStaminaCost() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["Stamina cost"],
        false,
        true,
        false,
        this.troopClass
      );
    }
    return 0;
  }
}

export const genericBook = (
  primary_skillBook: SkillBook,
  secondary_skillBook: SkillBook | null,
  attribute: constants.Attribute,
  debuffAttribute = false,
  pvm = false,
  reinforcing = false,
  troopClass?: constants.ClassEnum
) => {
  const bookEval = (book: SkillBook) => {
    let rValue = 0;
    if (book) {
      if (book) {
        const buffs = book.buff;
        if (Array.isArray(buffs)) {
          buffs.map((buff) => {
            rValue += genericBuffEval(
              buff,
              attribute,
              debuffAttribute,
              pvm,
              reinforcing,
              troopClass
            );
          });
        } else {
          rValue += genericBuffEval(
            buffs,
            attribute,
            debuffAttribute,
            pvm,
            reinforcing,
            troopClass
          );
        }
      }
    }
    return rValue;
  };
  let rValue = 0;
  if (primary_skillBook) {
    rValue += bookEval(primary_skillBook);
  }
  if (secondary_skillBook) {
    rValue += bookEval(secondary_skillBook);
  }
  return rValue;
};
