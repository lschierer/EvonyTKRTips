import fs from "node:fs/promises";
import path from "node:path";

import { General } from "../../schemas/generals.ts";
import collection from "../../assets/collections/generals/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/generals.ts");

export default class GeneralsCollection {
  accessor generals = new Array<General>();

  private computeBasePath = (depth: number) => {
    let bp = "";
    if (depth < 0) {
      throw new Error(`depth must be a positive integer, not ${depth}`);
      return "./";
    }
    if (depth == 0) {
      bp = "./";
    } else {
      while (depth) {
        bp = bp.concat("../");
        depth--;
      }
    }
    if (DEBUG) {
      console.log(`returning bp ${bp}`);
    }
    return bp;
  };
  public initialize = async (depth: number = 2) => {
    await Promise.all(
      collection.map(async (gf) => {
        if (DEBUG) {
          console.log(`gf is ${gf}`);
        }
        const basePath =
          process.env.__GWD_COMMAND__ == "serve"
            ? this.computeBasePath(depth)
            : "../../";
        const filePath = new URL(
          path.join(basePath, `/assets/collections/generals/${gf}`),
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
