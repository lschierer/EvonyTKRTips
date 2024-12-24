import { atom } from "nanostores";
import { General } from "@schemas/generals";
import { GeneralAscending } from "@schemas/ascending";
import { Speciality } from "@schemas/specialities";
import { SkillBook } from "@schemas/skillBooks";

export const generals = atom<General[]>(new Array<General>());

export const ascendingAttributes = atom<GeneralAscending[]>(
  new Array<GeneralAscending>()
);

export const specialities = atom<Speciality[]>(new Array<Speciality>());

export const skillBooks = atom<SkillBook[]>(new Array<SkillBook>());
