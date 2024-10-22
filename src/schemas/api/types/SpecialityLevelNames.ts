export const specialityLevelNames = {
    "None": "None",
    "Green": "Green",
    "Blue": "Blue",
    "Purple": "Purple",
    "Orange": "Orange",
    "Gold": "Gold"
} as const;

 export type SpecialityLevelNames = (typeof specialityLevelNames)[keyof typeof specialityLevelNames];