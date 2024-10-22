import type { Buff } from "./Buff";
import type { SpecialityLevelNames } from "./SpecialityLevelNames";

 /**
 * @description The Effective Buff Provided by a Speciality at a particular level\n
*/
export type SpecialityEffect = {
    /**
     * @type array
    */
    buff: Buff[];
    /**
     * @type string | undefined
    */
    name?: string;
    activeLevel: SpecialityLevelNames;
};