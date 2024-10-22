import type { Buff } from "./Buff";

/**
 * @description A General\'s Builtin Book
 */
export type BuiltinBook = {
  /**
   * @type array
   */
  name: string;
  /**
   * @type string
   */
  buffs: Buff[];
};
