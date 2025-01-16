export const prerender = true;

import collection from "../../assets/collections/generals/collection.ts";

import { General } from "../../schemas/generals.ts";

const DEBUG = true;

const generals = await Promise.all(
  collection.map(async (gf) => {
    if (DEBUG) {
      console.log(`gf is ${gf}`);
    }
    const jsondata = await import(`../../assets/collections/generals/${gf}`, {
      with: { type: "json" },
    });
    if (jsondata) {
      const valid = General.safeParse(jsondata.default);
      if (valid.success) {
        return valid.data;
      } else {
        if (DEBUG) {
          console.error(`error parsing ${gf}`, valid.error.message);
          console.error(JSON.stringify(jsondata));
        }
      }
    } else {
      console.error(`jsondata is undefined for ${gf}`);
    }

    return undefined;
  })
);

export default class GeneralsCollection extends HTMLElement {
  connectedCallback() {
    if (DEBUG) {
      console.log(
        `getBody generalFiles ${generals.map((g) => g.id).join(" ")}`
      );
    }

    this.innerHTML = `<div class="GeneralsCollection">${generals.map((g) => g.id).join(" ")}</div>`;
  }
}
customElements.define("generals-collection", GeneralsCollection);
