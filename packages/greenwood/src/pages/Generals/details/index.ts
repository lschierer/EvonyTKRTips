export const prerender = true;

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

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
        <!doctype html>
        <html>
          <head>

          </head>
          <body>
            <h1>Available Generals</h1>
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
          </body>
        </html>
      `;
    } else {
      const general = getGeneral(this._generalName);
      if (general) {
        this.innerHTML = `
          <!doctype html>
          <html>
            <head>
              <title>${general.id}</title>
            </head>
            <body>
              <p>
                ${JSON.stringify(general)}
              </p>
            </body>
          </html>
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

export { getFrontmatter };
