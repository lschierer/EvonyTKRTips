import type { Buff } from "./Buff";

 /**
 * @description Standard Books that can be added to a General
*/
export type StandardBook = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type array
    */
    buffs: Buff[];
    /**
     * @type integer, int32
    */
    level: number;
};