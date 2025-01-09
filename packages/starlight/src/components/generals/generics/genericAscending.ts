import * as constants from "@schemas/constants";
import { AscendingLevel } from "@schemas/ascending";
import { Buff } from "@schemas/buff";
import { General, GeneralPair } from "@schemas/generals";
import { genericBuffEval } from "./genericBuff";
import * as stores from "../store";

const DEBUG = false;

export class AscendingStats {
  protected _primary: General;
  protected _secondary: General;
  protected _ascending_attributes: AscendingLevel[] =
    new Array<AscendingLevel>();
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

  public get marchSpeed() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum["Marching Speed"],
        false,
        false,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    if (DEBUG) {
      console.log(`AscendingStats MarchSizeIncrease rValue is ${rValue} \n\n`);
    }
    return rValue;
  }

  public get PvMmarchSpeed() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum["Marching Speed"],
        false,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    if (DEBUG) {
      console.log(`AscendingStats MarchSizeIncrease rValue is ${rValue} \n\n`);
    }
    return rValue;
  }

  public get MarchSizeIncrease() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum["March Size Capacity"],
        false,
        false,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    if (DEBUG) {
      console.log(`AscendingStats MarchSizeIncrease rValue is ${rValue} \n\n`);
    }
    return rValue;
  }

  public get PvMAttack() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.Attack,
        false,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    if (DEBUG) {
      console.log(`AscendingStats PvMAttack rValue is ${rValue} \n\n`);
    }
    return rValue;
  }

  public get PvMreduceAttack() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.Attack,
        true,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    if (DEBUG) {
      console.log(`AscendingStats PvMreduceAttack rValue is ${rValue} \n\n`);
    }
    return rValue;
  }

  public get PvMDefense() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.Defense,
        false,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    return rValue;
  }

  public get PvMreduceDefense() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.Defense,
        true,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    return rValue;
  }

  public get PvMHP() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.HP,
        false,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    return rValue;
  }

  public get PvMreduceHP() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum.HP,
        true,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    return rValue;
  }

  public get doubleDrop() {
    let rValue = 0;
    const level = stores.selectedValues.get().stars;

    if (level) {
      rValue += genericAscending(
        this._ascending_attributes,
        level,
        constants.Attribute.Enum["Double Items Drop Rate"],
        false,
        true,
        false,
        this.troopClass.localeCompare(constants.ClassEnum.Enum.All)
          ? this.troopClass
          : undefined
      );
    }
    return rValue;
  }
}

const genericAscending = (
  alevels: AscendingLevel[],
  level: constants.AscendingLevel,
  attribute: constants.Attribute,
  debuffAttribute: boolean,
  pvm: boolean = false,
  reinforcing: boolean = false,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  rValue += alevels.reduce((aSum, alevel) => {
    if (DEBUG) {
      console.log(
        `start of genericAscending alevels reduce loop, aSum is ${aSum}`
      );
    }
    if (!alevel.level.localeCompare(level)) {
      if (DEBUG) {
        console.log(`found match to ${level}`);
      }
      const b = alevel.buff;
      aSum += evalSingleLevelBuffs(
        b,
        attribute,
        debuffAttribute,
        pvm,
        reinforcing,
        troopClass
      );
    } else {
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red2) &&
        !alevel.level.localeCompare(constants.AscendingLevel.Enum.red1)
      ) {
        const b = alevel.buff;
        aSum += evalSingleLevelBuffs(
          b,
          attribute,
          debuffAttribute,
          pvm,
          reinforcing,
          troopClass
        );
      }
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red3) &&
        (!alevel.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red2))
      ) {
        const b = alevel.buff;
        aSum += evalSingleLevelBuffs(
          b,
          attribute,
          debuffAttribute,
          pvm,
          reinforcing,
          troopClass
        );
      }
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red4) &&
        (!alevel.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red3))
      ) {
        const b = alevel.buff;
        aSum += evalSingleLevelBuffs(
          b,
          attribute,
          debuffAttribute,
          pvm,
          reinforcing,
          troopClass
        );
      }
      if (
        !level.localeCompare(constants.AscendingLevel.Enum.red5) &&
        (!alevel.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red3) ||
          !alevel.level.localeCompare(constants.AscendingLevel.Enum.red4))
      ) {
        if (DEBUG) {
          console.log(`level is ${level} and alevel is ${alevel.level}`);
        }
        const b = alevel.buff;
        aSum += evalSingleLevelBuffs(
          b,
          attribute,
          debuffAttribute,
          pvm,
          reinforcing,
          troopClass
        );
      }
      if (DEBUG) {
        console.log(`genericAscending aSum is ${aSum}`);
      }
      return aSum;
    }
    return aSum;
  }, rValue);
  if (DEBUG) {
    console.log(`rValue is ${rValue}`);
  }
  return rValue;
};

const evalSingleLevelBuffs = (
  b: Buff[],
  attribute: constants.Attribute,
  debuffAttribute: boolean,
  pvm: boolean = false,
  reinforcing: boolean = false,
  troopClass?: constants.ClassEnum
) => {
  let evalSingleLevelBuffsValue = 0;
  if (Array.isArray(b)) {
    evalSingleLevelBuffsValue += b.reduce((sum, buff) => {
      if (DEBUG) {
        console.log(`buff.attribute: ${buff.attribute}`);
        console.log(
          `buff.condition: ${buff.condition ? buff.condition.join(" ") : ""}`
        );
        console.log(`buff.value.number: ${buff.value.number}`);
      }
      sum += genericBuffEval(
        buff,
        attribute,
        debuffAttribute,
        pvm,
        reinforcing,
        troopClass
      );
      if (DEBUG) {
        console.log(`genericBuffEval sum is ${sum}`);
      }
      return sum;
    }, evalSingleLevelBuffsValue);
  } else {
    console.warn(
      `something wrong with buff in evalSingleLevelBuffs '${JSON.stringify(b)}'`
    );
  }
  if (DEBUG) {
    console.log(`evalSingleLevelBuffs returning ${evalSingleLevelBuffsValue}`);
  }
  return evalSingleLevelBuffsValue;
};
