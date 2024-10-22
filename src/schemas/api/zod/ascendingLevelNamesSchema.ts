import type { AscendingLevelNames } from "../types/AscendingLevelNames";
import { purpleGeneralAscendingLevelsSchema } from "./purpleGeneralAscendingLevelsSchema";
import { redGeneralAscendingLevelsSchema } from "./redGeneralAscendingLevelsSchema";
import { z } from "zod";

/**
 * @description A general Ascends as either a Red or a Purple General but not both.\n
 */
export const ascendingLevelNamesSchema = z
  .union([redGeneralAscendingLevelsSchema, purpleGeneralAscendingLevelsSchema])
  .describe(
    "A general Ascends as either a Red or a Purple General but not both.\n"
  ) as z.ZodType<AscendingLevelNames>;

export type AscendingLevelNamesSchema = z.infer<
  typeof ascendingLevelNamesSchema
>;
