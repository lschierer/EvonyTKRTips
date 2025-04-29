import type { SourcePlugin, ExternalSourcePage } from "@greenwood/cli";

import { Ascending } from "@evonytkrtips/schemas";

import collection from "@evonytkrtips/assets/collections/specialities";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

export const AscendingSourcePlugin = (): SourcePlugin => {
  const pluginKeySinglular = "Ascending Attribute";
  const pluginKeyPlural = "Ascending Attributes";
  return {
    type: "source",
    name: `source-plugin-external-${pluginKeySinglular.toLowerCase()}-page`,
    provider: (): (() => Promise<ExternalSourcePage[]>) => {
      return async function () {
        const returnPages = new Array<ExternalSourcePage>();
        const allItems = new Array<Ascending.GeneralAscending>();
        await Promise.all(
          collection.map(async (item_file) => {
            if (DEBUG) {
              console.log(`item file item_file is ${item_file}`);
            }

            const filePath = `@evonytkrtips/assets/collections/${pluginKeyPlural.toLowerCase().replaceAll(" ", "")}/${item_file}`;

            if (DEBUG) {
              console.log(`filePath is ${filePath}`);
            }
            let data = (await import(filePath, {
              with: { type: "json" },
            })) as object;

            if ("default" in data) {
              data = data.default as object;
            }
            const valid = Ascending.GeneralAscending.safeParse(data);
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
          })
        );
        for (const item of allItems) {
          // Use a simple string without encoding for the route
          const route = `/Reference/${pluginKeyPlural}/${item.general}/`;
          const jsonText = JSON.stringify(item);
          const page: ExternalSourcePage = {
            title: `Details for ${item.general}`,
            route,
            collection: [pluginKeyPlural.toLowerCase()],
            imports: [
              `/components/${pluginKeyPlural.toLowerCase().replaceAll(" ", "")}/DetailsDisplay.ts type="module"`,
            ],
            data: {
              speciality: jsonText,
            },
            body: `
              <ascendingattribute-details ${pluginKeySinglular.toLowerCase().replaceAll(" ", "")}="${encodeURIComponent(jsonText)}"></ascendingattribute-details>
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
