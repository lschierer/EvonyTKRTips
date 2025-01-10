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

import rallySpotBaseMarch from "@lib/rallySpot";

const DEBUG = true;

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

  public get EvAnsPvMAttack() {
    /*
     * Evony Answers SpreadSheet
     * EM.Power Ratings, Mounted
     * Column S
     * (row 891 for the first PVM Mounted General)
     */
    let rValue = 0;
    /*
      AttackAttribute = defaults to 6670 // Cell D883 is the T14 Attribute.
      MountedKeepBasePercentage = 1180.0% //Cell T703
      MountedBuffFromSubs = defaults to 0 //Cell T704
      GeneralGearBuffs = defaults to 650.1 //Cell T760
      Dragon/BeastBuffs = defaults to 197.2 //Cell T762
      FlexibleSkillBookBuffs = defaults to 20% //Cell T769 & T774
      StandardSkillBookBuffs = defaults to 45%  //Cell T770 & T775

      TotalMountedPercentageBuffs =  (defaults to 2092.3%)//Cell T780 becomes L883
        MountedKeepBasePercentage (defaults to 1180.0%) +
        MountedBuffFromSubs (defaults to 0) +
        GeneralGearBuffs (defaults to 80 + 50 +26.3 +29 +26.3 + 28 +20 +30 +20 +35 +30 +30 +35 +28.3 +29 +27.2 +26 +20 +15 +50 +15 = 650.1%)+
        Dragon/BeastBuffs (defaults to 197.2) +
        FlexibleSkillBookBuffs (defaults to 20) +
        StandardSkillBookBuffs (defaults to 45);

      FlatAttribute = //Cell T157 becomess M194
      TotalMountedFlatBuffs = //Cell T846 becomes M883
        MountedKeepBaseFlat = defaults to 200 //Cell T784
        GeneralGearBuffsFlat = defaults to 0 //Cells T786 to T838
        Dragon/BeastBuffsFlat = defaults to 0 //Cell T840
        FlexibleSkillBookBuffsFlat = defaults to 625 //Cells T842 and T844

        GeneralsAttackPercentage // Column L (Cell L891) (compute the same way the store does the BuffSet.Attack.total)

        TotalAttackPercentage = TotalMountedPercentageBuffs + GeneralsAttackPercentage; //Column M (cell M891)

        EvAnsMountedPvMAttackMultiplier = 2.81859 // Cell D885

        TotalMarchSize = defaults to arbitrary 4,318,900 //Cell P183
        /*
         * The Spreadsheet seems to be set up so that I create a custom PvP march partly *by hand*
         * and computes a march size from that PvP march.
         *

        // EvAns is doing something wierd with march size
        // total troops is the RallySpot at k40 * the march buff for the extra troops
        // then the extra troops plus an arbitrary user-entered number for the total troops.
        BaseTroops = 3,218,900 // Cell J883
          MountedT15s = defaults to 550000 // Cell I883

        RallySpotBaseMarch = defaults to 550000 // Cell P10 becomes I194

        MarchSizeBuff (compute as the store does MarchSizeIncrease.total)

        ExtraTroops = MarchSizeBuff*RallySpotBaseMarch

        //** EvAns is ignoring extra troops from armor & mayors
        //** For PvM it goes based on Rally Spot and General alone.
        //** for PvP it essentially has you *tell* it a march size for some aspects of the formula
        TotalTroops = // Column J Cell J891
          BaseTroops + ExtraTroops
      (
        (
          AttackAttribute * ( 1 + TotalAttackPercentage ) +
          TotalMountedFlatBuffs
        ) * TotalTroops
      ) * EvAnsMountedPvMAttackMultiplier / 1000000000

      several values must be recomputed because when the store creates a generalPairStat object,
      the store _itself_ is initializing BuffSet and MarchSizeIncrease (for example), and so cannot pass
      these objects into the generalPairStat object's constructor.  There is a chicken/egg problem I haven't
      solved.
    */

    return rValue;
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
