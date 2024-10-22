export const purpleGeneralAscendingLevels = {
    "None": "None",
    "1Purple": "1Purple",
    "2Purple": "2Purple",
    "3Purple": "3Purple",
    "4Purple": "4Purple",
    "5Purple": "5Purple"
} as const;

 export type PurpleGeneralAscendingLevels = (typeof purpleGeneralAscendingLevels)[keyof typeof purpleGeneralAscendingLevels];