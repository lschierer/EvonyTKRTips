import type { SpecialityLevelNames } from "./SpecialityLevelNames";

 export type Speciality = {
    /**
     * @type string
    */
    name: string;
    /**
     * @type array
    */
    levels: SpecialityLevelNames[];
};