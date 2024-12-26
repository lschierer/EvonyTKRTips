import { atom } from "nanostores";
import { General, GeneralType } from "@schemas/generals";
import { GeneralAscending } from "@schemas/ascending";
import { Speciality } from "@schemas/specialities";
import { SkillBook } from "@schemas/skillBooks";
import * as constants from "@schemas/constants";

const DEBUG = true;

export const selectedValues = atom<General>({
  id: "",
  ascending: true,
  basic_attributes: {
    attack: {
      base: 0,
      increment: 0,
    },
    defense: {
      base: 0,
      increment: 0,
    },
    leadership: {
      base: 0,
      increment: 0,
    },
    politics: {
      base: 0,
      increment: 0,
    },
  },
  book: "",
  specialities: [""],
  type: GeneralType.options,
  stars: constants.AscendingLevel.Values.red5,
});
export const generals = atom<General[]>(new Array<General>());

export const ascendingAttributes = atom<GeneralAscending[]>(
  new Array<GeneralAscending>()
);

export const specialities = atom<Speciality[]>(new Array<Speciality>());

export const skillBooks = atom<SkillBook[]>(new Array<SkillBook>());

generals.listen((value, oldValue) => {
  if (DEBUG) {
    console.log(
      `generals, oldValue was "${JSON.stringify(oldValue)}", value is "${JSON.stringify(value)}"`
    );
  }
});
