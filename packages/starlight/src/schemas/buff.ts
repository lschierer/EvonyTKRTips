import { z } from "zod";
import * as constants from "./constants";

const Unit = constants.Unit;
type Unit = z.infer<typeof Unit>;

const Category = constants.CovenantCategory;
type Category = z.infer<typeof Category>;

const Type = constants.BuffType;
type Type = z.infer<typeof Type>;

export const Value = z.object({
  number: z.number(),
  unit: Unit,
});
export type Value = z.infer<typeof Value>;

export const Buff = z.object({
  attribute: constants.Attribute,
  class: constants.ClassEnum.optional(),
  condition: z.array(constants.Condition).optional(),
  value: Value,
});
export type Buff = z.infer<typeof Buff>;
