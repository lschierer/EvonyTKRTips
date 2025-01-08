import * as constants from "@schemas/constants";
import { General, GeneralPair } from "@schemas/generals";

import * as stores from "./store";

import { BaseSkill } from "./generics/genericBook";
import {
  SpecialityStats,
  genericSpeciality,
} from "./generics/genericSpecialities";
import { AscendingStats } from "./generics/genericAscending";
import { StandardSkills } from "./generics/genericStandardSkillBook";

const DEBUG = false;

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

export class GeneralPairStats {
  protected _primary: General;
  protected _secondary: General;
  protected _baseAttribute: BaseAttribute;
  protected _baseSkill: BaseSkill;
  protected _standardSkills: StandardSkills;
  protected _specialityStats: SpecialityStats;
  protected _ascendingStats: AscendingStats;
  protected _type: constants.GeneralType;

  constructor(row: GeneralPair, type: constants.GeneralType | null = null) {
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
