import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

import collections from "../../lib/state/collections.ts";

export default class GeneralsList extends HTMLElement {
  async connectedCallback() {
    // Define a type guard to check if the page has general data

    await collections.generals.initialize();
    const generals = collections.generals.get_all();

    if (DEBUG) {
      console.log(`collection has ${generals.length} generals.`);
    }
    this.innerHTML = `
      <div class="indexListing">
        <ol class="indexListing">
          ${generals
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((g) => {
              return `
                <li>
                  <a href="./${g.name}/" class="spectrum-Link spectrum-Link--quiet spectrum-Link--primary">${g.name}</a>
                </li>
              `;
            })
            .join(" ")}
        </ol>
      </div>
    `;
  }
}
customElements.define("generals-list", GeneralsList);
