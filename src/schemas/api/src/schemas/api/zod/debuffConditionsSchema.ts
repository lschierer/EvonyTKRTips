import type { DebuffConditions } from "../../../../types/DebuffConditions";
import { z } from "zod";

 /**
 * @description Some Buffs are in fact Debuffs
 */
export const debuffConditionsSchema = z.enum(["Enemy", "Enemy_in_City", "Reduces_Enemy", "Reduces_Enemy_in_Attack", "Reduces_Enemy_with_a_Dragon", "Reduces_Enemy_with_a_Dragon_or_Spiritual_Beast", "Reduces"]).describe("Some Buffs are in fact Debuffs") as z.ZodType<DebuffConditions>;

 export type DebuffConditionsSchema = z.infer<typeof debuffConditionsSchema>;