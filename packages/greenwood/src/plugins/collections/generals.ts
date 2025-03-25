import type { SourcePlugin, ExternalSourcePage } from "@greenwood/cli";

import fs from "node:fs/promises";
import path from "node:path";

import { General } from "../../schemas/generals.ts";

import collection from "../../assets/collections/generals/collection.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

export const GeneralSourcePlugin = (): SourcePlugin => {
  const pluginKeySinglular = "General";
  const pluginKeyPlural = "Generals";
  return {
    type: "source",
    name: `source-plugin-external-${pluginKeySinglular.toLowerCase()}-page`,
    provider: (): (() => Promise<ExternalSourcePage[]>) => {
      return async function () {
        const returnPages = new Array<ExternalSourcePage>();
        const allItems = new Array<General>();
        await Promise.all(
          collection.map(async (item_file) => {
            if (DEBUG) {
              console.log(`item file item_file is ${item_file}`);
            }

            const basePath = `../../assets/collections/${pluginKeyPlural.toLowerCase()}/`;

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
              const valid = General.safeParse(JSON.parse(data));
              if (valid.success) {
                allItems.push(valid.data);
              } else {
                if (DEBUG) {
                  console.error(
                    `failed to parse ${pluginKeySinglular} data for ${item_file}`,
                    valid.error.message
                  );
                }
              }
            }
          })
        );
        for (const item of allItems) {
          const route = encodeURI(`/${pluginKeyPlural}/details/${item.name}/`);
          const jsonText = JSON.stringify(item);
          const page: ExternalSourcePage = {
            title: `Details for ${item.name}`,
            route,
            collection: [pluginKeyPlural.toLowerCase()],
            imports: [
              `/components/${pluginKeyPlural.toLowerCase()}/DetailsDisplay.ts type=module`,
            ],
            data: {
              general: jsonText,
            },
            body: `
              <details-display ${pluginKeySinglular.toLowerCase()}="${encodeURIComponent(jsonText)}"></details-display>
            `,
          };
          if (DEBUG) {
            console.log(`created ${pluginKeySinglular} page ${page.title}`);
          }
          returnPages.push(page);
        }
        return returnPages;
      };
    },
  };
};
