import {
  getContentByRoute,
  getContent,
} from "@greenwood/cli/src/data/client.js";
// getContentByRoute takes a string.

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction("components/sidebar.ts");

import { type Page, type SideBarEntry } from "../lib/greenwoodPages.ts";

export default class SideBar extends HTMLElement {
  private pages = new Array<Page>();

  private _route: string = "";

  private getPages = async () => {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    (await getContent())
      .sort((a: Page, b: Page) => {
        return a.route.localeCompare(b.route);
      })
      .map((p: Page) => this.pages.push(p));
  };

  private buildTree = async (pages: string[]) => {
    const routePage = (await getContentByRoute("/"))
      .sort((a: Page, b: Page) => {
        return a.route.localeCompare(b.route);
      })
      .find((p: Page) => !p.route.localeCompare("/")) as Page;

    const name = routePage.title
      ? (routePage.title ?? routePage.label)
      : routePage.label;
    console.log(`root name should be ${name}`);
    const root: SideBarEntry = {
      name: name,
      route: "/",
      children: new Array<SideBarEntry>(),
    };

    for (const page of pages) {
      if (!page.localeCompare("/404/")) {
        continue;
      }

      //.filter(Boolean) is a concise way to remove falsy values from an array.
      // a split() will have false values if it doesn't find any matches
      // (and maybe if the split character is the last one?)
      const segments = page.split("/").filter(Boolean);
      let currentNode = root;

      for (const segment of segments) {
        if (DEBUG) {
          console.log(`inspecting ${segment}`);
        }
        let childNode = currentNode.children.find(
          (node) => node.name === segment
        );

        if (!childNode) {
          childNode = { name: segment, route: page, children: [] };
          currentNode.children.push(childNode);
        } else {
          if (DEBUG) {
            console.log(
              `childNode ${JSON.stringify(childNode)} is not a child`
            );
          }
        }

        currentNode = childNode;
      }
    }

    return root.children;
  };

  private renderTreeNode = (node: SideBarEntry) => {
    let childtemplate = "";
    if (node.children.length > 0) {
      childtemplate = `
        <ul>
          ${node.children
            .map((c) => {
              return this.renderTreeNode(c);
            })
            .join("")}
        </ul>
      `;
    }
    return `
        <li>
          <a href="${node.route}">
            ${node.name}
          </a>
          ${childtemplate}
        </li>
      `;
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
          const sb = await this.buildTree(this.pages.map((p) => p.route));
          console.log(JSON.stringify(sb));
          this.innerHTML = `
            <nav>
              <ul>
                ${sb
                  .map((e) => {
                    return this.renderTreeNode(e);
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
