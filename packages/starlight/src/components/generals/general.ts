import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import { BookConflict } from "@schemas/generalConflictGroups";
import { General, GeneralPair } from "@schemas/generals";
import { GeneralAscending, AscendingLevel } from "@schemas/ascending";

import * as stores from "./store";

import type { SkillBook } from "@schemas/skillBooks";
import { genericPvMBook } from "./generics/genericBook";
import { genericSpeciality } from "./generics/genericSpecialities";
import { genericPvMAscending } from "./generics/genericAscending";
import { Speciality } from "@schemas/specialities";
import { genericStandardSkillBooksEval } from "./generics/genericStandardSkillBook";
const DEBUG = false;
const DEBUG2 = false;
const DEBUG3 = false;
const DEBUG4 = false;

class StandardSkills {
  protected _primary: General;
  protected _secondary: General;
  protected _bookConflicts: BookConflict[] = new Array<BookConflict>();
  protected troopClass: constants.ClassEnum;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;

    this.troopClass = !stores.selectedValues
      .get()
      .type.localeCompare(constants.GeneralType.Enum.ground_specialist)
      ? constants.ClassEnum.Enum["Ground Troops"]
      : !stores.selectedValues
            .get()
            .type.localeCompare(constants.GeneralType.Enum.mounted_specialist)
        ? constants.ClassEnum.Enum["Mounted Troops"]
        : !stores.selectedValues
              .get()
              .type.localeCompare(constants.GeneralType.Enum.ranged_specialist)
          ? constants.ClassEnum.Enum["Ranged Troops"]
          : !stores.selectedValues
                .get()
                .type.localeCompare(constants.GeneralType.Enum.siege_specialist)
            ? constants.ClassEnum.Enum["Siege Machines"]
            : constants.ClassEnum.Enum["All"];

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

  public get PvMAttack() {
    let rValue = 0;
    rValue += genericStandardSkillBooksEval(
      this._primary,
      this._secondary,
      this._bookConflicts,
      constants.Attribute.Enum.Attack,
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
      false,
      false,
      this.troopClass
    );
    return rValue;
  }

  public get PvMreduceDefense() {
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
      false,
      false
    );
    return rValue;
  }
}

class BaseSkill {
  protected _primary: General;
  protected _secondary: General;
  protected _primary_skillBook: SkillBook | null = null;
  protected _secondary_skillBook: SkillBook | null = null;
  protected troopClass: constants.ClassEnum;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;
    this.troopClass = !stores.selectedValues
      .get()
      .type.localeCompare(constants.GeneralType.Enum.ground_specialist)
      ? constants.ClassEnum.Enum["Ground Troops"]
      : !stores.selectedValues
            .get()
            .type.localeCompare(constants.GeneralType.Enum.mounted_specialist)
        ? constants.ClassEnum.Enum["Mounted Troops"]
        : !stores.selectedValues
              .get()
              .type.localeCompare(constants.GeneralType.Enum.ranged_specialist)
          ? constants.ClassEnum.Enum["Ranged Troops"]
          : !stores.selectedValues
                .get()
                .type.localeCompare(constants.GeneralType.Enum.siege_specialist)
            ? constants.ClassEnum.Enum["Siege Machines"]
            : constants.ClassEnum.Enum["All"];

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

  public get PvMAttack() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericPvMBook(
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
  public get PvMDefense() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericPvMBook(
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

  public get PvMHP() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericPvMBook(
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
  public get doubleDrop() {
    if (this._primary_skillBook && this._secondary_skillBook) {
      return genericPvMBook(
        this._primary_skillBook,
        this._secondary_skillBook,
        constants.Attribute.Enum["Double Items Drop Rate"],
        false,
        false,
        false,
        this.troopClass
      );
    }
    return 0;
  }
}

class BaseAttribute {
  protected _primary: General;
  protected _secondary: General;
  protected _attack_base: number;
  protected _defense_base: number;
  protected _leadership_base: number;
  protected _politics_base: number;

  protected _attack_increment: number;
  protected _defense_increment: number;
  protected _leadership_increment: number;
  protected _politics_increment: number;

  protected _attack_total: number;
  protected _defense_total: number;
  protected _leadership_total: number;
  protected _politics_total: number;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;

    this._attack_base = this._primary.basic_attributes.attack.base;
    this._defense_base = this._primary.basic_attributes.defense.base;
    this._leadership_base = this._primary.basic_attributes.leadership.base;
    this._politics_base = this._primary.basic_attributes.politics.base;

    this._attack_increment = this._primary.basic_attributes.attack.increment;
    this._defense_increment = this._primary.basic_attributes.defense.increment;
    this._leadership_increment =
      this._primary.basic_attributes.leadership.increment;
    this._politics_increment =
      this._primary.basic_attributes.politics.increment;

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

    this._defense_total =
      (900 * 0.1 +
        ((this._defense_base + this._defense_increment * 2.4867 * level) * 1.1 +
          50 +
          520 -
          900) *
          0.2) /
      100;

    this._leadership_total =
      (900 * 0.1 +
        ((this._leadership_base + this._leadership_increment * 2.4867 * level) *
          1.1 +
          50 +
          520 -
          900) *
          0.2) /
      100;

    this._politics_total =
      (900 * 0.1 +
        ((this._politics_base + this._politics_increment * 2.4867 * level) *
          1.1 +
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

  public get defense_base() {
    return this._defense_base;
  }
  public get defense_increment() {
    return this._defense_increment;
  }
  public get defense_total() {
    return +this._defense_total.toFixed(3);
  }

  public get leadership_base() {
    return this._leadership_base;
  }
  public get leadership_increment() {
    return this._leadership_increment;
  }
  public get leadership_total() {
    return +this._leadership_total.toFixed(3);
  }

  public get politics_base() {
    return this._politics_base;
  }
  public get politics_increment() {
    return this._politics_increment;
  }
  public get politics_total() {
    return +this._politics_total.toFixed(3);
  }
}

class SpecialityStats {
  protected _primary: General;
  protected _secondary: General;
  protected _primary_specialities = new Array<Speciality>();
  protected _secondary_specialities = new Array<Speciality>();
  protected troopClass: constants.ClassEnum;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;
    this.troopClass = !stores.selectedValues
      .get()
      .type.localeCompare(constants.GeneralType.Enum.ground_specialist)
      ? constants.ClassEnum.Enum["Ground Troops"]
      : !stores.selectedValues
            .get()
            .type.localeCompare(constants.GeneralType.Enum.mounted_specialist)
        ? constants.ClassEnum.Enum["Mounted Troops"]
        : !stores.selectedValues
              .get()
              .type.localeCompare(constants.GeneralType.Enum.ranged_specialist)
          ? constants.ClassEnum.Enum["Ranged Troops"]
          : !stores.selectedValues
                .get()
                .type.localeCompare(constants.GeneralType.Enum.siege_specialist)
            ? constants.ClassEnum.Enum["Siege Machines"]
            : constants.ClassEnum.Enum["All"];

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

  public PvMAttack(level: 1 | 2 | 3 | 4) {
    let rValue = 0;
    rValue += genericSpeciality(
      this._primary_specialities[level - 1],
      this._secondary_specialities[level - 1],
      level,
      constants.Attribute.Enum.Attack,
      this.troopClass
    );
    return rValue;
  }

  public PvMDefense(level: 1 | 2 | 3 | 4) {
    let rValue = 0;
    rValue += genericSpeciality(
      this._primary_specialities[level - 1],
      this._secondary_specialities[level - 1],
      level,
      constants.Attribute.Enum.Defense,
      this.troopClass
    );
    return rValue;
  }

  public PvMHP(level: 1 | 2 | 3 | 4) {
    let rValue = 0;
    rValue += genericSpeciality(
      this._primary_specialities[level - 1],
      this._secondary_specialities[level - 1],
      level,
      constants.Attribute.Enum.HP,
      this.troopClass
    );
    return rValue;
  }

  public doubleDrop(level: 1 | 2 | 3 | 4) {
    let rValue = 0;
    rValue += genericSpeciality(
      this._primary_specialities[level - 1],
      this._secondary_specialities[level - 1],
      level,
      constants.Attribute.Enum["Double Items Drop Rate"],
      this.troopClass
    );
    return rValue;
  }
}

class AscendingStats {
  protected _primary: General;
  protected _secondary: General;
  protected _ascending_attributes: AscendingLevel[] =
    new Array<AscendingLevel>();
  protected troopClass: constants.ClassEnum;

  constructor(row: GeneralPair) {
    this._primary = row.primary;
    this._secondary = row.secondary;
    this.troopClass = !stores.selectedValues
      .get()
      .type.localeCompare(constants.GeneralType.Enum.ground_specialist)
      ? constants.ClassEnum.Enum["Ground Troops"]
      : !stores.selectedValues
            .get()
            .type.localeCompare(constants.GeneralType.Enum.mounted_specialist)
        ? constants.ClassEnum.Enum["Mounted Troops"]
        : !stores.selectedValues
              .get()
              .type.localeCompare(constants.GeneralType.Enum.ranged_specialist)
          ? constants.ClassEnum.Enum["Ranged Troops"]
          : !stores.selectedValues
                .get()
                .type.localeCompare(constants.GeneralType.Enum.siege_specialist)
            ? constants.ClassEnum.Enum["Siege Machines"]
            : constants.ClassEnum.Enum["All"];

    const aa = stores.ascendingAttributes.get();
    if (aa) {
      const pa = aa.find((ga) => {
        return !ga.general.localeCompare(this._primary.id);
      });
      if (pa) {
        this._ascending_attributes = pa.ascending;
      } else {
        if (DEBUG) {
          console.warn(
            `AscendingStats cannot find attributes for ${this._primary.id}`
          );
        }
      }
    } else {
      if (DEBUG) {
        console.warn(
          `AscendingStats is missing ascendingAttributes in constructor`
        );
      }
    }
  }

  public get PvMAttack() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericPvMAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.Attack,
        this.troopClass
      );
    }
    return rValue;
  }

  public get PvMDefense() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericPvMAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.Defense,
        this.troopClass
      );
    }
    return rValue;
  }

  public get PvMHP() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericPvMAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.HP,
        this.troopClass
      );
    }
    return rValue;
  }
  public get doubleDrop() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericPvMAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum["Double Items Drop Rate"],
        this.troopClass
      );
    }
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
  protected _ascendingStats: AscendingStats;
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
    this._ascendingStats = new AscendingStats(row);
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

  public get ascendingStats() {
    return this._ascendingStats;
  }

  public get PvMAttack() {
    let rValue = 0;
    if (
      this._type.localeCompare(constants.GeneralType.Enum.mounted_specialist)
    ) {
      rValue += this._baseAttribute.attack_total;
      rValue += this._baseSkill.PvMAttack;
      rValue += this._standardSkills.PvMAttack;
    }
    return rValue;
  }
}
