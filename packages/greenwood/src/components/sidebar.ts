import { getContentByRoute } from "@greenwood/cli/src/data/client.js";
// getContentByRoute takes a string.

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction("components/sidebar.ts");

import { type Page } from "../lib/greenwoodPages.ts";

export default class SideBar extends HTMLElement {
  /* eslint-disable @typescript-eslint/no-unsafe-call */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  private pages: Page[] = new Array<Page>();

  private _route: string = "";

  private getPages = async () => {
    if (this._route.length > 0) {
      if (DEBUG) {
        console.log(`Sidebar component getPages route ${this._route}`);
      }
      (await getContentByRoute(this._route))
        .sort((a: Page, b: Page) => {
          return a.label.localeCompare(b.label);
        })
        .map((p: Page) => {
          this.pages.push(p);
        });
    } else {
      if (DEBUG) {
        console.log(`Sidebar component getPages has no Route`);
      }
    }
  };

  public async connectedCallback() {
    for (const attr of this.attributes) {
      if (!attr.name.localeCompare("route")) {
        if (DEBUG) {
          console.log(`found route attribute for SideBar component`);
        }
        if (attr.value && attr.value.length > 0) {
          if (DEBUG) {
            console.log(
              `SideBar component route attribute value: '${attr.value}'`
            );
          }
          this._route = attr.value;
          await this.getPages();
          this.innerHTML = `
            <nav>
              <ul>
                ${this.pages
                  .map((p) => {
                    const { title, label, route } = p;
                    return `
                    <li>
                      <a href="${route}">
                        ${title ? title : label}
                      </a>
                    </li>
                  `;
                  })
                  .join("")}
              </ul>
            </nav>
          `;
        } else {
          if (DEBUG) {
            console.log(
              `SideBar component has a route attribute without a value`
            );
          }
          this.innerHTML = `
            <nav>
            </nav>
          `;
        }
        return;
      }
    }
    this.innerHTML = `
      <nav>
        <span>No Route Provided</span>
      </nav>
    `;
  }
}
customElements.define("side-bar", SideBar);
