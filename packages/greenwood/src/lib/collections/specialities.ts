import fs from "node:fs/promises";

import { Speciality } from "../../schemas/specialities.ts";
import collection from "../../assets/collections/specialities/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/ascendingAttributes.ts");

const specialities = new Array<Speciality>();
await Promise.all(
  collection.map(async (item) => {
    if (DEBUG) {
      console.log(`item is ${item}`);
    }
    const filePath = new URL(
      `../../assets/collections/specialities/${item}`,
      import.meta.url
    );
    const jsondata = await fs
      .readFile(filePath, {
        encoding: "utf8",
      })
      .catch((error: unknown) => {
        if (DEBUG) {
          console.error(
            `error reading file ${filePath.toString()} for ${item} with error ${JSON.stringify(error)}`
          );
        }
      });
    if (jsondata) {
      const valid = Speciality.safeParse(JSON.parse(jsondata));
      if (valid.success) {
        specialities.push(valid.data);
      } else {
        if (DEBUG) {
          console.error(`error parsing ${item}`, valid.error.message);
          console.error(JSON.stringify(jsondata));
        }
      }
    }
  })
);

export const getAllSpecialities: () => Speciality[] = () => {
  return [...specialities];
};

export const getSpeciality = (name: string) => {
  return specialities.find((item) => !item.name.localeCompare(name));
};
