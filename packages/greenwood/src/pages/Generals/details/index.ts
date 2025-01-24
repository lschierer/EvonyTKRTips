export const prerender = true;

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

import { getLayout } from "../../../layouts/standard.ts";

import {
  getGeneral,
  getAllGenerals,
} from "../../../lib/collections/generals.ts";

export default class GeneralDetailsPage extends HTMLElement {
  private _generalName: string = "";
  constructor(request: Request) {
    super();
    if (DEBUG) {
      console.log(
        `GeneralDetailsPage constructor`,
        `request is ${JSON.stringify(request)}`
      );
    }

    const params = new URLSearchParams(
      request.url.slice(request.url.indexOf("?"))
    );
    this._generalName = params.get("name") ?? "";
  }

  connectedCallback() {
    if (this._generalName.length == 0) {
      const generals = getAllGenerals();
      this.innerHTML = `

            <h2 class="spectrum-Heading spectrum-Heading--sizeXL">Available Generals</h2>
            <ul>
              ${generals
                .map((g) => {
                  return `
                  <li>
                    <a href="./?name=${g.id}">${g.id}</a>
                  </li>
                `;
                })
                .join(" ")}
            </ul>

      `;
    } else {
      const general = getGeneral(this._generalName);
      if (general) {
        this.innerHTML = `

              <p>
                ${JSON.stringify(general)}
              </p>
        `;
      } else {
        this.innerHTML = `${this._generalName} Not Found`;
      }
    }
  }
}

function getFrontmatter() {
  return {
    title: "General Details",
    author: "Luke Schierer",
    tableOfContents: false,
  };
}

export { getFrontmatter, getLayout };
