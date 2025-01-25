import { signal, type Signal } from "@lit-labs/signals";
import * as constants from "../../../schemas/constants.ts";

export const generalusecase: Signal.State<constants.BuffActivation> = signal(
  constants.BuffActivation.Enum.Overall
);

export const generalSpeciality: Signal.State<constants.GeneralType> = signal(
  constants.GeneralType.Enum.mounted_specialist
);

export const ascendingLevel: Signal.State<constants.AscendingLevel> = signal(
  constants.AscendingLevel.Enum.None
);
