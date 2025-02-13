import fs from "node:fs/promises";
import path from "node:path";

import { GeneralAscending } from "../../schemas/ascending.ts";
import collection from "../../assets/collections/ascendingAttributes/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/ascendingAttributes.ts");

export default class AscendingAttributesCollection {
  accessor ascendingAttributes = new Array<GeneralAscending>();

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
          path.join(
            basePath,
            `/assets/collections/ascendingAttributes/${item}`
          ),
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
            this.ascendingAttributes.push(valid.data);
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
  };

  public getAscendingAttributes = (name: string) => {
    return this.ascendingAttributes.find(
      (item) => !item.general.localeCompare(name)
    );
  };
}
