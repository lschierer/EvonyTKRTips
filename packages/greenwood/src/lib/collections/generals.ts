import fs from "node:fs/promises";

import { General } from "../../schemas/generals.ts";
import collection from "../../assets/collections/generals/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/generals.ts");

export default class generalsCollection {
  accessor generals = new Array<General>();

  public initialize = async () => {
    await Promise.all(
      collection.map(async (gf) => {
        if (DEBUG) {
          console.log(`gf is ${gf}`);
        }
        const filePath = new URL(
          `../../assets/collections/generals/${gf}`,
          import.meta.url
        );
        if (DEBUG) {
          console.log(`filePath is ${filePath}`);
        }
        const jsondata = await fs
          .readFile(filePath, {
            encoding: "utf8",
          })
          .catch((error: unknown) => {
            if (DEBUG) {
              console.error(
                `error reading file ${filePath.toString()} for ${gf} with error ${JSON.stringify(error)}`
              );
            }
          });
        if (jsondata) {
          const valid = General.safeParse(JSON.parse(jsondata));
          if (valid.success) {
            this.generals.push(valid.data);
          } else {
            if (DEBUG) {
              console.error(`error parsing ${gf}`, valid.error.message);
              console.error(JSON.stringify(jsondata));
            }
          }
        } else {
          if (DEBUG) {
            console.error(
              `fs.readfile call returned ${JSON.stringify(jsondata)}`
            );
          }
        }
      })
    );
  };

  public getGeneral = (searchName: string) => {
    return this.generals.find((g) => !g.id.localeCompare(searchName));
  };
}
