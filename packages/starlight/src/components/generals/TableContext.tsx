import { createSignal, createContext, type Accessor } from "solid-js";
import { type SetStoreFunction } from "solid-js/store";

import * as constants from "@schemas/constants";
import { General } from "@schemas/generals";
import { Speciality } from "@schemas/specialities";
import { SkillBook } from "@schemas/skillBooks";
import { ConfictGroup } from "@schemas/generalConflictGroups";
import { GeneralAscending } from "@schemas/ascending";

export type tcValue = {
  useCase: constants.BuffActivation;
  generals: General[];
  skillbooks: SkillBook[];
  conflictgroups: ConfictGroup[];
  specialities: Speciality[];
  ascending: GeneralAscending[];
};
