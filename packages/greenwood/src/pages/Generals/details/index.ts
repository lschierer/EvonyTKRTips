export const prerender = false;
export const isolation = true;

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

import { getLayout } from "../../../layouts/standard.ts";

import { getMainSection } from "../../../layouts/general.ts";

import GeneralsCollection from "../../../lib/collections/generals.ts";

export default class GeneralDetailsPage extends HTMLElement {
  private _generalName: string = "";
  private generalsCollection = new GeneralsCollection();
  private myRoot = "./";
  constructor(request: Request) {
    super();

    if (request.url.includes("?")) {
      const params = new URLSearchParams(
        request.url.slice(request.url.indexOf("?"))
      );
      if (DEBUG) {
        console.log(`found params ${params}`);
      }
      this._generalName = params.has("name")
        ? (params.get("name") ?? "Unnamed General")
        : "";
      if (DEBUG) {
        console.log(`generalName is ${this._generalName}`);
      }
    } else {
      if (DEBUG) {
        console.log(`_generalName has length ${this._generalName.length}`);
      }
    }
  }

  connectedCallback = async () => {
    let parent = this.parentNode;
    while (parent && parent.nodeType !== Node.DOCUMENT_NODE) {
      if (DEBUG) {
        console.log(`found parent node type ${parent.nodeType}`);
      }
      parent = parent.parentNode;
    }
    if (parent) {
      if (DEBUG) {
        console.log(`found parent!`);
      }
      this.myRoot = (parent as Document).location.pathname;
    } else {
      console.log(`no parent`);
    }
    if (DEBUG) {
      console.log(`myRoot is '${this.myRoot}'`);
    }
    await this.generalsCollection.initialize();

    if (this._generalName.length == 0) {
      const generals = this.generalsCollection.generals;
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
      const general = this.generalsCollection.getGeneral(this._generalName);
      if (general) {
        this.innerHTML = getMainSection(general);
      } else {
        this.innerHTML = `${this._generalName} Not Found`;
      }
    }
  };
}

function getFrontmatter() {
  return {
    title: "General Details",
    author: "Luke Schierer",
    tableOfContents: false,
  };
}

export { getFrontmatter, getLayout };
