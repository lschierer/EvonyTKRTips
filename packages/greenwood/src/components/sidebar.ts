import {
  getContentByRoute,
  getContent,
} from "@greenwood/cli/src/data/client.js";
// getContentByRoute takes a string.

import debugFunction from "../lib/debug.ts";
const DEBUG = debugFunction("components/sidebar.ts");

import {
  type Page,
  type SideBarEntry,
  sortPages,
} from "../lib/greenwoodPages.ts";

import SpectrumCSSSideNav from "@spectrum-css/sidenav/index.css" with { type: "css" };
import LocalSidebarCSS from "../styles/sidebar.css" with { type: "css" };

export default class SideBar extends HTMLElement {
  private pages = new Array<Page>();

  private _route: string = "";

  private getPages = async () => {
    /* eslint-disable @typescript-eslint/no-unsafe-call */
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    (await getContent())
      .sort((a: Page, b: Page) => sortPages(a, b))
      .map((p: Page) => this.pages.push(p));
    if (DEBUG) {
      console.log(
        `sorted pages is: \n ${this.pages.map((p) => p.route).join("\n")}`
      );
    }
  };

  private buildTree = async (pages: Page[]) => {
    const routePage = (await getContentByRoute("/"))
      .sort((a: Page, b: Page) => {
        return a.route.localeCompare(b.route);
      })
      .find((p: Page) => !p.route.localeCompare("/")) as Page;

    const name = routePage.title
      ? (routePage.title ?? routePage.label)
      : routePage.label;
    if (DEBUG) {
      console.log(`root name should be '${name}'`);
    }
    const root: SideBarEntry = {
      name: name,
      route: "/",
      children: new Array<SideBarEntry>(),
    };

    for (const page of pages) {
      if (!page.route.localeCompare("/404/")) {
        continue;
      }

      const pageName = page.title ? page.title : page.label;
      if (DEBUG) {
        console.log(
          `buildTree outer loop for '${pageName}' route ${page.route}`
        );
      }

      //.filter(Boolean) is a concise way to remove falsy values from an array.
      // a split() will have false values if it doesn't find any matches
      // (and maybe if the split character is the last one?)
      const segments = page.route.split("/").filter(Boolean);
      let currentNode = root;

      segments.forEach((segment, index) => {
        if (DEBUG) {
          console.log(`segment is ${segment} at index ${index} `);
        }

        const segmentRoute = `${currentNode.route}${segment}/`;
        if (DEBUG) {
          console.log(`segmentRoute is ${segmentRoute}`);
        }
        let childNode = currentNode.children.find((node) => {
          if (!node.route.localeCompare(segmentRoute)) {
            return true;
          } else if (!node.name.localeCompare(segment)) {
            return true;
          }
          return false;
        });

        if (!childNode) {
          if (DEBUG) {
            console.log(
              `pushing route ${page.route} as child of ${currentNode.route} in segment loop ${segment}`
            );
          }
          if (!page.route.localeCompare(segmentRoute)) {
            childNode = { name: pageName, route: page.route, children: [] };
          } else {
            childNode = { name: segment, route: page.route, children: [] };
          }

          currentNode.children.push(childNode);
        } else {
          if (!childNode.route.localeCompare(page.route)) {
            if (DEBUG) {
              console.log(`replacing name for ${segment}`);
            }
            childNode.name = page.title ? page.title : page.label;
          } else {
            if (DEBUG) {
              console.log(
                `unmatched childnode route ${childNode.route} in loop ${index} for ${page.route}`
              );
            }
          }
        }

        currentNode = childNode;
      });
    }

    return root.children;
  };

  private renderTreeNode = (node: SideBarEntry) => {
    let childtemplate = "";

    if (node.children.length > 0) {
      childtemplate = `
        <ul class="spectrum-SideNav">
          ${node.children
            .map((c) => {
              return this.renderTreeNode(c);
            })
            .join("")}
        </ul>
      `;
    }
    if (!node.route.localeCompare(this._route)) {
      return `
          <li class="spectrum-SideNav-item is-selected">
            <a class="spectrum-SideNav-itemLink">
              <span class="spectrum-SideNav-link-text">${node.name}</span>
            </a>
            ${childtemplate}
          </li>
        `;
    }
    return `
        <li class="spectrum-SideNav-item">
          <a href="${node.route}" class="spectrum-SideNav-itemLink">
            <span class="spectrum-SideNav-link-text">${node.name}</span>
          </a>
          ${childtemplate}
        </li>
      `;
  };

  private _stylesLoaded: boolean = false;
  private loadStyles = () => {
    if (!this._stylesLoaded) {
      document.adoptedStyleSheets = [
        ...document.adoptedStyleSheets,
        SpectrumCSSSideNav,
        LocalSidebarCSS,
      ];
      this._stylesLoaded = true;
    }
  };
  public async connectedCallback() {
    this.loadStyles();
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
          const sb = await this.buildTree(this.pages);
          this.innerHTML = `
            <nav>
              <ul class="spectrum-SideNav spectrum-SideNav--multiLevel">
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
