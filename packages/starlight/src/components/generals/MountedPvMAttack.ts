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
  constructor(row: GeneralPair) {
    this.primary = row.primary;
    this.secondary = row.secondary;
  }
}

class Attack {
  protected baseAttribute: BaseAttribute;

  constructor(row: GeneralPair) {
    this.baseAttribute = new BaseAttribute(row);
  }
}

export class MountedPVM {
  protected attack: Attack;

  constructor(row: GeneralPair) {
    this.attack = new Attack(row);
  }
}
