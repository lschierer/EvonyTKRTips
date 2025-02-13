import fs from "node:fs/promises";

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
    const filePath = new URL(
      `../../assets/collections/ascendingAttributes/${item}`,
      import.meta.url
    );
    const jsondata = await fs
      .readFile(filePath, {
        encoding: "utf-8",
      })
      .catch((error: unknown) => {
        console.error(
          `failed to load file for ${item}`,
          `error is ${JSON.stringify(error)}`
        );
      });
    if (jsondata) {
      const valid = GeneralAscending.safeParse(JSON.parse(jsondata));
      if (valid.success) {
        ascendingAttributes.push(valid.data);
      } else {
        if (DEBUG) {
          console.error(`error parsing ${item}`, valid.error.message);
          console.error(JSON.stringify(jsondata));
        }
      }
    } else {
      if (DEBUG) {
        console.error(`fs.readFile returned '${JSON.stringify(jsondata)}`);
      }
    }
  })
);

export const getAllAscendingAttributes: () => GeneralAscending[] = () => {
  return [...ascendingAttributes];
};

export const getAscendingAttributes = (name: string) => {
  return ascendingAttributes.find((item) => !item.general.localeCompare(name));
};
