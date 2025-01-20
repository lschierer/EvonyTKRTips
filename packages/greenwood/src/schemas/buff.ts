import { z } from "zod";
import * as constants from "./constants.ts";

const Category = constants.CovenantCategory;
type Category = z.infer<typeof Category>;

const Type = constants.BuffType;
type Type = z.infer<typeof Type>;

export const Buff = z.object({
  attribute: constants.Attribute,
  value: constants.Value,
  class: constants.ClassEnum.optional(),
  condition: z.array(constants.Condition).optional(),
});
export type Buff = z.infer<typeof Buff>;
