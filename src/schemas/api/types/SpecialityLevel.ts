import type { Buff } from "./Buff";
import type { SpecialityLevelNames } from "./SpecialityLevelNames";

 export type SpecialityLevel = {
    /**
     * @type array
    */
    Buffs: Buff[];
    level: SpecialityLevelNames;
    active: (null | boolean);
};