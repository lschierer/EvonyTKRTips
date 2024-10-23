import {
  nothing,
  unsafeCSS,
  html,
  LitElement,
  type PropertyValues,
  type TemplateResult,
} from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { classMap } from "lit/directives/class-map.js";

import globalStyles from "@styles/global.css?inline";
import topNavStyles from "./top-nav.css?inline";

const DEBUG = true;

@customElement("top-nav")
export class TopNav extends LitElement {
  static styles = [unsafeCSS(globalStyles), unsafeCSS(topNavStyles)];

  @property({ type: String })
  public sitelogofilename: string | undefined = import.meta.env.VITE_SiteLogo;

  @property({ type: String })
  public sitename: string = import.meta.env.VITE_SiteName ?? "";

  @property({ type: String })
  public section: string = "Home";

  @state({})
  private selected: string = "home";

  @property({ type: String })
  public sitesectionsjson: string;

  @state({})
  private SiteSections: string[] = new Array<string>();

  constructor() {
    super();
    this.sitesectionsjson = JSON.stringify({});
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("sitesectionsjson")) {
      this.SiteSections = JSON.parse(this.sitesectionsjson);
    }
  }

  override render() {
    if (DEBUG) {
      console.log(`section is ${this.section}`);
    }

    let SectionTemplates = Array<TemplateResult>();
    if (this.SiteSections.length > 0) {
      this.SiteSections.reverse().map((s) => {
        const dynamicClasses = {
          underline: !s.localeCompare(this.section),
        };
        const sectionLink = `/${s.replaceAll(" ", "").toLowerCase()}/`;
        SectionTemplates.push(html`
          <div
            id="${s.replaceAll(" ", "")}"
            class="${classMap(
              dynamicClasses
            )} v-full items-stretch flex-top-left"
          >
            <span
              class="v-full spectrum-Heading spectrum-Heading--light text-3xl ${classMap(
                dynamicClasses
              )}"
            >
              <a href="${sectionLink}">${s}</a>
            </span>
          </div>
        `);
      });
    }

    const homeClasses = {
      underline: !this.section.localeCompare("Home"),
      "underline-offset-4": !this.section.localeCompare("Home"),
    };
    return html`
      <div id="TopNav" class="bg-SpectrumCyan-700 flex flex-auto gap-8 ">
        <div
          id="LogoContainer"
          class="flex w-3/12 gap-4 items-stretch flex-top-left mx-0.5"
        >
          <div id="Logo" class="flex-1 ">
            ${when(
              this.sitelogofilename !== undefined,
              () => {
                return html`<img src="${this.sitelogofilename!}"></img>`;
              },
              () => nothing
            )}
          </div>
          <div id="home" class="v-full items-stretch flex-top-left ">
            <span
              class="v-full spectrum-Heading spectrum-Heading--light text-3xl ${classMap(
                homeClasses
              )}"
            >
              <a href="/">Home</a>
            </span>
          </div>
        </div>
        <div
          id="SiteSections"
          class="flex-auto grow shrink flex-top-left flex gap-8 v-full flex-row-reverse items-stretch mx-2"
        >
          ${SectionTemplates.length >= 1 ? SectionTemplates : nothing}
        </div>
      </div>
    `;
  }
}
