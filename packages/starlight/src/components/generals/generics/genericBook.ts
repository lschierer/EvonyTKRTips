import * as constants from "@schemas/constants";
import type { SkillBook } from "@schemas/skillBooks";
import { genericPvMBuffEval } from "./genericBuff";

export const genericPvMBook = (
  primary_skillBook: SkillBook,
  secondary_skillBook: SkillBook | null,
  attribute: constants.Attribute,
  troopClass?: constants.ClassEnum
) => {
  const bookEval = (book: SkillBook) => {
    let rValue = 0;
    if (book) {
      if (book) {
        const buffs = book.buff;
        if (Array.isArray(buffs)) {
          buffs.map((buff) => {
            rValue += genericPvMBuffEval(buff, attribute, troopClass);
          });
        } else {
          rValue += genericPvMBuffEval(buffs, attribute, troopClass);
        }
      }
    }
    return rValue;
  };
  let rValue = 0;
  if (primary_skillBook) {
    rValue += bookEval(primary_skillBook);
  }
  if (secondary_skillBook) {
    rValue += bookEval(secondary_skillBook);
  }
  return rValue;
};
