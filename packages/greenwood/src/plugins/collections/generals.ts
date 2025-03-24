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

export const GedcomGeneralSourcePlugin = (): SourcePlugin => {
  return {
    type: "source",
    name: "source-plugin-external-general-page",
    provider: (): (() => Promise<ExternalSourcePage[]>) => {
      return async function () {
        const returnPages = new Array<ExternalSourcePage>();
        const allGenerals = new Array<General>();
        await Promise.all(
          collection.map(async (gf) => {
            if (DEBUG) {
              console.log(`general file gf is ${gf}`);
            }

            const basePath = "../../assets/collections/generals/";

            const filePath = new URL(path.join(basePath, gf), import.meta.url);
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
                    `error reading file ${filePath.pathname} for ${gf} with error ${JSON.stringify(error)}`
                  );
                }
              });
            if (data) {
              const valid = General.safeParse(JSON.parse(data));
              if (valid.success) {
                allGenerals.push(valid.data);
              } else {
                if (DEBUG) {
                  console.error(
                    `failed to parse general data for ${gf}`,
                    valid.error.message
                  );
                }
              }
            }
          })
        );
        for (const general of allGenerals) {
          const page: ExternalSourcePage = {
            title: `Details for ${general.id}`,
            route: `/Generals/details/${encodeURIComponent(general.id)}/`,
            layout: "generals",
            collection: ["generals"],
            imports: ["/components/generals/DetailsDisplay.ts type=module"],
            data: {
              general: JSON.stringify(general),
            },
            body: `
              <h2>${general.id}</h2>

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
