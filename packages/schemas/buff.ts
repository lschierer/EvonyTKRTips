import { z } from "zod";
import * as constants from "./constants";

export const Buff = z.object({
  attribute: constants.Attribute,
  value: constants.Value,
  class: constants.ClassEnum.optional(),
  condition: z.array(constants.Condition).optional(),
});
export type Buff = z.infer<typeof Buff>;
