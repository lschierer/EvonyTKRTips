import { atom } from "nanostores";
import { z } from "zod";

import * as constants from "../../../schemas/constants.ts";

export const generalusecase = atom<constants.BuffActivation>(
  constants.BuffActivation.Enum.Overall
);
