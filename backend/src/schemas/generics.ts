import { type } from "arktype";
export const uuid = type("string.uuid");

export const positiveInteger = type("number", ":", (n) => n > 0);

export const Color = type(
  '"light" | "dark" | "lightest" | "darkest" | "light-express" | "lightest-express" | "dark-express" | "darkest-express" | "light-spectrum-two" | "dark-spectrum-two" | "auto"'
);
export type Color = typeof Color.infer;

export const Scale = type(' "medium" | "large"');
export type Scale = typeof Scale.infer;
