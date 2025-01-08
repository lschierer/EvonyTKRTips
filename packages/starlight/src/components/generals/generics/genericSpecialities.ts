import * as constants from "@schemas/constants";
import { Speciality } from "@schemas/specialities";
import { GeneralPair, General } from "@schemas/generals";
import { genericBuffEval } from "./genericBuff";
import * as stores from "../store";

const DEBUG = true;
const DEBUG2 = true;
const DEBUG3 = false;

export class SpecialityStats {
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
      false,
      true,
      false,
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
      false,
      true,
      false,
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
      false,
      true,
      false,
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
      false,
      true,
      false,
      this.troopClass
    );
    return rValue;
  }
}

export const genericSpeciality = (
  primary_speciality: Speciality,
  secondary_speciality: Speciality | null,
  specialityNumber: 1 | 2 | 3 | 4,
  attribute: constants.Attribute,
  debuffAttribute: boolean,
  pvm: boolean = false,
  reinforcing: boolean = false,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  if (primary_speciality) {
    rValue += specialityEval(
      primary_speciality,
      specialityNumber,
      "primary",
      attribute,
      debuffAttribute,
      pvm,
      reinforcing,
      troopClass
    );
  }
  if (secondary_speciality) {
    rValue += specialityEval(
      secondary_speciality,
      specialityNumber,
      "secondary",
      attribute,
      debuffAttribute,
      pvm,
      reinforcing,
      troopClass
    );
  }
  return rValue;
};

const specialityEval = (
  speciality: Speciality,
  specialityNumber: 1 | 2 | 3 | 4,
  role: "primary" | "secondary",
  attribute: constants.Attribute,
  debuffAttribute: boolean,
  pvm: boolean = false,
  reinforcing: boolean = false,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  const levels = speciality.levels;
  const selections = new Array<constants.SpecialityLevelName>();
  if (DEBUG2) {
    console.log(
      `specialityEval: ${speciality.name} as ${role} #${specialityNumber}`
    );
  }
  if (!role.localeCompare("primary")) {
    const s = stores.selectedValues.get().primarySpecialityLevels;
    if (DEBUG) {
      console.log(`primary selections are\n${s.join("\n")}`);
    }
    selections.push(...s);
  } else {
    const s = stores.selectedValues.get().secondarySpecialityLevels;
    if (DEBUG) {
      console.log(`secondary selections are\n${s.join("\n")}`);
    }
    selections.push(...s);
  }
  if (
    selections[specialityNumber - 1].localeCompare(
      constants.SpecialityLevelName.Enum.None
    )
  ) {
    const levenNumber = specialityNumber - 1;
    rValue += levels.reduce((sum: number, level) => {
      if (DEBUG) {
        console.log(`specialityEval levels reduce sum ${sum}`);
      }
      if (Array.isArray(level.buff)) {
        if (
          !selections[levenNumber].localeCompare(level.level) ||
          (!selections[levenNumber].localeCompare(
            constants.SpecialityLevelName.Enum.Blue
          ) &&
            !level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Green
            )) ||
          (!selections[levenNumber].localeCompare(
            constants.SpecialityLevelName.Enum.Purple
          ) &&
            (!level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Green
            ) ||
              !level.level.localeCompare(
                constants.SpecialityLevelName.Enum.Blue
              ))) ||
          (!selections[levenNumber].localeCompare(
            constants.SpecialityLevelName.Enum.Orange
          ) &&
            (!level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Green
            ) ||
              !level.level.localeCompare(
                constants.SpecialityLevelName.Enum.Blue
              ) ||
              !level.level.localeCompare(
                constants.SpecialityLevelName.Enum.Purple
              ))) ||
          (!selections[levenNumber].localeCompare(
            constants.SpecialityLevelName.Enum.Gold
          ) &&
            (!level.level.localeCompare(
              constants.SpecialityLevelName.Enum.Green
            ) ||
              !level.level.localeCompare(
                constants.SpecialityLevelName.Enum.Blue
              ) ||
              !level.level.localeCompare(
                constants.SpecialityLevelName.Enum.Purple
              ) ||
              !level.level.localeCompare(
                constants.SpecialityLevelName.Enum.Orange
              )))
        ) {
          if (DEBUG) {
            console.log(
              `level.level: ${level.level}, selections[levenNumber]: ${selections[levenNumber]}`
            );
          }
          sum += level.buff.reduce((sum2, buff) => {
            sum2 += genericBuffEval(
              buff,
              attribute,
              debuffAttribute,
              pvm,
              reinforcing,
              troopClass
            );
            return sum2;
          }, 0);
        }
      }
      return sum;
    }, rValue);
  }
  return rValue;
};
