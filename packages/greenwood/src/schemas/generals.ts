import * as z from "zod";

import * as constants from "./constants.ts";

export const Display = z.enum(["summary"]);
export type Display = z.infer<typeof Display>;

export const BasicAttribute = z.object({
  base: z.number(),
  increment: z.number(),
});
export type BasicAttribute = z.infer<typeof BasicAttribute>;

export const Note = z.object({
  severity: z.string(),
  text: z.string(),
});
export type Note = z.infer<typeof Note>;

export const BasicAttributes = z.object({
  attack: BasicAttribute,
  defense: BasicAttribute,
  leadership: BasicAttribute,
  politics: BasicAttribute,
});
export type BasicAttributes = z.infer<typeof BasicAttributes>;

export const General = z.object({
  ascending: z.boolean(),
  basic_attributes: BasicAttributes,
  book: z.string(),
  display: Display.optional(),
  name: z.string(),
  note: z.array(Note).optional(),
  specialities: z.array(z.string()),
  specialityLevels: z.array(constants.SpecialityLevelName).optional(),
  stars: constants.AscendingLevel,
  type: z.array(constants.GeneralType),
  extra: z.array(z.string()).optional(),
  warnings: z.array(z.string()).optional(),
  level: z.number().min(1).max(45).optional(),
});
export type General = z.infer<typeof General>;

export const GeneralPair = z.object({
  primary: General,
  secondary: General,
  MarchSizeIncrease: z
    .object({
      total: z.number(),
      baseAttribute: z.number(),
      attributeIncrement: z.number(),
      totalAttribute: z.number(),
      baseSkill: z.number(),
      SkillBooks: z.number(),
      Speciality1: z.number(),
      Speciality2: z.number(),
      Speciality3: z.number(),
      Speciality4: z.number(),
      Ascending: z.number(),
    })
    .optional(),
  BuffSet: constants.EvAnsBuffSet.optional(),
  ScoreSet: constants.EvAnsScoreSet.optional(),
});
export type GeneralPair = z.infer<typeof GeneralPair>;
