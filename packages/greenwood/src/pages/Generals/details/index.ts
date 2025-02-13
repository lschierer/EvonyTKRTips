export const prerender = false;

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

import { getLayout } from "../../../layouts/standard.ts";

import { getMainSection } from "../../../layouts/general.ts";

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
    if (DEBUG) {
      console.log(`found params ${params}`);
    }
    this._generalName = params.get("name") ?? "";
    if (DEBUG) {
      console.log(`generalName is ${this._generalName}`);
    }
  }

  connectedCallback() {
    if (this._generalName.length == 0) {
      const generals = getAllGenerals();
      this.innerHTML = `
        <div class="indexListing">
          <h2 class="spectrum-Heading spectrum-Heading--sizeXL">Available Generals</h2>
          <ul class="indexListing">
            ${generals
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((g) => {
                return `
                  <li>
                    <a href="./?name=${g.id}" class="spectrum-Link spectrum-Link--quiet spectrum-Link--primary">${g.id}</a>
                  </li>
                `;
              })
              .join(" ")}
          </ul>
        </div>
      `;
    } else {
      const general = getGeneral(this._generalName);
      if (general) {
        this.innerHTML = getMainSection(general);
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
