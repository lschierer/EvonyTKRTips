import { TopLevelSections } from "../lib/topLevelSections.ts";

/* 2 sections for the logo, 2 on the other side for balance. */
const gridColumns = TopLevelSections.options.length + 4;

export default class TopHeader extends HTMLElement {
  connectedCallback() {
    let route = "";
    for (const attr of this.attributes) {
      if (!attr.name.localeCompare("route")) {
        route = attr.value;
      }
    }
    this.innerHTML = `
      <div class="header ">
        <div class="title-wrapper ">
          <a href='/' class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">
            <img src="/assets/TKRTipsLogo.svg" alt="Evony TKR Tips" class="logo"/>
          </a><a href='/' class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary">
            <h1 class="logo spectrum-Heading spectrum-Heading--sizeXXXL">Evony TKR Tips</h1>
          </a> <!-- done as two links so that the page flows right -->
        </div>
        <div class="nav">
          ${TopLevelSections.options
            .sort()
            .map((section) => {
              const urlString = "/" + section.replaceAll(" ", "") + "/";
              const selected = route.startsWith(urlString);

              const navItemClass = selected ? "navItem selected" : "navItem";
              return `
              <div class="${navItemClass}">
                <a
                  href=${urlString}
                  class="spectrum-Link spectrum-Link--quiet spectrum-Link--primary"
                >
                  <span class="">${section.replaceAll("_", " ")}</span>
                </a>
              </div>
              `;
            })
            .join("")}
        </div>
        <div class=" social-icons">
          <SocialIcons {...Astro.props} />
        </div>
      </div>
      <style>
        div.header {
          grid-template-columns: repeat(${gridColumns}, 1fr);
        }
        div.nav {
          grid-column-end: ${3 + TopLevelSections.options.length};
        }
        div.social-icons {
        grid-column-start: ${3 + TopLevelSections.options.length};
        }
      </style>
    `;
  }
}
customElements.define("top-header", TopHeader);
