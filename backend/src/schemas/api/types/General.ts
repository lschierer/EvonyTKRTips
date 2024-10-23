import type { AscendingLevel } from "./AscendingLevel";
import type { AscendingSummary } from "./AscendingSummary";
import type { BasicAttributesObject } from "./BasicAttributesObject";
import type { BasicAttributesObjectSummary } from "./BasicAttributesObjectSummary";
import type { BuiltinBook } from "./BuiltinBook";
import type { GeneralEvaluationTypes } from "./GeneralEvaluationTypes";
import type { Skin } from "./Skin";
import type { Speciality } from "./Speciality";
import type { SpecialityEffect } from "./SpecialityEffect";
import type { StandardBook } from "./StandardBook";

export type General = {
  /**
   * @type string
   */
  name: string;
  skin?: string | Skin;
  type: GeneralEvaluationTypes | GeneralEvaluationTypes[];
  /**
   * @type integer
   */
  level: number;
  ascending: boolean | AscendingLevel | AscendingSummary;
  otherBooks?: string[] | StandardBook[];
  builtInBook: string | BuiltinBook;
  specialities: string[] | Speciality[] | SpecialityEffect[];
  basicAttributes: BasicAttributesObject | BasicAttributesObjectSummary;
};
