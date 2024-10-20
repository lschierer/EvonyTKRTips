import { scope } from "arktype";

import { BuffTypes } from "./BuffTypes";

import { GeneralTypes } from "./GeneralTypes";

export const BookAndSkinTypes = scope({
  book: {
    name: "string",
    buffs: BuffTypes.Buff.array(),
  },

  standardBook: {
    name: "string",
    buffs: BuffTypes.Buff.array(),
    level: "0 < number.integer <= 4",
  },

  skin: {
    name: "string",
    for: "string", //This must match the General's name
    buffs: BuffTypes.Buff.array(),
  },
}).export();
