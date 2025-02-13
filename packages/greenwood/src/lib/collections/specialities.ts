import fs from "node:fs/promises";
import path from "node:path";

import { Speciality } from "../../schemas/specialities.ts";
import collection from "../../assets/collections/specialities/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/ascendingAttributes.ts");

export default class SpecialitiesCollection {
  accessor specialities = new Array<Speciality>();

  private computeBasePath = (depth: number) => {
    let bp = "";
    if (depth < 0) {
      throw new Error(`depth must be a positive integer, not ${depth}`);
      return "./";
    }
    if (depth == 1) {
      bp = "./";
      return bp;
    } else {
      while (depth) {
        bp = bp.concat("../");
        depth--;
      }
    }
    return bp;
  };

  public initialize = async (depth: number = 2) => {
    await Promise.all(
      collection.map(async (item) => {
        if (DEBUG) {
          console.log(`item is ${item}`);
        }
        const basePath =
          process.env.__GWD_COMMAND__ == "serve"
            ? this.computeBasePath(depth)
            : "../../";
        const filePath = new URL(
          path.join(basePath, `/assets/collections/specialities/${item}`),
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
            this.specialities.push(valid.data);
          } else {
            if (DEBUG) {
              console.error(`error parsing ${item}`, valid.error.message);
              console.error(JSON.stringify(jsondata));
            }
          }
        }
      })
    );
  };

  public getSpeciality = (name: string) => {
    return this.specialities.find((item) => !item.name.localeCompare(name));
  };
}
