import { scope } from "arktype";

import { BuffTypes } from "./BuffTypes";

export const SpecialitiesTypes = scope({
  SpecialityLevelName: '"None"|"Green"|"Blue"|"Purple"|"Orange"|"Gold"',

  SpecialityLevel: {
    level: "SpecialityLevelName",
    buff: BuffTypes.Buff,
  },

  Speciality: {
    name: "string",
    levels: "SpecialityLevel[]",
  },

  SpecialitySummary: {
    name: "string",
    activeLevel: "SpecialityLevelName",
    buffs: BuffTypes.Buff.array(),
  },

  SpecialitiesListing: "string[]|Speciality[]|SpecialitySummary[]",
}).export();
