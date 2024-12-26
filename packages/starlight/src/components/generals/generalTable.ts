import { General, GeneralType } from "@schemas/generals";
import * as constants from "@schemas/constants";

import { type StoreValue } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";
import type { constants } from "node:fs/promises";

const DEBUG = true;

export type TableData = {
  primary: General;
  secondary: General;
  options: General | undefined;
};

export const definePairs = () => {
  const generals = stores.generals.get();
  const pairs = new Array<TableData>();

  if (generals.length == 0) {
    return new Array<TableData>();
  } else {
    const permutations = d3.cross(generals, generals).filter((pair) => {
      return pair[0].id.localeCompare(pair[1].id);
    });
    if (DEBUG) {
      console.log(
        `identified ${permutations.length} pairs, some of which conflict.`
      );
    }
    permutations.map((pair) => {
      const td: TableData = {
        primary: pair[0],
        secondary: pair[1],
        options: {
          ascending: true,
          type: GeneralType.options,
          stars: constants.AscendingLevel.Values.red5,
          level: 1,
          id: "",
          basic_attributes: {
            leadership: {
              base: 0,
              increment: 0,
            },
            attack: {
              base: 0,
              increment: 0,
            },
            defense: {
              base: 0,
              increment: 0,
            },
            politics: {
              base: 0,
              increment: 0,
            },
          },
          book: "",
          specialities: [""],
        },
      };
      pairs.push(td);
    });
  }
  return pairs;
};

export const attackMutator = (value: number = 0, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const increment = data ? data.primary.basic_attributes.attack.increment : 0;

  return value + (level - 1) * increment;
};

export const defenseMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const increment = data ? data.primary.basic_attributes.defense.increment : 0;

  return value + (level - 1) * increment;
};

export const leadershipMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const increment = data
    ? data.primary.basic_attributes.leadership.increment
    : 0;

  return value + (level - 1) * increment;
};

export const toughnessMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const leadership = data ? data.primary.basic_attributes.leadership.base : 1;
  const defense = data ? data.primary.basic_attributes.defense.base : 1;

  const l = leadershipMutator(leadership, data);
  const d = defenseMutator(defense, data);

  return l + d;
};
