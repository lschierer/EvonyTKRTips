import { createSignal, createContext } from "solid-js";

import * as constants from "@schemas/constants";
import { General } from "@schemas/generals";
import { Speciality } from "@schemas/specialities";
import { SkillBook } from "@schemas/skillBooks";
import { ConfictGroup } from "@schemas/generalConflictGroups";
import { GeneralAscending } from "@schemas/ascending";

export type tc = {
  useCase: constants.BuffActivation;
  generals: General[];
  skillbooks: SkillBook[];
  conflictgroups: ConfictGroup[];
  specialities: Speciality[];
  ascending: GeneralAscending[];
};

export const TableContext = createContext<tc>({
  useCase: constants.BuffActivation.Enum.Overall,
  generals: new Array<General>(),
  skillbooks: new Array<SkillBook>(),
  conflictgroups: new Array<ConfictGroup>(),
  specialities: new Array<Speciality>(),
  ascending: new Array<GeneralAscending>(),
});
