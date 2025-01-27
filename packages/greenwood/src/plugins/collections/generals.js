import { General } from "../../schemas/generals";
import collection from "../../assets/collections/generals/collection";

import debugFunction from "../../lib/debug";
const DEBUG = debugFunction("plugins/collections/generals");

export const GeneralsSourcesPlugin = () => {
  return {
    type: "source",
    name: "source-plugin-generals",
    provider: () => {
      return async function () {
        const generals = [];
        await Promise.all(
          collection.map(async (item) => {
            if (DEBUG) {
              console.log(`item is ${item}`);
            }
            await import(`../../assets/collections/generals/${item}`, {
              with: { type: "json" },
            })
              .then((jsonData) => {
                const keys = Object.keys(jsonData);
                if (keys.includes("default")) {
                  const valid = General.safeParse(jsonData["default"]);
                  if (valid.success) {
                    generals.push(valid.data);
                  } else {
                    if (DEBUG) {
                      console.error(
                        `error parsing ${item}, `,
                        valid.error.message
                      );
                      console.error(JSON.stringify(jsonData));
                    }
                  }
                }
              })
              .catch((error) => {
                console.error(
                  `failed to load file for ${item}, `,
                  `error is: `,
                  JSON.stringify(error)
                );
              });
          })
        );
        return generals.map((item) => {
          const id = item.id;
          const route = `/generals/details/${id.toLowerCase()}/`;

          return {
            title: id,
            body: getBody(item),
            route,
            id,
            label: id,
          };
        });
      };
    },
  };
};

const getBody = (general) => {
  return `
    <h2 class="spectrum-Heading spectrum-Heading--sizeM">
     ${general.id}
    </h2>
  `;
};
