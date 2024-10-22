export const debuffConditions = {
    "Enemy": "Enemy",
    "Enemy_in_City": "Enemy_in_City",
    "Reduces_Enemy": "Reduces_Enemy",
    "Reduces_Enemy_in_Attack": "Reduces_Enemy_in_Attack",
    "Reduces_Enemy_with_a_Dragon": "Reduces_Enemy_with_a_Dragon",
    "Reduces_Enemy_with_a_Dragon_or_Spiritual_Beast": "Reduces_Enemy_with_a_Dragon_or_Spiritual_Beast",
    "Reduces": "Reduces"
} as const;

 export type DebuffConditions = (typeof debuffConditions)[keyof typeof debuffConditions];