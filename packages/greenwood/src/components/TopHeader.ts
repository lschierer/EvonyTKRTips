import { TopLevelSections } from "../lib/topLevelSections.ts";

/* 2 sections for the logo, 2 on the other side for balance. */
const gridColumns = TopLevelSections.options.length + 4;
import "iconify-icon";

export default class TopHeader extends HTMLElement {
  private logo = "/assets/TKRTipsLogo.svg";
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
            <img src="${this.logo}" alt="Evony TKR Tips" class="logo micro-5-regular"/>
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
        <div class="rightside">
          <div class="SocialIcons">
            <a
              class="spectrum-Link spectrum-Link--quiet spectrum-Link--secondary"
              href="https://github.com/lschierer/EvonyTKRTips">
              <iconify-icon
                icon="ion:logo-github" role="img"
                class="repoIcon"
                height="1.75rem"
                >
              </iconify-icon>
            </a>
          </div>
          <div class="themeSelector">
            <!-- this will be filled in by the theme component -->
          </div>
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
