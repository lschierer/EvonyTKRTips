import { SignalArray } from "signal-utils/array";
import { SignalObject } from "signal-utils/object";

import { z } from "zod";

import * as constants from "../../../schemas/constants.ts";
import { SpecialityLevelSelection } from "../../../schemas/specialities.ts";

import debugFunction from "../../../lib/debug.ts";
/*eslint-disable @typescript-eslint/no-unused-vars */
/* @ts-expect-error: unused variable */
const DEBUG = debugFunction("components/generals/pairing/pairingstores.ts");

const GeneralOptions = z.object({
  dragon: z.boolean(),
  beast: z.boolean(),
  specialities: SpecialityLevelSelection,
});
type GeneralOptions = z.infer<typeof GeneralOptions>;

const PrimaryOptions = GeneralOptions.extend({
  ascendingLevel: constants.AscendingLevel,
});
type PrimaryOptions = z.infer<typeof PrimaryOptions>;

const PairOptions = z.object({
  primary: PrimaryOptions,
  secondary: GeneralOptions,
  pairUseCase: constants.BuffActivation,
  pairSpeciality: constants.GeneralType,
});
type PairOptions = z.infer<typeof PairOptions>;

const stores = new SignalObject({
  primary: new SignalObject({
    dragon: false,
    beast: false,
    specialities: new SignalArray([
      constants.AscendingLevel.Enum.None,
      constants.AscendingLevel.Enum.None,
      constants.AscendingLevel.Enum.None,
      constants.AscendingLevel.Enum.None,
    ]),
    ascendingLevel: constants.AscendingLevel.Enum.None,
  }),
  secondary: new SignalObject({
    dragon: false,
    beast: false,
    specialities: new SignalArray([
      constants.AscendingLevel.Enum.None,
      constants.AscendingLevel.Enum.None,
      constants.AscendingLevel.Enum.None,
      constants.AscendingLevel.Enum.None,
    ]),
  }),
  pairUseCase: constants.BuffActivation.Enum.Overall,
  pairSpeciality: constants.GeneralType.Enum.mounted_specialist,
} as PairOptions);

export default stores;
