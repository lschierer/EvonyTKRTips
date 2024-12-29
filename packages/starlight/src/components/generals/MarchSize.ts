import { General, GeneralType, GeneralPair } from "@schemas/generals";
import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";
import { MarchSize as MarchSizeBooks } from "@schemas/standardSkillBooks";

import { type StoreValue, subscribeKeys } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";
import type { SkillBook } from "@schemas/skillBooks";

const DEBUG = true;

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
              }
              let b: constants.Value | undefined =
                MarchSizeBooks[book.book.level - 1].buff.value;
            }
          });
        }
      }
    });
  }
  if (!skillbookconflict) {
    return;
  } else {
    return 0;
  }
};

export const BaseSkillMarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(`SkillBookMarchSize for ${row.primary.id}/${row.secondary.id}`);
  }
  return 0;
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

export const Speciality1MarchSize = (row: GeneralPair) => {
  if (DEBUG) {
    console.log(
      `Speciality1MarchSize for ${row.primary.id}/${row.secondary.id}`
    );
  }
  return 0;
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
