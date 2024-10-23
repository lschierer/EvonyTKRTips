import type { AscendingLevel } from "./AscendingLevel";
import type { AscendingLevelNames } from "./AscendingLevelNames";

 /**
 * @description The overall effeects of Ascending a General
*/
export type Ascending = {
    /**
     * @type array
    */
    levels: AscendingLevel[];
    activeLevel: AscendingLevelNames;
};