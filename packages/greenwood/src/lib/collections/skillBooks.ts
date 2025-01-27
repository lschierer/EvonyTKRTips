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
    await import(`../../assets/collections/skillBooks/${item}`, {
      with: { type: "json" },
    })
      .then((jsondata: object) => {
        const keys = Object.keys(jsondata);
        if (keys.includes("default")) {
          const valid = SkillBook.safeParse(
            jsondata["default" as keyof typeof jsondata]
          );
          if (valid.success) {
            skillBooks.push(valid.data);
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
          `failed to load skillBook file for ${item}`,
          `error is ${JSON.stringify(error)}`
        );
      });
  })
);

export const getAllSkillBooks: () => SkillBook[] = () => {
  return [...skillBooks];
};

export const getSkillBook = (name: string) => {
  return skillBooks.find((item) => !item.name.localeCompare(name));
};
