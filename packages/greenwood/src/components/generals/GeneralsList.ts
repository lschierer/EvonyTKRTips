import { getContentByCollection } from "@greenwood/cli/src/data/client.js";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

import { type General } from "../../schemas/generals.ts";

export default class GeneralsList extends HTMLElement {
  async connectedCallback() {
    // Define a type guard to check if the page has general data

    const generals = (await getContentByCollection("generals"))
      .map((generalPage) => {
        if (generalPage.data) {
          if (Object.keys(generalPage.data).includes("general")) {
            return JSON.parse(
              generalPage.data["general" as keyof typeof generalPage.data]
            ) as General;
          }
        }
        return null;
      })
      .filter((general): general is General => general !== null);
    if (DEBUG) {
      console.log(`collection has ${generals.length} generals.`);
    }
    this.innerHTML = `
      <div class="indexListing">
        <ol class="indexListing">
          ${generals
            .sort((a, b) => a.id.localeCompare(b.id))
            .map((g) => {
              return `
                <li>
                  <a href="./${g.id}/" class="spectrum-Link spectrum-Link--quiet spectrum-Link--primary">${g.id}</a>
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
