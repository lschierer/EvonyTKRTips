import { scope } from "arktype";

import { BuffTypes } from "./BuffTypes";

export const AscendingTypes = scope({
  AscendingLevelName:
    "'None'|'1Purple'|'2Purple'|'3Purple'|'4Purple'|'5Purple'|'1Red'|'2Red'|'3Red'|'4Red'|'5Red'",

  AscendingLevel: {
    level: "AscendingLevelName",
    buffs: BuffTypes.Buff.array(),
  },

  Ascending: {
    activeLevel: "AscendingLevelName",
    levels: "AscendingLevel[]",
  },

  AscendingSummary: {
    activeLevel: "AscendingLevelName",
    buffs: BuffTypes.Buff.array(),
  },

  AscendingGeneralEntry: "boolean|Ascending|AscendingSummary",
}).export();
