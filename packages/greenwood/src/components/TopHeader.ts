import { TopLevelSections } from "../lib/topLevelSections.ts";

/* 2 sections for the logo, 2 on the other side for balance. */
const gridColumns = TopLevelSections.options.length + 4;

export default class TopHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <div class="header ">
        <div class="title-wrapper ">
          <img src="/assets/TKRTipsLogo.svg" alt="Evony TKR Tips" class="logo"/>
          <h1 class="logo spectrum-Heading spectrum-Heading--sizeXXXL">Evony TKR Tips</h1>
        </div>
        <div class="nav">
          ${TopLevelSections.options
            .sort()
            .map((section) => {
              return `
              <div class="navItem">
                <a
                  href=${"/" + section.replaceAll(" ", "") + "/"}
                  class="spectrum-Link spectrum-Link--primary"
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
