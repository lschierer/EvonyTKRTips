import * as z from "zod";

import * as constants from "./constants.ts";

export const MetaBook = z.object({
  name: z.string(),
  level: z.number(),
});
export type BookBook = z.infer<typeof MetaBook>;

export const BookConflict = z.object({
  book: MetaBook,
  condition: constants.Condition,
});
export type BookConflict = z.infer<typeof BookConflict>;

export const ConfictGroup = z.object({
  name: z.string().uuid(),
  members: z.array(z.string()),
  others: z.array(z.string().uuid()).optional(),
  books: z.array(BookConflict).optional(),
});
export type ConfictGroup = z.infer<typeof ConfictGroup>;
