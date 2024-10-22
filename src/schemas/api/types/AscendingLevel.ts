import type { AscendingLevelNames } from "./AscendingLevelNames";
import type { Buff } from "./Buff";

 /**
 * @description The effect of one star of ascending
*/
export type AscendingLevel = {
    /**
     * @type array
    */
    buffs: Buff[];
    level: AscendingLevelNames;
    active: (null | boolean);
};