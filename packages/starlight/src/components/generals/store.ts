import { atom, batched, computed, map, deepMap } from "nanostores";
import * as d3 from "d3";
import { z } from "zod";

import { General, GeneralPair } from "@schemas/generals";
import { GeneralAscending } from "@schemas/ascending";
import { Speciality } from "@schemas/specialities";
import { SkillBook } from "@schemas/skillBooks";
import { ConfictGroup } from "@schemas/generalConflictGroups";

import * as constants from "@schemas/constants";

import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type TableOptionsResolved,
  type TableState,
} from "@tanstack/table-core";

import rallySpotBaseMarch from "@lib/rallySpot";

import { EvAnsAttack, EvAnsDefense, EvAnsHP } from "./generics/EvAnsScore";

const DEBUG = false;
const DEBUG2 = false;

import { type Table } from "@tanstack/lit-table";

type SelectedValues = {
  ascending: boolean;
  stars: constants.AscendingLevel;
  level: number;
  dragon: boolean;
  beast: boolean;
};

export const selectedValues = deepMap<SelectedValues>({
  ascending: false,
  stars: constants.AscendingLevel.Enum.red5,
  level: 44,
  dragon: true,
  beast: true,
});

export const generalSpecalist = atom<constants.GeneralType>(
  constants.GeneralType.Enum.mounted_specialist
);

export const generalUseCase = atom<constants.BuffActivation>(
  constants.BuffActivation.Enum.Overall
);

export const primarySpecialityLevels = atom<constants.SpecialityLevelName[]>([
  constants.SpecialityLevelName.Enum.Gold,
  constants.SpecialityLevelName.Enum.Gold,
  constants.SpecialityLevelName.Enum.Gold,
  constants.SpecialityLevelName.Enum.Gold,
]);

export const setPrimaryLevel = (
  n: constants.SpecialityLevelName,
  index: number
) => {
  const s = [...primarySpecialityLevels.get()];
  s[index] = n;
  primarySpecialityLevels.set(s);
};

primarySpecialityLevels.listen((v, o) => {
  if (DEBUG2) {
    console.log(
      `primarySpecialityLevels debug listener sees values ${v.join(" ")}`
    );
  }
});

export const secondarySpecialityLevels = atom<constants.SpecialityLevelName[]>([
  constants.SpecialityLevelName.Enum.Gold,
  constants.SpecialityLevelName.Enum.Gold,
  constants.SpecialityLevelName.Enum.Gold,
  constants.SpecialityLevelName.Enum.Gold,
]);

export const setSecondaryLevel = (
  n: constants.SpecialityLevelName,
  index: number
) => {
  const s = [...secondarySpecialityLevels.get()];
  s[index] = n;
  secondarySpecialityLevels.set(s);
};

secondarySpecialityLevels.listen((v, o) => {
  if (DEBUG2) {
    console.log(
      `secondarySpecialityLevels debug listener sees values ${v.join(" ")}`
    );
  }
});

export const generals = atom<General[]>(new Array<General>());

export const ascendingAttributes = atom<GeneralAscending[]>(
  new Array<GeneralAscending>()
);

export const specialities = atom<Speciality[]>(new Array<Speciality>());

export const skillBooks = atom<SkillBook[]>(new Array<SkillBook>());

export const conflictGroups = atom<ConfictGroup[]>(new Array<ConfictGroup>());

generals.listen((value, oldValue) => {
  if (DEBUG) {
    console.log(
      `generals, oldValue was "${JSON.stringify(oldValue)}", value is "${JSON.stringify(value)}"`
    );
  }
});

import { GeneralPairStats } from "./general";

const initialPairs = batched(
  [
    generals,
    conflictGroups,
    selectedValues,
    generalSpecalist,
    primarySpecialityLevels,
    secondarySpecialityLevels,
  ],
  (
    generals,
    conflictGroups,
    selectedValues,
    generalSpecalist,
    primarySpecialityLevels,
    secondarySpecialityLevels
  ) => {
    if (DEBUG) {
      console.log(
        `initialPairs computed starts with ${generals.length} generals`
      );
      console.log(
        `initialPairs computed starts with ${JSON.stringify(selectedValues)} `,
        `primary specialities start at ${JSON.stringify(primarySpecialityLevels)}`
      );
    }
    const p = generals
      .filter((g) => {
        if (Array.isArray(g.type)) {
          return g.type.includes(generalSpecalist);
        } else {
          return false;
        }
      })
      .map((g) => {
        const l =
          selectedValues.level != undefined
            ? selectedValues.level > 0
              ? selectedValues.level
              : 1
            : 1;
        if (DEBUG) {
          console.log(`detected l ${l}`);
        }
        const ps = primarySpecialityLevels;
        const ng: General = {
          ascending: g.ascending,
          basic_attributes: g.basic_attributes,
          book: g.book,
          display: g.display,
          id: g.id,
          note: g.note,
          specialities: g.specialities,
          specialityLevels: ps,
          stars: selectedValues.stars,
          type: g.type,
          extra: g.extra,
          warnings: g.warnings,
          level: l,
        };

        return ng;
      });

    if (DEBUG) {
      console.log(`I found ${p.length} primaries`);
    }

    const s = generals
      .filter((g) => {
        if (Array.isArray(g.type)) {
          return g.type.includes(generalSpecalist);
        } else {
          return false;
        }
        return false;
      })
      .map((g) => {
        const l =
          selectedValues.level != undefined
            ? selectedValues.level > 0
              ? selectedValues.level
              : 1
            : 1;
        const ss = secondarySpecialityLevels;
        const ng: General = {
          ascending: false,
          basic_attributes: g.basic_attributes,
          book: g.book,
          display: g.display,
          id: g.id,
          note: g.note,
          specialities: g.specialities,
          specialityLevels: ss,
          stars: constants.AscendingLevel.Enum.None,
          type: g.type,
          extra: g.extra,
          warnings: g.warnings,
          level: l,
        };
        return ng;
      });

    const permutations = d3.cross(p, s).filter((p) => {
      return p[0].id.localeCompare(p[1].id);
    });
    if (DEBUG) {
      console.log(`after first filter I have ${permutations.length} pairs`);
    }

    const cg = conflictGroups.filter((c) => {
      const match = p.find((g) => {
        return c.members.includes(g.id);
      });

      if (match) {
        if (DEBUG) {
          console.log(
            `conflict group ${c.name} matches based on finding ${match.id} conflict`
          );
        }
        return true;
      }
      return false;
    });

    const step2 = permutations
      .map((p) => {
        const td: GeneralPair = {
          primary: p[0],
          secondary: p[1],
        };

        return td;
      })
      .filter((p) => {
        const conflicting = new Set<string>();
        const cgs = conflictGroups.filter((cg) => {
          return cg.members.includes(p.primary.id);
        });
        cgs.map((cg) => {
          cg.members.forEach((m) => {
            conflicting.add(m);
          });
          cg.others?.forEach((o) => {
            const cg2 = conflictGroups.find((c2) => {
              return !c2.name.localeCompare(o);
            });
            if (cg2) {
              cg2.members.forEach((m) => {
                conflicting.add(m);
              });
            }
          });
        });
        if (conflicting.has(p.secondary.id)) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const ap = a.primary.id;
        const as = a.secondary.id;
        const bp = b.primary.id;
        const bs = b.secondary.id;
        if (!ap.localeCompare(bp)) {
          return as.localeCompare(bs);
        } else {
          return ap.localeCompare(bp);
        }
      });

    if (DEBUG) {
      console.log(`step2 has ${step2.length} pairs `);
    }
    return step2;
  }
);

export const PvMPairsWithStats = batched(
  [
    initialPairs,
    selectedValues,
    primarySpecialityLevels,
    secondarySpecialityLevels,
    ascendingAttributes,
    skillBooks,
  ],
  (
    pairs,
    selectedValues,
    primarySpecialityLevels,
    secondarySpecialityLevels,
    ascendingAttributes,
    skillBooks
  ) => {
    const step3 = pairs.map((pair) => {
      const generalPairStats = new GeneralPairStats(pair);
      const td2: GeneralPair = {
        ...pair,
        MarchSizeIncrease: {
          total:
            generalPairStats.baseSkill.MarchSizeIncrease +
            generalPairStats.standardSkillBooks.MarchSizeIncrease +
            generalPairStats.specialityStats.MarchSizeIncrease(1) +
            generalPairStats.specialityStats.MarchSizeIncrease(2) +
            generalPairStats.specialityStats.MarchSizeIncrease(3) +
            generalPairStats.specialityStats.MarchSizeIncrease(4) +
            generalPairStats.ascendingStats.MarchSizeIncrease +
            0,
          baseAttribute: 0,
          attributeIncrement: 0,
          totalAttribute: 0,
          baseSkill: generalPairStats.baseSkill.MarchSizeIncrease,
          SkillBooks: generalPairStats.standardSkillBooks.MarchSizeIncrease,
          Speciality1: generalPairStats.specialityStats.MarchSizeIncrease(1),
          Speciality2: generalPairStats.specialityStats.MarchSizeIncrease(2),
          Speciality3: generalPairStats.specialityStats.MarchSizeIncrease(3),
          Speciality4: generalPairStats.specialityStats.MarchSizeIncrease(4),
          Ascending: generalPairStats.ascendingStats.MarchSizeIncrease,
        },
        BuffSet: {
          attack: {
            total:
              +(generalPairStats.baseAttribute.attack_total * 100)
                .toFixed(3)
                .replace(/(\d)0+$/, "$1") +
              generalPairStats.baseSkill.PvMAttack +
              generalPairStats.standardSkillBooks.PvMAttack +
              generalPairStats.specialityStats.PvMAttack(1) +
              generalPairStats.specialityStats.PvMAttack(2) +
              generalPairStats.specialityStats.PvMAttack(3) +
              generalPairStats.specialityStats.PvMAttack(4) +
              generalPairStats.ascendingStats.PvMAttack +
              0,
            baseAttribute: generalPairStats.baseAttribute.attack_base,
            levelAttribute: generalPairStats.baseAttribute.attack_increment,
            totalAttribute: generalPairStats.baseAttribute.attack_total,
            BaseSkill: generalPairStats.baseSkill.PvMAttack,
            SkillBooks: generalPairStats.standardSkillBooks.PvMAttack,
            Speciality1: generalPairStats.specialityStats.PvMAttack(1),
            Speciality2: generalPairStats.specialityStats.PvMAttack(2),
            Speciality3: generalPairStats.specialityStats.PvMAttack(3),
            Speciality4: generalPairStats.specialityStats.PvMAttack(4),
            Ascending: generalPairStats.ascendingStats.PvMAttack,
          },
          defense: {
            total:
              +(generalPairStats.baseAttribute.defense_total * 100)
                .toFixed(3)
                .replace(/(\d)0+$/, "$1") +
              generalPairStats.baseSkill.PvMDefense +
              generalPairStats.standardSkillBooks.PvMDefense +
              generalPairStats.specialityStats.PvMDefense(1) +
              generalPairStats.specialityStats.PvMDefense(2) +
              generalPairStats.specialityStats.PvMDefense(3) +
              generalPairStats.specialityStats.PvMDefense(4) +
              generalPairStats.ascendingStats.PvMDefense +
              0,
            baseAttribute: generalPairStats.baseAttribute.defense_base,
            levelAttribute: generalPairStats.baseAttribute.defense_increment,
            totalAttribute: generalPairStats.baseAttribute.defense_total,
            BaseSkill: generalPairStats.baseSkill.PvMDefense,
            SkillBooks: generalPairStats.standardSkillBooks.PvMDefense,
            //BaseSkill: 0,
            //SkillBooks: 0,
            Speciality1: generalPairStats.specialityStats.PvMDefense(1),
            Speciality2: generalPairStats.specialityStats.PvMDefense(2),
            Speciality3: generalPairStats.specialityStats.PvMDefense(3),
            Speciality4: generalPairStats.specialityStats.PvMDefense(4),
            Ascending: generalPairStats.ascendingStats.PvMDefense,
          },
          hp: {
            total:
              +(generalPairStats.baseAttribute.leadership_total * 100)
                .toFixed(3)
                .replace(/(\d)0+$/, "$1") +
              generalPairStats.baseSkill.PvMHP +
              generalPairStats.standardSkillBooks.PvMHP +
              generalPairStats.specialityStats.PvMHP(1) +
              generalPairStats.specialityStats.PvMHP(2) +
              generalPairStats.specialityStats.PvMHP(3) +
              generalPairStats.specialityStats.PvMHP(4) +
              generalPairStats.ascendingStats.PvMHP +
              0,
            baseAttribute: generalPairStats.baseAttribute.leadership_base,
            levelAttribute: generalPairStats.baseAttribute.leadership_increment,
            totalAttribute: generalPairStats.baseAttribute.leadership_total,
            BaseSkill: generalPairStats.baseSkill.PvMHP,
            SkillBooks: generalPairStats.standardSkillBooks.PvMHP,
            Speciality1: generalPairStats.specialityStats.PvMHP(1),
            Speciality2: generalPairStats.specialityStats.PvMHP(2),
            Speciality3: generalPairStats.specialityStats.PvMHP(3),
            Speciality4: generalPairStats.specialityStats.PvMHP(4),
            Ascending: generalPairStats.ascendingStats.PvMHP,
          },
          doubleDrop: {
            total:
              generalPairStats.baseSkill.doubleDrop +
              generalPairStats.standardSkillBooks.doubleDrop +
              generalPairStats.specialityStats.doubleDrop(1) +
              generalPairStats.specialityStats.doubleDrop(2) +
              generalPairStats.specialityStats.doubleDrop(3) +
              generalPairStats.specialityStats.doubleDrop(4) +
              generalPairStats.ascendingStats.doubleDrop +
              0,
            BaseSkill: generalPairStats.baseSkill.doubleDrop,
            SkillBooks: generalPairStats.standardSkillBooks.doubleDrop,
            Speciality1: generalPairStats.specialityStats.doubleDrop(1),
            Speciality2: generalPairStats.specialityStats.doubleDrop(2),
            Speciality3: generalPairStats.specialityStats.doubleDrop(3),
            Speciality4: generalPairStats.specialityStats.doubleDrop(4),
            Ascending: generalPairStats.ascendingStats.doubleDrop,
          },
          reduceDefense: {
            total:
              generalPairStats.baseSkill.PvMreduceDefense +
              generalPairStats.standardSkillBooks.PvMreduceDefense +
              generalPairStats.specialityStats.PvMreduceDefense(1) +
              generalPairStats.specialityStats.PvMreduceDefense(2) +
              generalPairStats.specialityStats.PvMreduceDefense(3) +
              generalPairStats.specialityStats.PvMreduceDefense(4) +
              generalPairStats.ascendingStats.PvMreduceDefense +
              0,
            BaseSkill: generalPairStats.baseSkill.PvMreduceDefense,
            SkillBooks: generalPairStats.standardSkillBooks.PvMreduceDefense,
            Speciality1: generalPairStats.specialityStats.PvMreduceDefense(1),
            Speciality2: generalPairStats.specialityStats.PvMreduceDefense(2),
            Speciality3: generalPairStats.specialityStats.PvMreduceDefense(3),
            Speciality4: generalPairStats.specialityStats.PvMreduceDefense(4),
            Ascending: generalPairStats.ascendingStats.PvMreduceDefense,
          },
          reduceHP: {
            total:
              generalPairStats.baseSkill.PvMreduceHP +
              generalPairStats.standardSkillBooks.PvMreduceHP +
              generalPairStats.specialityStats.PvMreduceHP(1) +
              generalPairStats.specialityStats.PvMreduceHP(2) +
              generalPairStats.specialityStats.PvMreduceHP(3) +
              generalPairStats.specialityStats.PvMreduceHP(4) +
              generalPairStats.ascendingStats.PvMreduceHP +
              0,
            BaseSkill: generalPairStats.baseSkill.PvMreduceHP,
            SkillBooks: generalPairStats.standardSkillBooks.PvMreduceHP,
            Speciality1: generalPairStats.specialityStats.PvMreduceHP(1),
            Speciality2: generalPairStats.specialityStats.PvMreduceHP(2),
            Speciality3: generalPairStats.specialityStats.PvMreduceHP(3),
            Speciality4: generalPairStats.specialityStats.PvMreduceHP(4),
            Ascending: generalPairStats.ascendingStats.PvMreduceHP,
          },
          reduceAttack: {
            total:
              generalPairStats.baseSkill.PvMreduceAttack +
              generalPairStats.standardSkillBooks.PvMreduceAttack +
              generalPairStats.specialityStats.PvMreduceAttack(1) +
              generalPairStats.specialityStats.PvMreduceAttack(2) +
              generalPairStats.specialityStats.PvMreduceAttack(3) +
              generalPairStats.specialityStats.PvMreduceAttack(4) +
              generalPairStats.ascendingStats.PvMreduceAttack +
              0,
            BaseSkill: generalPairStats.baseSkill.PvMreduceAttack,
            SkillBooks: generalPairStats.standardSkillBooks.PvMreduceAttack,
            Speciality1: generalPairStats.specialityStats.PvMreduceAttack(1),
            Speciality2: generalPairStats.specialityStats.PvMreduceAttack(2),
            Speciality3: generalPairStats.specialityStats.PvMreduceAttack(3),
            Speciality4: generalPairStats.specialityStats.PvMreduceAttack(4),
            Ascending: generalPairStats.ascendingStats.PvMreduceAttack,
          },
          marchSpeed: {
            total:
              generalPairStats.baseSkill.PvMmarchSpeed +
              generalPairStats.standardSkillBooks.PvMmarchSpeed +
              generalPairStats.specialityStats.PvMmarchSpeed(1) +
              generalPairStats.specialityStats.PvMmarchSpeed(2) +
              generalPairStats.specialityStats.PvMmarchSpeed(3) +
              generalPairStats.specialityStats.PvMmarchSpeed(4) +
              generalPairStats.ascendingStats.PvMmarchSpeed +
              0,
            BaseSkill: generalPairStats.baseSkill.PvMmarchSpeed,
            SkillBooks: generalPairStats.standardSkillBooks.PvMmarchSpeed,
            Speciality1: generalPairStats.specialityStats.PvMmarchSpeed(1),
            Speciality2: generalPairStats.specialityStats.PvMmarchSpeed(2),
            Speciality3: generalPairStats.specialityStats.PvMmarchSpeed(3),
            Speciality4: generalPairStats.specialityStats.PvMmarchSpeed(4),
            Ascending: generalPairStats.ascendingStats.PvMmarchSpeed,
          },
          reduceStaminaCost: {
            total:
              generalPairStats.baseSkill.PvMreduceStaminaCost +
              generalPairStats.standardSkillBooks.PvMreduceStaminaCost +
              generalPairStats.specialityStats.PvMreduceStaminaCost(1) +
              generalPairStats.specialityStats.PvMreduceStaminaCost(2) +
              generalPairStats.specialityStats.PvMreduceStaminaCost(3) +
              generalPairStats.specialityStats.PvMreduceStaminaCost(4) +
              generalPairStats.ascendingStats.PvMreduceStaminaCost +
              0,
            BaseSkill: generalPairStats.baseSkill.PvMreduceStaminaCost,
            SkillBooks:
              generalPairStats.standardSkillBooks.PvMreduceStaminaCost,
            Speciality1:
              generalPairStats.specialityStats.PvMreduceStaminaCost(1),
            Speciality2:
              generalPairStats.specialityStats.PvMreduceStaminaCost(2),
            Speciality3:
              generalPairStats.specialityStats.PvMreduceStaminaCost(3),
            Speciality4:
              generalPairStats.specialityStats.PvMreduceStaminaCost(4),
            Ascending: generalPairStats.ascendingStats.PvMreduceStaminaCost,
          },
        },
      };
      return td2;
    });
    if (DEBUG) {
      console.log(`step3 has ${step3.length} pairs `);
    }

    const step4 = step3.map((p) => {
      const td3: GeneralPair = {
        ...p,
        ScoreSet: {
          attack: EvAnsAttack(p),
          defense: EvAnsDefense(p),
          hp: EvAnsHP(p),
        },
      };
      return td3;
    });
    if (DEBUG) {
      console.log(`pairs batched store returning step4 from PvM`);
      console.log(
        `EvAnsAttack for first pair ${step4[0].primary.id}/${step4[0].secondary.id}is ${step4[0].ScoreSet?.attack}`
      );
    }
    return step4;
  }
);

export const AttackingPairsWithStats = batched([initialPairs], (pairs) => {
  const step3 = pairs.map((pair) => {
    const generalPairStats = new GeneralPairStats(pair);
    const td2: GeneralPair = {
      ...pair,
      MarchSizeIncrease: {
        total:
          generalPairStats.baseSkill.MarchSizeIncrease +
          generalPairStats.standardSkillBooks.MarchSizeIncrease +
          generalPairStats.specialityStats.MarchSizeIncrease(1) +
          generalPairStats.specialityStats.MarchSizeIncrease(2) +
          generalPairStats.specialityStats.MarchSizeIncrease(3) +
          generalPairStats.specialityStats.MarchSizeIncrease(4) +
          generalPairStats.ascendingStats.MarchSizeIncrease +
          0,
        baseAttribute: 0,
        attributeIncrement: 0,
        totalAttribute: 0,
        baseSkill: generalPairStats.baseSkill.MarchSizeIncrease,
        SkillBooks: generalPairStats.standardSkillBooks.MarchSizeIncrease,
        Speciality1: generalPairStats.specialityStats.MarchSizeIncrease(1),
        Speciality2: generalPairStats.specialityStats.MarchSizeIncrease(2),
        Speciality3: generalPairStats.specialityStats.MarchSizeIncrease(3),
        Speciality4: generalPairStats.specialityStats.MarchSizeIncrease(4),
        Ascending: generalPairStats.ascendingStats.MarchSizeIncrease,
      },
      BuffSet: {
        attack: {
          total:
            +(generalPairStats.baseAttribute.attack_total * 100)
              .toFixed(3)
              .replace(/(\d)0+$/, "$1") +
            generalPairStats.baseSkill.Attack +
            generalPairStats.standardSkillBooks.PvMAttack +
            generalPairStats.specialityStats.PvMAttack(1) +
            generalPairStats.specialityStats.PvMAttack(2) +
            generalPairStats.specialityStats.PvMAttack(3) +
            generalPairStats.specialityStats.PvMAttack(4) +
            generalPairStats.ascendingStats.PvMAttack +
            0,
          baseAttribute: generalPairStats.baseAttribute.attack_base,
          levelAttribute: generalPairStats.baseAttribute.attack_increment,
          totalAttribute: generalPairStats.baseAttribute.attack_total,
          BaseSkill: generalPairStats.baseSkill.PvMAttack,
          SkillBooks: generalPairStats.standardSkillBooks.PvMAttack,
          //BaseSkill: 0,
          //SkillBooks: 0,
          Speciality1: generalPairStats.specialityStats.PvMAttack(1),
          Speciality2: generalPairStats.specialityStats.PvMAttack(2),
          Speciality3: generalPairStats.specialityStats.PvMAttack(3),
          Speciality4: generalPairStats.specialityStats.PvMAttack(4),
          Ascending: generalPairStats.ascendingStats.PvMAttack,
        },
        defense: {
          total:
            +(generalPairStats.baseAttribute.defense_total * 100)
              .toFixed(3)
              .replace(/(\d)0+$/, "$1") +
            generalPairStats.baseSkill.PvMDefense +
            generalPairStats.standardSkillBooks.PvMDefense +
            generalPairStats.specialityStats.PvMDefense(1) +
            generalPairStats.specialityStats.PvMDefense(2) +
            generalPairStats.specialityStats.PvMDefense(3) +
            generalPairStats.specialityStats.PvMDefense(4) +
            generalPairStats.ascendingStats.PvMDefense +
            0,
          baseAttribute: generalPairStats.baseAttribute.defense_base,
          levelAttribute: generalPairStats.baseAttribute.defense_increment,
          totalAttribute: generalPairStats.baseAttribute.defense_total,
          BaseSkill: generalPairStats.baseSkill.PvMDefense,
          SkillBooks: generalPairStats.standardSkillBooks.PvMDefense,
          //BaseSkill: 0,
          //SkillBooks: 0,
          Speciality1: generalPairStats.specialityStats.PvMDefense(1),
          Speciality2: generalPairStats.specialityStats.PvMDefense(2),
          Speciality3: generalPairStats.specialityStats.PvMDefense(3),
          Speciality4: generalPairStats.specialityStats.PvMDefense(4),
          Ascending: generalPairStats.ascendingStats.PvMDefense,
        },
        hp: {
          total:
            +(generalPairStats.baseAttribute.leadership_total * 100)
              .toFixed(3)
              .replace(/(\d)0+$/, "$1") +
            generalPairStats.baseSkill.PvMHP +
            generalPairStats.standardSkillBooks.PvMHP +
            generalPairStats.specialityStats.PvMHP(1) +
            generalPairStats.specialityStats.PvMHP(2) +
            generalPairStats.specialityStats.PvMHP(3) +
            generalPairStats.specialityStats.PvMHP(4) +
            generalPairStats.ascendingStats.PvMHP +
            0,
          baseAttribute: generalPairStats.baseAttribute.leadership_base,
          levelAttribute: generalPairStats.baseAttribute.leadership_increment,
          totalAttribute: generalPairStats.baseAttribute.leadership_total,
          BaseSkill: generalPairStats.baseSkill.PvMHP,
          SkillBooks: generalPairStats.standardSkillBooks.PvMHP,
          Speciality1: generalPairStats.specialityStats.PvMHP(1),
          Speciality2: generalPairStats.specialityStats.PvMHP(2),
          Speciality3: generalPairStats.specialityStats.PvMHP(3),
          Speciality4: generalPairStats.specialityStats.PvMHP(4),
          Ascending: generalPairStats.ascendingStats.PvMHP,
        },

        marchSpeed: {
          total:
            generalPairStats.baseSkill.marchSpeed +
            generalPairStats.standardSkillBooks.marchSpeed +
            generalPairStats.specialityStats.marchSpeed(1) +
            generalPairStats.specialityStats.marchSpeed(2) +
            generalPairStats.specialityStats.marchSpeed(3) +
            generalPairStats.specialityStats.marchSpeed(4) +
            generalPairStats.ascendingStats.marchSpeed +
            0,
          BaseSkill: generalPairStats.baseSkill.marchSpeed,
          SkillBooks: generalPairStats.standardSkillBooks.marchSpeed,
          Speciality1: generalPairStats.specialityStats.marchSpeed(1),
          Speciality2: generalPairStats.specialityStats.marchSpeed(2),
          Speciality3: generalPairStats.specialityStats.marchSpeed(3),
          Speciality4: generalPairStats.specialityStats.marchSpeed(4),
          Ascending: generalPairStats.ascendingStats.marchSpeed,
        },
      },
    };
    return td2;
  });
  if (DEBUG) {
    console.log(`step3 has ${step3.length} pairs `);
  }

  const step4 = step3.map((p) => {
    const td3: GeneralPair = {
      ...p,
      ScoreSet: {
        attack: EvAnsAttack(p),
        defense: EvAnsDefense(p),
        hp: EvAnsHP(p),
      },
    };
    return td3;
  });
  if (DEBUG) {
    console.log(`pairs batched store returning step4 from Attacking`);
    console.log(
      `EvAnsAttack for first pair ${step4[0].primary.id}/${step4[0].secondary.id}is ${step4[0].ScoreSet?.attack}`
    );
  }
  return step4;
});

export const pairs = batched(
  [PvMPairsWithStats, AttackingPairsWithStats, generalUseCase],

  (pvmPairs, attackingPairs, generalUseCase) => {
    if (DEBUG) {
      console.log(`pairs batch run, generalUseCase is ${generalUseCase}`);
    }
    if (!generalUseCase.localeCompare(constants.BuffActivation.Enum.PvM)) {
      return pvmPairs;
    } else if (
      !generalUseCase.localeCompare(constants.BuffActivation.Enum.Attacking)
    ) {
      if (DEBUG) {
        console.log(`pairs batched store returning attackingPairs`);
      }
      return attackingPairs;
    } else {
      return new Array<GeneralPair>();
    }
  }
);

export const sorting = atom<SortingState>([]);
