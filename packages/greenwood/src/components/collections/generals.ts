import { General } from "../../schemas/generals.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
if (DEBUG) {
  console.log(`DEBUG enabled for ${new URL(import.meta.url).pathname}`);
}

export default class GeneralCollection extends HTMLElement {
  readonly generals = new Array<General>();

  connectedCallback() {
    if (this.innerText.length) {
      const valid = General.array().safeParse(JSON.parse(this.innerText));
      if (valid.success) {
        for (const g of valid.data) {
          this.generals.push(g);
        }
      } else {
        if (DEBUG) {
          console.error(`failed to parse generals`, valid.error.message);
        }
      }
    } else {
      if (DEBUG) {
        console.warn(
          `this element requires JSON encoded text be provided containing the generals`
        );
      }
    }
    if (this.generals.length) {
      this.innerHTML = `
        <span>There are ${this.generals.length} generals</span>
      `;
    }
  }
}
