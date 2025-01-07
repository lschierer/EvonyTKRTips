import { z } from "zod";

export const AscendingLevel = z.enum([
  "None",
  "purple1",
  "purple2",
  "purple3",
  "purple4",
  "purple5",
  "red1",
  "red2",
  "red3",
  "red4",
  "red5",
]);
export type AscendingLevel = z.infer<typeof AscendingLevel>;

export const SpecialityLevelName = z.enum([
  "None",
  "Green",
  "Blue",
  "Purple",
  "Orange",
  "Gold",
]);
export type SpecialityLevelName = z.infer<typeof SpecialityLevelName>;

export const Attribute = z.enum([
  "Attack",
  "Death to Soul",
  "Death to Survival",
  "Death to Wounded",
  "Defense",
  "Deserter Capacity",
  "Double Items Drop Rate",
  "HP",
  "Hospital Capacity",
  "March Size Capacity",
  "March Time",
  "Marching Speed to Monsters",
  "Marching Speed",
  "Rally Capacity",
  "Resources Production",
  "Stamina cost",
  "SubCity Construction Speed",
  "SubCity Gold Production",
  "SubCity Training Speed",
  "SubCity Troop Capacity",
  "Training Capacity",
  "Training Speed",
  "Wounded to Death",
]);
export type Attribute = z.infer<typeof Attribute>;

export const BlazonType = z.enum([
  "earth",
  "wind",
  "fire",
  "ocean",
  "shadow",
  "light",
]);
export type BlazonType = z.infer<typeof BlazonType>;

export const BuffType = z.enum(["passive", "personal"]);
export type BuffType = z.infer<typeof BuffType>;

export const ClassEnum = z.enum([
  "Ground Troops",
  "Monsters",
  "Mounted Troops",
  "Ranged Troops",
  "Siege Machines",
  "All",
]);
export type ClassEnum = z.infer<typeof ClassEnum>;

export const BookCondition = z.enum(["all the time", "when not mine"]);
export type BookCondition = z.infer<typeof BookCondition>;

export const BuffCondition = z.enum([
  "Against Monsters",
  "Attacking",
  "brings a dragon",
  "brings dragon or beast to attack",
  "Defending",
  "dragon to the attack",
  "leading the army to attack",
  "Marching",
  "Reinforcing",
  "When City Mayor for this SubCity",
  "When Defending Outside The Main City",
  "When Rallying",
  "In Main City",
]);
export type BuffCondition = z.infer<typeof BuffCondition>;

export const DebuffCondition = z.enum([
  "Enemy",
  "Enemy In City",
  "Reduces",
  "Reduces Enemy",
  "Reduces Enemy in Attack",
  "Reduces Enemy with a Dragon",
  "Reduces Monster",
]);
export type DebuffCondition = z.infer<typeof DebuffCondition>;

export const Condition = z.union([
  BookCondition,
  BuffCondition,
  DebuffCondition,
]);
export type Condition = z.infer<typeof Condition>;

export const CovenantCategory = z.enum([
  "Civilization",
  "Cooperation",
  "Faith",
  "Honor",
  "Peace",
  "War",
]);
export type CovenantCategory = z.infer<typeof CovenantCategory>;

export const Unit = z.enum(["flat", "percentage"]);
export type Unit = z.infer<typeof Unit>;

const AESAdjustment = z.record(AscendingLevel, z.number());
type AESAdjustment = z.infer<typeof AESAdjustment>;

export const BasicAESAdjustment = {
  [AscendingLevel.Enum.None]: 0,
  [AscendingLevel.Enum.purple1]: 0,
  [AscendingLevel.Enum.purple2]: 0,
  [AscendingLevel.Enum.purple3]: 0,
  [AscendingLevel.Enum.purple4]: 0,
  [AscendingLevel.Enum.purple5]: 0,
  [AscendingLevel.Enum.red1]: 10,
  [AscendingLevel.Enum.red2]: 20,
  [AscendingLevel.Enum.red3]: 30,
  [AscendingLevel.Enum.red4]: 40,
  [AscendingLevel.Enum.red5]: 50,
};

export const BasicStarAdjustment = {
  1: {
    attack: 50,
    defense: 48,
    leadership: 47,
    politics: 46,
  },
};

export const Value = z.object({
  number: z.number(),
  unit: Unit,
});
export type Value = z.infer<typeof Value>;
