import * as z from "zod";

import * as constants from "./constants";

export const BookBook = z.object({
  name: z.string(),
  level: z.number(),
});
export type BookBook = z.infer<typeof BookBook>;

export const BookElement = z.object({
  book: BookBook,
  condition: constants.Condition,
});
export type BookElement = z.infer<typeof BookElement>;

export const ConfictGroup = z.object({
  name: z.string().uuid(),
  members: z.array(z.string()),
  others: z.array(z.string().uuid()).optional(),
  books: z.array(BookElement).optional(),
});
export type ConfictGroup = z.infer<typeof ConfictGroup>;
