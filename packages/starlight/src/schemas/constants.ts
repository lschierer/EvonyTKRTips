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
  "Training Capacity",
  "Training Speed",
  "Wounded to Death",
]);
export type Attrbute = z.infer<typeof Attribute>;

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
]);
export type ClassEnum = z.infer<typeof ClassEnum>;

export const Condition = z.enum([
  "Against Monsters",
  "Attacking",
  "brings a dragon",
  "brings dragon or beast to attack",
  "Defending",
  "dragon to the attack",
  "Enemy",
  "Enemy In City",
  "In Main City",
  "leading the army to attack",
  "Marching",
  "Reduces",
  "Reduces Enemy",
  "Reduces Enemy in Attack",
  "Reduces Enemy with a Dragon",
  "Reinforcing",
  "When City Mayor for this SubCity",
  "When Defending Outside The Main City",
  "When Rallying",
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
