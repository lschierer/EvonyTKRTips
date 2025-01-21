export const prerender = true;

import collection from "../../assets/collections/generals/collection.ts";

import { General } from "../../schemas/generals.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction("components/collections/generals.ts");

const generals = await Promise.all(
  collection.map(async (gf) => {
    if (DEBUG) {
      console.log(`gf is ${gf}`);
    }
    return await import(`../../assets/collections/generals/${gf}`, {
      with: { type: "json" },
    }).then((jsondata: object) => {
      const keys = Object.keys(jsondata);
      if (keys.includes("default")) {
        const valid = General.safeParse(
          jsondata["default" as keyof typeof jsondata]
        );
        if (valid.success) {
          return valid.data;
        } else {
          if (DEBUG) {
            console.error(`error parsing ${gf}`, valid.error.message);
            console.error(JSON.stringify(jsondata));
          }
        }
      }
      return null;
    });
  })
);

export default class GeneralsCollection extends HTMLElement {
  connectedCallback() {
    if (DEBUG) {
      console.log(
        `getBody generalFiles ${generals.map((g) => g.id).join(" ")}`
      );
    }

    this.innerHTML = `
      <div class="GeneralsCollection">
        <ul>
          ${generals
            .sort((a, b) => {
              if (a) {
                if (b) {
                  return a.id.localeCompare(b.id);
                }
                return -1;
              }
              if (b) {
                return 1;
              }
              return 0;
            })
            .map((g) => `<li>${g.id}</li>`)
            .join(" ")}
        </ul>
      </div>
    `;
  }
}
customElements.define("generals-collection", GeneralsCollection);
