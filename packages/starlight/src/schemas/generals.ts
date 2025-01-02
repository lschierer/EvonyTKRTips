import * as z from "zod";

import * as constants from "./constants";
import { Buff } from "./buff";
import { Speciality } from "./specialities";

export const Display = z.enum(["summary"]);
export type Display = z.infer<typeof Display>;

export const GeneralType = z.enum([
  "ground_specialist",
  "mayor",
  "wall",
  "mounted_specialist",
  "ranged_specialist",
  "siege_specialist",
]);
export type GeneralType = z.infer<typeof GeneralType>;

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
  id: z.string(),
  note: z.array(Note).optional(),
  specialities: z.array(z.string()),
  specialityLevels: z.array(constants.SpecialityLevelName).optional(),
  stars: constants.AscendingLevel,
  type: z.array(GeneralType),
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
      MountedPvMCompatiblePair: z.number(),
      baseAttribute: z.number(),
      attributeIncrement: z.number(),
      attributeTotal: z.number(),
      baseSkill: z.number(),
    })
    .optional(),
});
export type GeneralPair = z.infer<typeof GeneralPair>;

/*
MarchSizeIncrease: z
  .object({

    baseAttribute: z.number(),
    attributeIncrement: z.number(),
    attributeTotal: z.number(),
    baseSkill: z.number(),
  })
  .optional(),
MountedPVM: z
  .object({
    attack: z.object({
      baseAttribute: z.number(),
      attributeIncrement: z.number(),
      attributeTotal: z.number(),
      baseSkill: z.number(),
    }),
  })
  .optional(),
AttackingAttack: z
  .object({
    attack: z.object({
      baseAttribute: z.number(),
      attributeIncrement: z.number(),
      attributeTotal: z.number(),
      baseSkill: z.number(),
    }),
  })
  .optional(),
*/
