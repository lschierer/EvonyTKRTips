import type { BuiltinBook } from "../types/BuiltinBook";
import { buffSchema } from "./buffSchema";
import { z } from "zod";

/**
 * @description A General\'s Builtin Book
 */
export const builtinBookSchema = z
  .object({ name: z.string(), buffs: z.array(buffSchema) })
  .describe("A General's Builtin Book ") as z.ZodType<BuiltinBook>;

export type BuiltinBookSchema = z.infer<typeof builtinBookSchema>;
