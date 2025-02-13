import { GeneralAscending } from "../../schemas/ascending.ts";
import collection from "../../assets/collections/ascendingAttributes/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/ascendingAttributes.ts");

const ascendingAttributes = new Array<GeneralAscending>();
await Promise.all(
  collection.map(async (item) => {
    if (DEBUG) {
      console.log(`item is ${item}`);
    }
    await import(`@evonytkrtips/assets/ascendingAttributes/${item}`, {
      with: { type: "json" },
    })
      .then((jsondata: object) => {
        const keys = Object.keys(jsondata);
        if (keys.includes("default")) {
          const valid = GeneralAscending.safeParse(
            jsondata["default" as keyof typeof jsondata]
          );
          if (valid.success) {
            ascendingAttributes.push(valid.data);
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

export const getAllAscendingAttributes: () => GeneralAscending[] = () => {
  return [...ascendingAttributes];
};

export const getAscendingAttributes = (name: string) => {
  return ascendingAttributes.find((item) => !item.general.localeCompare(name));
};
