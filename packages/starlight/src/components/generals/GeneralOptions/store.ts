import { z } from "zod";

import * as constants from "@schemas/constants";

const DEBUG = true;

export const GeneralSpecialtyLevelArray = z
  .array(constants.SpecialityLevelName)
  .length(4)
  .refine(
    (value) => {
      if (!value[0].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
        if (!value[1].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
          if (
            !value[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)
          ) {
            if (
              !value[3].localeCompare(constants.SpecialityLevelName.Enum.None)
            ) {
              return false;
            }
            return true;
          }
        }
      }

      return false;
    },
    {
      message: `4th speciality cannot be None when the other 3 are Gold.}`,
      path: ["test 1"],
    }
  )
  .refine(
    (value) => {
      if (value[3].localeCompare(constants.SpecialityLevelName.Enum.None)) {
        if (!value[2].localeCompare(constants.SpecialityLevelName.Enum.Gold)) {
          if (
            !value[1].localeCompare(constants.SpecialityLevelName.Enum.Gold)
          ) {
            if (
              !value[0].localeCompare(constants.SpecialityLevelName.Enum.Gold)
            ) {
              return true;
            }
          }
        } else {
          if (DEBUG) {
            console.log(
              `GeneralSpecialtyLevelArray second test second if failed`
            );
          }
        }
      }
      return false;
    },
    {
      message:
        "the first 3 specialities must be gold if the 4th speciality has a value",
      path: ["test 2"],
    }
  );
export type GeneralSpecialtyLevelArray = z.infer<
  typeof GeneralSpecialtyLevelArray
>;

const PrimaryGeneralOptions = z.object({
  level: z.number().gte(1).lte(45),
  ascendingLevel: constants.AscendingLevel,
  specialityLevels: GeneralSpecialtyLevelArray,
  dragon: z.boolean(),
  beast: z.boolean(),
});
type PrimaryGeneralOptions = z.infer<typeof PrimaryGeneralOptions>;

const SecondaryGeneralOptions = z.object({
  specialityLevels: GeneralSpecialtyLevelArray,
  dragon: z.boolean(),
  beast: z.boolean(),
});
type SecondaryGeneralOptions = z.infer<typeof SecondaryGeneralOptions>;

export const GeneralOptions = z.discriminatedUnion("role", [
  z.object({
    role: z.literal("primary"),
    options: PrimaryGeneralOptions,
  }),
  z.object({
    role: z.literal("secondary"),
    options: SecondaryGeneralOptions,
  }),
]);
export type GeneralOptions = z.infer<typeof GeneralOptions>;

export const PairOptions = z.object({
  primary: z.object({
    role: z.literal("primary"),
    options: PrimaryGeneralOptions,
  }),
  secondary: z.object({
    role: z.literal("secondary"),
    options: SecondaryGeneralOptions,
  }),
});
export type PairOptions = z.infer<typeof PairOptions>;
