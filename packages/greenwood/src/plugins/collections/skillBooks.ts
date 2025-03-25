import type { SourcePlugin, ExternalSourcePage } from "@greenwood/cli";

import fs from "node:fs/promises";
import path from "node:path";

import { SkillBook } from "../../schemas/skillBooks.ts";

import collection from "../../assets/collections/generals/collection.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

export const SkillBookSourcePlugin = (): SourcePlugin => {
  return {
    type: "source",
    name: "source-plugin-external-general-page",
    provider: (): (() => Promise<ExternalSourcePage[]>) => {
      return async function () {
        const returnPages = new Array<ExternalSourcePage>();
        const allItems = new Array<SkillBook>();
        await Promise.all(
          collection.map(async (item_file) => {
            if (DEBUG) {
              console.log(`item file item_file is ${item_file}`);
            }

            const basePath = "../../assets/collections/skillbooks/";

            const filePath = new URL(
              path.join(basePath, item_file),
              import.meta.url
            );
            if (DEBUG) {
              console.log(`filePath is ${filePath.pathname}`);
            }

            const data = await fs
              .readFile(filePath, {
                encoding: "utf8",
              })
              .catch((error: unknown) => {
                if (DEBUG) {
                  console.error(
                    `error reading file ${filePath.pathname} for ${item_file} with error ${JSON.stringify(error)}`
                  );
                }
              });
            if (data) {
              const valid = SkillBook.safeParse(JSON.parse(data));
              if (valid.success) {
                allItems.push(valid.data);
              } else {
                if (DEBUG) {
                  console.error(
                    `failed to parse general data for ${item_file}`,
                    valid.error.message
                  );
                }
              }
            }
          })
        );
        for (const item of allItems) {
          const jsonText = JSON.stringify(item);
          const page: ExternalSourcePage = {
            title: `Details for ${item.name}`,
            route: `/Generals/details/${encodeURIComponent(item.name)}/`,
            collection: ["skillbooks"],
            imports: ["/components/skillbooks/DetailsDisplay.ts type=module"],
            data: {
              skillbook: jsonText,
            },
            body: `
              <h2>${item.name}</h2>
              <details-display general="${encodeURIComponent(jsonText)}"></details-display>
            `,
          };
          if (DEBUG) {
            console.log(`created page ${page.title}`);
          }
          returnPages.push(page);
        }
        return returnPages;
      };
    },
  };
};
