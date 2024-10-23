import type { Buff } from "./Buff";

 /**
 * @description Some generals have Skins or alternate outfits that add buffs
*/
export type Skin = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type array
    */
    activeBuffs: Buff[];
    /**
     * @type array
    */
    passiveBuffs: Buff[];
};