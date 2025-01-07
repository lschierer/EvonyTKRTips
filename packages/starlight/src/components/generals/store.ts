import { atom, batched, computed, deepMap } from "nanostores";
import * as d3 from "d3";

import { General, GeneralPair, GeneralType } from "@schemas/generals";
import { GeneralAscending } from "@schemas/ascending";
import { Speciality } from "@schemas/specialities";
import { SkillBook } from "@schemas/skillBooks";
import { ConfictGroup } from "@schemas/generalConflictGroups";

import * as constants from "@schemas/constants";

const DEBUG = false;

import { type Table } from "@tanstack/lit-table";

type SelectedValues = {
  ascending: boolean;
  basic_attributes: {
    attack: {
      base: number;
      increment: number;
    };
    defense: {
      base: number;
      increment: number;
    };
    leadership: {
      base: number;
      increment: number;
    };
    politics: {
      base: number;
      increment: number;
    };
  };
  primarySpecialityLevels: constants.SpecialityLevelName[];
  secondarySpecialityLevels: constants.SpecialityLevelName[];
  type: GeneralType;
  stars: constants.AscendingLevel;
  level: number;
};

export const selectedValues = deepMap<SelectedValues>({
  ascending: false,
  basic_attributes: {
    attack: {
      base: 0,
      increment: 0,
    },
    defense: {
      base: 0,
      increment: 0,
    },
    leadership: {
      base: 0,
      increment: 0,
    },
    politics: {
      base: 0,
      increment: 0,
    },
  },
  primarySpecialityLevels: [
    constants.SpecialityLevelName.Enum.Gold,
    constants.SpecialityLevelName.Enum.Gold,
    constants.SpecialityLevelName.Enum.Gold,
    constants.SpecialityLevelName.Enum.Green,
  ],
  secondarySpecialityLevels: [
    constants.SpecialityLevelName.Enum.Gold,
    constants.SpecialityLevelName.Enum.Gold,
    constants.SpecialityLevelName.Enum.Gold,
    constants.SpecialityLevelName.Enum.Green,
  ],
  type: GeneralType.Enum.mounted_specialist,
  stars: constants.AscendingLevel.Enum.red5,
  level: 44,
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

import * as MarchSize from "./MarchSize";

import { GeneralPairStats } from "./general";

export const pairs = batched(
  [generals, conflictGroups, selectedValues],
  (generals, conflictGroups, selectedValues) => {
    if (DEBUG) {
      console.log(`pairs computed starts with ${generals.length} generals`);
      console.log(
        `pairs computed starts with ${JSON.stringify(selectedValues)} `
      );
    }
    const p = generals
      .filter((g) => {
        if (Array.isArray(g.type)) {
          return g.type.includes(selectedValues.type);
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
        const ng: General = {
          ascending: g.ascending,
          basic_attributes: g.basic_attributes,
          book: g.book,
          display: g.display,
          id: g.id,
          note: g.note,
          specialities: g.specialities,
          specialityLevels: [
            selectedValues.primarySpecialityLevels[0],
            selectedValues.primarySpecialityLevels[1],
            selectedValues.primarySpecialityLevels[2],
            selectedValues.primarySpecialityLevels[3],
          ],
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
          return g.type.includes(selectedValues.type);
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
        const ng: General = {
          ascending: false,
          basic_attributes: g.basic_attributes,
          book: g.book,
          display: g.display,
          id: g.id,
          note: g.note,
          specialities: g.specialities,
          specialityLevels: [
            selectedValues.secondarySpecialityLevels[0],
            selectedValues.secondarySpecialityLevels[1],
            selectedValues.secondarySpecialityLevels[2],
            selectedValues.secondarySpecialityLevels[3],
          ],
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
            `conflict group ${c.name} matches based on finding ${match.id}`
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
    const step3 = step2.map((pair) => {
      const generalPairStats = new GeneralPairStats(pair);
      const td2: GeneralPair = {
        ...pair,
        MarchSizeIncrease: {
          MountedPvMCompatiblePair:
            MarchSize.MountedPvMCompatiblePairMarchSize(pair),
          baseAttribute: 0,
          attributeIncrement: 0,
          attributeTotal: MarchSize.AttributeMarchSize(pair),
          baseSkill: MarchSize.BaseSkillMarchSize(pair),
        },
        PvM: {
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
            //BaseSkill: 0,
            //SkillBooks: 0,
            Speciality1: generalPairStats.specialityStats.PvMAttack(1),
            Speciality2: generalPairStats.specialityStats.PvMAttack(2),
            Speciality3: generalPairStats.specialityStats.PvMAttack(3),
            Speciality4: generalPairStats.specialityStats.PvMAttack(4),
            Ascending: generalPairStats.ascendingStats.PvMDefense,
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
            //BaseSkill: 0,
            //SkillBooks: 0,
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
            //BaseSkill: 0,
            //SkillBooks: 10,
            Speciality1: generalPairStats.specialityStats.doubleDrop(1),
            Speciality2: generalPairStats.specialityStats.doubleDrop(2),
            Speciality3: generalPairStats.specialityStats.doubleDrop(3),
            Speciality4: generalPairStats.specialityStats.doubleDrop(4),
            Ascending: generalPairStats.ascendingStats.doubleDrop,
          },
          reduceDefense: {
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
          reduceHP: {
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
          reduceAttack: {
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
          marchSpeed: {
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
          reduceStaminaCost: {
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
        },
      };
      return td2;
    });
    if (DEBUG) {
      console.log(`step3 has ${step3.length} pairs `);
    }
    return step3;
  }
);

import {
  createTable,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  type TableOptionsResolved,
  type TableState,
} from "@tanstack/table-core";

import columns from "./columns";

export const sorting = atom<SortingState>([]);
