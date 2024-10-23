import type { BuffCondition } from "./BuffCondition";
import type { DebuffConditions } from "./DebuffConditions";

 /**
 * @description A condition is essentially an adverb for a Buff object.
*/
export type Condition = ((BuffCondition | DebuffConditions) | (BuffCondition | DebuffConditions)[]);