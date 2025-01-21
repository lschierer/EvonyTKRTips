export const prerender = true;

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction("components/collections/generals.ts");

import { getGeneral, getAllGenerals } from "../../lib/collections/generals.ts";

export default class GeneralsCollection extends HTMLElement {
  connectedCallback() {
    const generals = getAllGenerals();
    if (DEBUG) {
      console.log(
        `getBody generalFiles ${generals.map((g) => g.id).join(" ")}`
      );
    }
    const attributes = this.getAttributeNames();
    if (attributes.includes("general")) {
      const generalAttribute = this.getAttribute("general");
      if (generalAttribute) {
        const general = getGeneral(generalAttribute);
        if (general) {
          this.innerText = JSON.stringify(general);
        }
      }
    } else {
      this.innerHTML = `
        <div class="GeneralsCollection">
          <ul>
            ${generals
              .sort((a, b) => {
                return a.id.localeCompare(b.id);
              })
              .map((g) => `<li>${g.id}</li>`)
              .join(" ")}
          </ul>
        </div>
      `;
    }
  }
}
customElements.define("generals-collection", GeneralsCollection);
