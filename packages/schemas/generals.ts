import * as z from "zod";

import * as constants from "./constants";
import { Speciality } from "./specialities";
import { AscendingLevel } from "./ascending";
import { SkillBook } from "./skillBooks";
import { BuffSummaryResponse } from "./buff";

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
  ScoreSet: constants.EvAnsScoreSet.optional(),
});
export type GeneralPair = z.infer<typeof GeneralPair>;

export const GeneralWithBuffs = General.extend({
  buffSummary: BuffSummaryResponse,
});
export type GeneralWithBuffs = z.infer<typeof GeneralWithBuffs>;

export const CompleteGeneral = General.omit({
  ascending: true,
  book: true,
  specialities: true,
}).extend({
  ascending: z.union([
    z.boolean().refine((val) => !val),
    AscendingLevel.array(),
  ]),
  book: SkillBook,
  specialities: Speciality.array(),
});
export type CompleteGeneral = z.infer<typeof CompleteGeneral>;

export const GeneralTableData = z.object({
  name: z.string(),
  marchCapacity: z.number().optional(),
  attack: z.number(),
  defense: z.number(),
  hp: z.number(),
  attackDebuff: z.number(),
  defenseDebuff: z.number(),
  hpDebuff: z.number(),
});
export type GeneralTableData = z.infer<typeof GeneralTableData>;

export const WallGeneralTableData = z.object({
  name: z.string(),
  // Ground troops
  groundAttack: z.number(),
  groundDefense: z.number(),
  groundHP: z.number(),
  groundAttackDebuff: z.number(),
  groundDefenseDebuff: z.number(),
  groundHPDebuff: z.number(),
  // Mounted troops
  mountedAttack: z.number(),
  mountedDefense: z.number(),
  mountedHP: z.number(),
  mountedAttackDebuff: z.number(),
  mountedDefenseDebuff: z.number(),
  mountedHPDebuff: z.number(),
  // Ranged troops
  rangedAttack: z.number(),
  rangedDefense: z.number(),
  rangedHP: z.number(),
  rangedAttackDebuff: z.number(),
  rangedDefenseDebuff: z.number(),
  rangedHPDebuff: z.number(),
  // Siege machines
  siegeAttack: z.number(),
  siegeDefense: z.number(),
  siegeHP: z.number(),
  siegeAttackDebuff: z.number(),
  siegeDefenseDebuff: z.number(),
  siegeHPDebuff: z.number(),
});
export type WallGeneralTableData = z.infer<typeof WallGeneralTableData>;

export const MayorGeneralTableData = z.object({
  name: z.string(),
  // Ground troops debuffs
  groundAttackDebuff: z.number(),
  groundDefenseDebuff: z.number(),
  groundHPDebuff: z.number(),
  // Mounted troops debuffs
  mountedAttackDebuff: z.number(),
  mountedDefenseDebuff: z.number(),
  mountedHPDebuff: z.number(),
  // Ranged troops debuffs
  rangedAttackDebuff: z.number(),
  rangedDefenseDebuff: z.number(),
  rangedHPDebuff: z.number(),
  // Siege machines debuffs
  siegeAttackDebuff: z.number(),
  siegeDefenseDebuff: z.number(),
  siegeHPDebuff: z.number(),
});
export type MayorGeneralTableData = z.infer<typeof MayorGeneralTableData>;
