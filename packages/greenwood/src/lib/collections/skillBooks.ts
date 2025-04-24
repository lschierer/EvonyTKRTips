import fs from "node:fs/promises";
import path from "node:path";

import { SkillBooks } from "@evonytkrtips/schemas";
import collection from "../../assets/collections/skillBooks/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/skillBooks.ts");

export default class SkillBooksCollection {
  accessor skillbooks = new Array<SkillBooks.SkillBook>();

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
          path.join(basePath, `/assets/collections/skillBooks/${item}`),
          import.meta.url
        );
        const jsondata = await fs
          .readFile(filePath, {
            encoding: "utf-8",
          })
          .catch((error: unknown) => {
            console.error(
              `failed to load skillBook file for ${item}`,
              `error is ${JSON.stringify(error)}`
            );
          });

        if (jsondata) {
          const valid = SkillBooks.SkillBook.safeParse(JSON.parse(jsondata));
          if (valid.success) {
            this.skillbooks.push(valid.data);
          } else {
            if (DEBUG) {
              console.error(`error parsing ${item}`, valid.error.message);
              console.error(JSON.stringify(jsondata));
            }
          }
        } else {
          if (DEBUG) {
            console.error(`fs.readfile returned "${JSON.stringify(jsondata)}"`);
          }
        }
      })
    );
  };

  public getSkillBook = (name: string) => {
    return this.skillbooks.find((item) => !item.name.localeCompare(name));
  };
}
