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
const DEBUG3 = false;

export const MountedPvMCompatiblePairMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize for ${row.primary.id}/${row.secondary.id}`
    );
  }
  let returnable = 0;

  returnable += AttributeMarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize AttributeMarchSize: ${returnable}`
    );
  }
  returnable += BaseSkillMarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize BaseSkillMarchSize: ${returnable}`
    );
  }

  returnable += SkillBookMarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize SkillBookMarchSize: ${returnable}`
    );
  }
  returnable += Speciality1MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Speciality1MarchSize: ${returnable}`
    );
  }

  returnable += Speciality2MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Speciality2MarchSize: ${returnable}`
    );
  }

  returnable += Speciality3MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Speciality3MarchSize: ${returnable}`
    );
  }

  returnable += Speciality4MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Speciality4MarchSize: ${returnable}`
    );
  }

  /*
  returnable += Covenant1MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Covenant1MarchSize: ${returnable}`
    );
  }

  returnable += Covenant2MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Covenant2MarchSize: ${returnable}`
    );
  }

  returnable += Covenant3MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Covenant3MarchSize: ${returnable}`
    );
  }

  returnable += Covenant4MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Covenant4MarchSize: ${returnable}`
    );
  }

  returnable += Covenant5MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Covenant5MarchSize: ${returnable}`
    );
  }

  returnable += Covenant6MarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize Covenant6MarchSize: ${returnable}`
    );
  }
  */

  returnable += AscendingMarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize AscendingMarchSize: ${returnable}`
    );
  }

  /*
  returnable += SkinMarchSize(row);
  if (DEBUG) {
    console.log(
      `MountedPvMCompatiblePairMarchSize SkinMarchSize: ${returnable}`
    );
  }
*/
  return returnable;
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
      b.attribute &&
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
  if (DEBUG) {
    console.log(
      `BaseSkillMarchSize for ${row.primary.id}/${row.secondary.id} is ${buffValue}`
    );
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
  special: Speciality,
  level: constants.SpecialityLevelName
): number => {
  let buffValue = 0;
  if (!level.localeCompare(constants.SpecialityLevelName.Enum.None)) {
    if (DEBUG) {
      console.log(`level is none, return immediately`);
    }
    return buffValue;
  }
  special.levels.map((sl) => {
    if (
      !sl.level.localeCompare(constants.SpecialityLevelName.Enum.Green) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None)
    ) {
      sl.buff.map((b) => {
        if (
          !b.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          if (DEBUG) {
            console.log(`matched a green march size buff for ${special.name}`);
          }
          if (!b.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
            buffValue += b.value.number;
          }
        } else {
          if (DEBUG) {
            console.log(
              `${special.name} green ${special.levels
                .map((l) => {
                  return l.buff
                    .map((b) => {
                      return b.attribute;
                    })
                    .join(" ");
                })
                .join(" ")}`
            );
          }
        }
      });
    }
    if (
      !sl.level.localeCompare(constants.SpecialityLevelName.Enum.Blue) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Green)
    ) {
      sl.buff.map((b) => {
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
      !sl.level.localeCompare(constants.SpecialityLevelName.Enum.Purple) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Green) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Blue)
    ) {
      sl.buff.map((b) => {
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
      !sl.level.localeCompare(constants.SpecialityLevelName.Enum.Orange) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.None) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Green) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Blue) &&
      level.localeCompare(constants.SpecialityLevelName.Enum.Purple)
    ) {
      sl.buff.map((b) => {
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
    console.log(`returning ${buffValue} for speciality ${special.name}`);
  }
  return buffValue;
};

const evalSpeciality = (row: GeneralPair, index: number) => {
  if (DEBUG) {
    console.log(`evalSpeciality for ${row.primary.id}/${row.secondary.id} `);
  }
  let returnable = 0;
  const specialities = stores.specialities.get();
  const sizeNeeded = index + 1;
  if (specialities.length > 0) {
    let sp = null;
    const spLevel = stores.selectedValues.get().primarySpecialityLevels[index];

    if (row.primary.specialities.length >= sizeNeeded) {
      const spName = row.primary.specialities[index];
      sp = specialities.find((s) => {
        return !s.name.localeCompare(spName);
      });
    }
    if (
      sp &&
      spLevel &&
      spLevel.localeCompare(constants.SpecialityLevelName.Enum.None)
    ) {
      returnable += SpecialityMarchSize(sp, spLevel);
      if (DEBUG) {
        console.log(
          `evalSpeciality returnable is ${returnable} after primary ${row.primary.id} ${sp.name}`
        );
      }
    } else {
      if (DEBUG) {
        if (!sp) {
          console.warn(`sp is false: '${JSON.stringify(sp)}'`);
        }
        if (!spLevel) {
          console.warn(`spLevel is false: '${JSON.stringify(spLevel)}'`);
        }
      }
    }

    let ss = null;
    const ssLevel =
      stores.selectedValues.get().secondarySpecialityLevels[index];

    if (row.secondary.specialities.length >= sizeNeeded) {
      const ssName = row.secondary.specialities[index];
      ss = specialities.find((s) => {
        return !s.name.localeCompare(ssName);
      });
    }
    if (
      ss &&
      ssLevel &&
      ssLevel.localeCompare(constants.SpecialityLevelName.Enum.None)
    ) {
      returnable += SpecialityMarchSize(ss, ssLevel);
      if (DEBUG) {
        console.log(
          `evalSpeciality returnable is ${returnable} after secondary`
        );
      }
    } else {
      if (DEBUG) {
        if (!ss) {
          console.warn(`ss is false: '${JSON.stringify(ss)}'`);
        }
        if (!ssLevel) {
          console.warn(`ssLevel is false: '${JSON.stringify(ssLevel)}'`);
        }
      }
    }
  }

  return returnable;
};

export const Speciality1MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality1MarchSize for ${row.primary.id}/${row.secondary.id} `
    );
  }
  let returnable = 0;
  returnable += evalSpeciality(row, 0);
  return returnable;
};

export const Speciality2MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality1MarchSize for ${row.primary.id}/${row.secondary.id} `
    );
  }
  let returnable = 0;
  returnable += evalSpeciality(row, 1);
  return returnable;
};

export const Speciality3MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality1MarchSize for ${row.primary.id}/${row.secondary.id} `
    );
  }
  let returnable = 0;
  returnable += evalSpeciality(row, 2);
  return returnable;
};

export const Speciality4MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality1MarchSize for ${row.primary.id}/${row.secondary.id} `
    );
  }
  let returnable = 0;
  returnable += evalSpeciality(row, 3);
  return returnable;
};

const evalAscendingLevels = (
  row: GeneralPair,
  als: AscendingLevel[],
  stars: constants.AscendingLevel
) => {
  let returnable = 0;
  returnable += als.reduce((a, c) => {
    if (!c.level.localeCompare(constants.AscendingLevel.Enum.None)) {
      a += 0;
    } else if (!stars.localeCompare(c.level)) {
      const r2 = c.buff.reduce((a2, c2) => {
        if (
          !c2.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          a2 += c2.value.number;
        }
        return a2;
      }, 0);
      a += r2;
      if (DEBUG3) {
        console.log(`r2 is ${r2}`);
      }
    } else if (
      (!stars.localeCompare(constants.AscendingLevel.Enum.red1) &&
        !c.level.localeCompare(constants.AscendingLevel.Enum.red1)) ||
      (!stars.localeCompare(constants.AscendingLevel.Enum.red2) &&
        (!c.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red2))) ||
      (!stars.localeCompare(constants.AscendingLevel.Enum.red3) &&
        (!c.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red3))) ||
      (!stars.localeCompare(constants.AscendingLevel.Enum.red4) &&
        (!c.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red3) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red4))) ||
      (!stars.localeCompare(constants.AscendingLevel.Enum.red5) &&
        (!c.level.localeCompare(constants.AscendingLevel.Enum.red1) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red2) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red3) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red4) ||
          !c.level.localeCompare(constants.AscendingLevel.Enum.red5)))
    ) {
      const r2 = c.buff.reduce((a2, c2) => {
        if (
          !c2.attribute.localeCompare(
            constants.Attribute.Enum["March Size Capacity"]
          )
        ) {
          a2 += c2.value.number;
        }
        return a2;
      }, 0);
      if (DEBUG3) {
        console.log(`c.level is ${c.level}`);
        console.log(`stars are ${stars}`);
        console.log(`r2 is ${r2}`);
      }
      a += r2;
    }
    return a;
  }, 0);
  if (DEBUG3) {
    console.log(`returning ${returnable} for ${row.primary.id}`);
  }
  return returnable;
};

export const AscendingMarchSize = (row: GeneralPair) => {
  if (DEBUG3) {
    console.log(`AscendingMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  let returnable = 0;
  if (row.primary.stars.localeCompare(constants.AscendingLevel.Enum.None)) {
    const stars = row.primary.stars;
    if (stores.ascendingAttributes.get().length > 0) {
      const allAttributes = stores.ascendingAttributes.get();
      if (DEBUG3) {
        console.log(JSON.stringify(allAttributes[0]));
      }
      if (allAttributes) {
        if (DEBUG3) {
          console.log(
            `AscendingMarchSize has ${allAttributes.length} attributes`
          );
        }
        const ascendingAttributes = allAttributes.find((aa) => {
          return !row.primary.id.localeCompare(aa.id);
        });
        if (ascendingAttributes) {
          returnable += evalAscendingLevels(
            row,
            ascendingAttributes.ascending,
            stars
          );
        } else {
          if (DEBUG3) {
            console.warn(`cannot find attribute for ${row.primary.id}`);
          }
        }
      }
    } else {
      if (DEBUG3) {
        console.warn(`missing ascending attributes`);
      }
    }
  }
  return returnable;
};

export const SkinMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`SkinMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
};
