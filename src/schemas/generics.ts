import { type } from "arktype";

export const uuid = type("string.uuid");

export const positiveInteger = type("number", ":", (n) => n > 0);
