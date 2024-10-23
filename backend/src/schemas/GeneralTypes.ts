import { scope } from "arktype";

import { SpecialitiesTypes } from "./SpecialitiesTypes";

import { AscendingTypes } from "./AscendingTypes";

import { BookAndSkinTypes } from "./BookAndSkinTypes";

export const GeneralTypes = scope({
  AttackObject: {
    AttackBase: "number.integer > 0",
    AttackIncrement: "number > 0",
    TotalAttack: "number",
  },
  Attack: "number > 0 | AttackObject",

  DefenseObject: {
    DefenseBase: "number.integer > 0",
    DefenseIncrement: "number > 0",
    TotalDefense: "number",
  },
  Defense: "number > 0 | DefenseObject",

  LeadershipObject: {
    LeadershipBase: "number.integer > 0",
    LeadershipIncrement: "number > 0",
    TotalLeadership: "number",
  },
  Leadership: "number > 0 | LeadershipObject",

  PoliticsObject: {
    PoliticsBase: "number.integer > 0",
    PoliticsIncrement: "number > 0",
    TotalPolitics: "number",
  },
  Politics: "number > 0 | PoliticsObject",

  BasicAttributes: {
    Attack: "Attack",
    Defense: "Defense",
    Leadership: "Leadership",
    Politics: "Politics",
  },

  General: {
    name: "string",
    id: "string.uuid",
    "level?": "1 <= number <=45",
    "basicAttributes?": "BasicAttributes",
    "specialities?": SpecialitiesTypes.SpecialitiesListing,
    "ascending?": AscendingTypes.AscendingGeneralEntry,
    "builtinBook?": BookAndSkinTypes.book,
    "otherBooks?": BookAndSkinTypes.standardBook.array().atMostLength(4),
    "skin?": BookAndSkinTypes.skin,
  },
}).export();
