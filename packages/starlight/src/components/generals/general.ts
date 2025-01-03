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

class BaseAttribute {
  protected primary: General;
  protected secondary: General;
  protected _attack_base: number;
  protected _attack_increment: number;
  protected _attack_total: number;
  constructor(row: GeneralPair) {
    this.primary = row.primary;
    this.secondary = row.secondary;

    this._attack_base = this.primary.basic_attributes.attack.base;
    this._attack_increment = this.primary.basic_attributes.attack.increment;
    const level = Math.min(Math.max(stores.selectedValues.get().level, 1), 45);
    /* Evony Answers Generals Spreadsheet Army Generals & Equipment Stats tab cell M585 */

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

class Attack {
  protected _baseAttribute: BaseAttribute;

  constructor(row: GeneralPair) {
    this._baseAttribute = new BaseAttribute(row);
  }

  public get baseAttribute() {
    return this._baseAttribute;
  }
}

export class MountedPVM {
  protected _attack: Attack;

  constructor(row: GeneralPair) {
    this._attack = new Attack(row);
  }

  public get attack() {
    return this._attack;
  }
}
