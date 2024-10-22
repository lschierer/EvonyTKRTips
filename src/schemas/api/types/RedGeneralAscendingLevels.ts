export const redGeneralAscendingLevels = {
    "None": "None",
    "1Red": "1Red",
    "2Red": "2Red",
    "3Red": "3Red",
    "4Red": "4Red",
    "5Red": "5Red"
} as const;

 export type RedGeneralAscendingLevels = (typeof redGeneralAscendingLevels)[keyof typeof redGeneralAscendingLevels];