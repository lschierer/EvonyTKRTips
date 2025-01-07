import * as constants from "@schemas/constants";
import { BookConflict } from "@schemas/generalConflictGroups";

import { General, GeneralPair, GeneralType } from "@schemas/generals";

import * as stores from "../store";
import AllStandardSkillBooks from "@schemas/standardSkillBooks";
import { genericPvMBook } from "./genericBook";

const DEBUG = false;

export const genericStandardSkillBooksEval = (
  primary: General,
  secondary: General,
  bookConflicts: BookConflict[],
  attribute: constants.Attribute,
  troopClass?: constants.ClassEnum
) => {
  let rValue = 0;
  AllStandardSkillBooks.map((ssb) => {
    if (bookConflicts.length > 0) {
      if (DEBUG) {
        console.log(
          `StandardSkills ${primary.id}/${secondary.id} comparison against book conflicts `
        );
      }
      const matched = bookConflicts.find((bc) => {
        /* I am evaluating as if all 6 books are on the primary general */
        /*
         * I am assuming there is no case of generals that otherwise work together
         * that both have a "when not mine" restrict on the *same* book.
         */
        /* TODO: evaluate fine grained book assignment */
        if (
          !bc.condition.localeCompare(
            constants.BookCondition.Enum["all the time"]
          )
        ) {
          if (
            !bc.book.name.toLowerCase().localeCompare(ssb.name.toLowerCase())
          ) {
            return true;
          }
        }
        return false;
      })
        ? true
        : false;
      if (!matched) {
        if (DEBUG) {
          console.log(
            `StandardSkills ${primary.id}/${secondary.id} no conflict for ${ssb.name}`
          );
        }
        if (ssb.level == 4) {
          rValue += genericPvMBook(ssb, null, attribute, troopClass);
        }
      }
    } else {
      if (DEBUG) {
        console.log(
          `StandardSkills ${primary.id}/${secondary.id} no skill book conflicts`
        );
      }
      /* always only evaluate the biggest of each type of skill book */
      if (ssb.level == 4) {
        rValue += genericPvMBook(ssb, null, attribute, troopClass);
      }
    }
  });
  return rValue;
};
