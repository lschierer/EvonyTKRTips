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
    await import(`../../assets/collections/specialities/${item}`, {
      with: { type: "json" },
    })
      .then((jsondata: object) => {
        const keys = Object.keys(jsondata);
        if (keys.includes("default")) {
          const valid = Speciality.safeParse(
            jsondata["default" as keyof typeof jsondata]
          );
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
      .catch((error: unknown) => {
        console.error(
          `failed to load file for ${item}`,
          `error is ${JSON.stringify(error)}`
        );
      });
  })
);

export const getAllSpecialities: () => Speciality[] = () => {
  return [...specialities];
};

export const getSpeciality = (name: string) => {
  return specialities.find((item) => !item.name.localeCompare(name));
};
