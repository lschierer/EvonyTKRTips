import { General } from "../../schemas/generals.ts";
import collection from "../../assets/collections/generals/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/generals.ts");

const generals = new Array<General>();
await Promise.all(
  collection.map(async (gf) => {
    if (DEBUG) {
      console.log(`gf is ${gf}`);
    }
    await import(`../../assets/collections/generals/${gf}`, {
      with: { type: "json" },
    })
      .then((jsondata: object) => {
        const keys = Object.keys(jsondata);
        if (keys.includes("default")) {
          const valid = General.safeParse(
            jsondata["default" as keyof typeof jsondata]
          );
          if (valid.success) {
            generals.push(valid.data);
          } else {
            if (DEBUG) {
              console.error(`error parsing ${gf}`, valid.error.message);
              console.error(JSON.stringify(jsondata));
            }
          }
        }
      })
      .catch((error: unknown) => {
        console.error(
          `failed to load general file for ${gf}`,
          `error is ${JSON.stringify(error)}`
        );
      });
  })
);

export const getAllGenerals = () => {
  return [...generals];
};

export const getGeneral = (name: string) => {
  return generals.find((g) => !g.id.localeCompare(name));
};
