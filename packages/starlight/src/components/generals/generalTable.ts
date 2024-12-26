import { General } from "@schemas/generals";

import { type StoreValue } from "nanostores";

import * as stores from "./store";

const DEBUG = true;

export type TableData = {
  general: General | undefined;
  options: General | undefined;
};

export const attackMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const increment =
    data && data.general && data.general.basic_attributes.attack.increment
      ? data.general.basic_attributes.attack.increment
      : 0;

  return value + (level - 1) * increment;
};

export const defenseMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const increment =
    data && data.general && data.general.basic_attributes.defense.increment
      ? data.general.basic_attributes.defense.increment
      : 0;

  return value + (level - 1) * increment;
};

export const leadershipMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const increment =
    data && data.general && data.general.basic_attributes.leadership.increment
      ? data.general.basic_attributes.leadership.increment
      : 0;

  return value + (level - 1) * increment;
};

export const toughnessMutator = (value: number, data: TableData) => {
  const level =
    data && data.options && data.options.level ? data.options.level : 1;
  const leadership =
    data && data.general && data.general.basic_attributes
      ? data.general.basic_attributes.leadership.base
      : 1;
  const defense =
    data && data.general && data.general.basic_attributes
      ? data.general.basic_attributes.defense.base
      : 1;

  const l = leadershipMutator(leadership, data);
  const d = defenseMutator(defense, data);

  return l + d;
};
