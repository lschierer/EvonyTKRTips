export const generalEvaluationTypes = {
    "Ground_Specialist": "Ground_Specialist",
    "Ranged_Specialist": "Ranged_Specialist",
    "Mounted_Specialist": "Mounted_Specialist",
    "Siege_Specialist": "Siege_Specialist",
    "Mayor": "Mayor",
    "Wall_General": "Wall_General",
    "Officer": "Officer"
} as const;

 export type GeneralEvaluationTypes = (typeof generalEvaluationTypes)[keyof typeof generalEvaluationTypes];