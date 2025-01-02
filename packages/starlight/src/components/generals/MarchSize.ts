import { General, GeneralType, GeneralPair } from "@schemas/generals";
import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import { MarchSize as MarchSizeBooks } from "@schemas/standardSkillBooks";

import { type StoreValue, subscribeKeys } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";
import type { SkillBook } from "@schemas/skillBooks";
import type { Speciality } from "@schemas/specialities";

const DEBUG = false;

export const MountedPvMCompatiblePairMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize for ${row.primary.id}/${row.secondary.id}`
    );
  }

  return (
    AttributeMarchSize(row) +
    BaseSkillMarchSize(row) +
    SkillBookMarchSize(row) +
    Covenant1MarchSize(row) +
    Covenant2MarchSize(row) +
    Covenant3MarchSize(row) +
    Covenant4MarchSize(row) +
    Covenant5MarchSize(row) +
    Covenant6MarchSize(row) +
    Speciality1MarchSize(row) +
    Speciality2MarchSize(row) +
    Speciality3MarchSize(row) +
    Speciality4MarchSize(row) +
    AscendingMarchSize(row) +
    SkinMarchSize(row)
  );
};

export const SkillBookMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`SkillBookMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  const conflictGroups = stores.conflictGroups.get();
  let skillbookconflict = false;
  let maxBuff = 0;
  if (conflictGroups.length > 0) {
    conflictGroups.map((cg) => {
      if (
        cg.members.includes(row.primary.id) ||
        cg.members.includes(row.secondary.id)
      ) {
        if (cg.books && cg.books.length > 0) {
          cg.books.map((book) => {
            if (
              !book.book.name.localeCompare(
                MarchSizeBooks[book.book.level - 1].name
              )
            ) {
              if (
                !book.condition.localeCompare(
                  constants.BookCondition.Enum["all the time"]
                )
              ) {
                skillbookconflict = true;
              } else {
                let v = 0;
                const b = MarchSizeBooks[book.book.level - 1].buff;
                if (Array.isArray(b)) {
                  b.map((buff) => {
                    if (
                      !buff.value.unit.localeCompare(
                        constants.Unit.Enum.percentage
                      )
                    ) {
                      if (buff.value.number > v) {
                        v = buff.value.number;
                      }
                    }
                  });
                } else {
                  if (
                    !b.value.unit.localeCompare(constants.Unit.Enum.percentage)
                  ) {
                    if (b.value.number > v) {
                      v = b.value.number;
                    }
                  }
                }
                if (v > maxBuff) {
                  maxBuff = v;
                }
              }
            }
          });
        }
      }
    });
  }
  if (!skillbookconflict) {
    return maxBuff;
  } else {
    return 0;
  }
};
const evalBaseSkill = (sb: SkillBook): number => {
  let buffValue = 0;
  if (Array.isArray(sb.buff)) {
    sb.buff.map((b) => {
      if (
        !b.attribute.localeCompare(
          constants.Attribute.Enum["March Size Capacity"]
        )
      ) {
        if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
          buffValue += b.value.number;
        }
      }
    });
  } else {
    const b = sb.buff;
    if (
      !b.attribute.localeCompare(
        constants.Attribute.Enum["March Size Capacity"]
      )
    ) {
      if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
        buffValue += b.value.number;
      }
    }
  }
  return buffValue;
};
export const BaseSkillMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`SkillBookMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  let buffValue = 0;
  const skillBooks = stores.skillBooks.get();
  if (skillBooks.length > 0 && row.primary.book.length > 0) {
    const baseSkill = skillBooks.find((b) => {
      return !b.name.localeCompare(row.primary.book);
    });
    if (baseSkill) {
      if (DEBUG) {
        console.log(`found baseSkill ${JSON.stringify(baseSkill)}`);
      }
      buffValue += evalBaseSkill(baseSkill);
    }
  }
  if (skillBooks.length > 0 && row.secondary.book.length > 0) {
    const baseSkill = skillBooks.find((b) => {
      return !b.name.localeCompare(row.secondary.book);
    });
    if (baseSkill) {
      if (DEBUG) {
        console.log(`found baseSkill ${JSON.stringify(baseSkill)}`);
      }
      buffValue += evalBaseSkill(baseSkill);
    }
  }
  return buffValue;
};

export const AttributeMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`AttributeMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const Covenant1MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`Covenant1MarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const Covenant2MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`Covenant2MarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const Covenant3MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`Covenant3MarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const Covenant4MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`Covenant4MarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const Covenant5MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`Covenant5MarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const Covenant6MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`Covenant6MarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

const SpecialityMarchSize = (
  sp: Speciality,
  level: constants.SpecialityLevelName
): number => {
  let buffValue = 0;
  sp.levels.map((l) => {
    if (
      !l.level.localeCompare(constants.SpecialityLevelName.Enum.Green) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None)
    ) {
      l.buff.map((b) => {
        if (
          !b.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
            buffValue += b.value.number;
          }
        }
      });
    }
    if (
      !l.level.localeCompare(constants.SpecialityLevelName.Enum.Blue) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Green)
    ) {
      l.buff.map((b) => {
        if (
          !b.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
            buffValue += b.value.number;
          }
        }
      });
    }
    if (
      !l.level.localeCompare(constants.SpecialityLevelName.Enum.Purple) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Green) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Blue)
    ) {
      l.buff.map((b) => {
        if (
          !b.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
            buffValue += b.value.number;
          }
        }
      });
    }
    if (
      !l.level.localeCompare(constants.SpecialityLevelName.Enum.Orange) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Green) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Blue) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Purple)
    ) {
      l.buff.map((b) => {
        if (
          !b.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
            buffValue += b.value.number;
          }
        }
      });
    }
  });
  if (DEBUG) {
    console.log(`returning ${buffValue} for speciality ${sp.name}`);
  }
  return buffValue;
};

export const Speciality1MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality1MarchSize for ${row.primary.id}/${row.secondary.id} `
    );
  }
  let returnable = 0;
  const specialities = stores.specialities.get();
  if (specialities.length > 0 && row.primary.specialities.length >= 1) {
    const sp1Name = row.primary.specialities[0];
    const sp1 = specialities.find((sp) => {
      return !sp.name.localeCompare(sp1Name);
    });
    if (sp1) {
      const sp1Level = stores.selectedValues.get().primarySpecialityLevels[0];
      if (DEBUG) {
        console.log(`level is ${sp1Level}`);
        console.log(`found Speciality ${JSON.stringify(sp1)}`);
      }

      returnable += SpecialityMarchSize(sp1, sp1Level);
    } else {
      if (DEBUG) {
        console.warn(`Speciality ${sp1Name} not found`);
      }
    }
  } else {
    if (DEBUG) {
      if (!row.primary.specialities.length) {
        console.warn(`no specialities for primary general`);
      }
      if (!specialities || !specialities.length) {
        console.warn(`no specialities to fetch from`);
      }
    }
  }
  if (specialities.length > 0 && row.secondary.specialities.length >= 1) {
    const sp1Name = row.secondary.specialities[0];
    const sp1 = specialities.find((sp) => {
      return !sp.name.localeCompare(sp1Name);
    });
    if (sp1) {
      const sp1Level = stores.selectedValues.get().secondarySpecialityLevels[0];
      if (DEBUG) {
        console.log(`level is ${sp1Level}`);
        console.log(`found Speciality ${JSON.stringify(sp1)}`);
      }

      returnable += SpecialityMarchSize(sp1, sp1Level);
    } else {
      if (DEBUG) {
        console.warn(`Speciality ${sp1Name} not found`);
      }
    }
  } else {
    if (DEBUG) {
      if (!row.primary.specialities.length) {
        console.warn(`no specialities for primary general`);
      }
      if (!specialities || !specialities.length) {
        console.warn(`no specialities to fetch from`);
      }
    }
  }

  return returnable;
};

export const Speciality2MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality2MarchSize for ${row.primary.id}/${row.secondary.id}`
    );
  }
  return 0;
};

export const Speciality3MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality3MarchSize for ${row.primary.id}/${row.secondary.id}`
    );
  }
  return 0;
};

export const Speciality4MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality4MarchSize for ${row.primary.id}/${row.secondary.id}`
    );
  }
  return 0;
};

export const AscendingMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`AscendingMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};

export const SkinMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`SkinMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};
