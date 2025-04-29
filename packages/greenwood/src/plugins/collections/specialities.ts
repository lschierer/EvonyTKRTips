import type { SourcePlugin, ExternalSourcePage } from "@greenwood/cli";

import { Specialities } from "@evonytkrtips/schemas";

import collection from "@evonytkrtips/assets/collections/specialities";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

export const SpecialitySourcePlugin = (): SourcePlugin => {
  const pluginKeySinglular = "Speciality";
  const pluginKeyPlural = "Specialities";
  return {
    type: "source",
    name: `source-plugin-external-${pluginKeySinglular.toLowerCase()}-page`,
    provider: (): (() => Promise<ExternalSourcePage[]>) => {
      return async function () {
        const returnPages = new Array<ExternalSourcePage>();
        const allItems = new Array<Specialities.Speciality>();
        await Promise.all(
          collection.map(async (item_file) => {
            if (DEBUG) {
              console.log(`item file item_file is ${item_file}`);
            }

            const filePath = `@evonytkrtips/assets/collections/${pluginKeyPlural.toLowerCase()}/${item_file}`;

            if (DEBUG) {
              console.log(`filePath is ${filePath}`);
            }
            let data = (await import(filePath, {
              with: { type: "json" },
            })) as object;

            if ("default" in data) {
              data = data.default as object;
            }
            const valid = Specialities.Speciality.safeParse(data);
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
          const route = `/Reference/${pluginKeyPlural}/${item.name}/`;
          const jsonText = JSON.stringify(item);
          const page: ExternalSourcePage = {
            title: `Details for ${item.name}`,
            route,
            collection: [pluginKeyPlural.toLowerCase()],
            imports: [
              `/components/${pluginKeyPlural.toLowerCase()}/DetailsDisplay.ts type="module"`,
              '/components/common/BaseDetailsDisplay.ts type="module"',
            ],
            data: {
              speciality: jsonText,
            },
            body: `
              <speciality-details ${pluginKeySinglular.toLowerCase()}="${encodeURIComponent(jsonText)}"></speciality-details>
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
