export const buffCondition = {
    "Against_Monsters": "Against_Monsters",
    "Attacking": "Attacking",
    "Defending": "Defending",
    "During_SvS": "During_SvS",
    "In_City": "In_City",
    "In_Main_City": "In_Main_City",
    "Marching": "Marching",
    "Reinforcing": "Reinforcing",
    "When_City_Mayor": "When_City_Mayor",
    "When_City_Mayor_for_This_SubCity": "When_City_Mayor_for_This_SubCity",
    "When_Defending_Outside_the_Main_City": "When_Defending_Outside_the_Main_City",
    "When_Rallying": "When_Rallying",
    "When_the_Main_Defense_General": "When_the_Main_Defense_General",
    "When_an_Officer": "When_an_Officer",
    "Brings_a_Dragon": "Brings_a_Dragon",
    "Brings_a_Dragon_to_the_Attack": "Brings_a_Dragon_to_the_Attack",
    "Brings_a_Dragon_or_Spirital_Beast": "Brings_a_Dragon_or_Spirital_Beast",
    "Brings_a_Dragon_or_Spritial_Beast_to_the_Attack": "Brings_a_Dragon_or_Spritial_Beast_to_the_Attack",
    "Leading_the_Army_to_Attack": "Leading_the_Army_to_Attack"
} as const;

 export type BuffCondition = (typeof buffCondition)[keyof typeof buffCondition];