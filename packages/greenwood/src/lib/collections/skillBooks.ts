import fs from "node:fs/promises";

import { SkillBook } from "../../schemas/skillBooks.ts";
import collection from "../../assets/collections/skillBooks/collection.ts";

import debugFunction from "../debug.ts";
const DEBUG = debugFunction("lib/collections/skillBooks.ts");

const skillBooks = new Array<SkillBook>();
await Promise.all(
  collection.map(async (item) => {
    if (DEBUG) {
      console.log(`item is ${item}`);
    }
    const filePath = new URL(
      `../../assets/collections/skillBooks/${item}`,
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
      const valid = SkillBook.safeParse(JSON.parse(jsondata));
      if (valid.success) {
        skillBooks.push(valid.data);
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

export const getAllSkillBooks: () => SkillBook[] = () => {
  return [...skillBooks];
};

export const getSkillBook = (name: string) => {
  return skillBooks.find((item) => !item.name.localeCompare(name));
};
