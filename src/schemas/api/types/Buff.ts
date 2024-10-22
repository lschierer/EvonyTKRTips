import type { BuffAttributes } from "./BuffAttributes";
import type { Condition } from "./Condition";

 export type Buff = {
    /**
     * @type string
    */
    unit: string;
    /**
     * @type integer
    */
    value: number;
    /**
     * @type boolean | undefined
    */
    passive?: boolean;
    attribute: (BuffAttributes | BuffAttributes[]);
    conditions: Condition;
};