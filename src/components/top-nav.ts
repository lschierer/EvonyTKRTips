import { nothing, unsafeCSS, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";
import { classMap } from "lit/directives/class-map.js";

import globalStyles from "@styles/global.css?inline";
import topNavStyles from "./top-nav.css?inline";

@customElement("top-nav")
export class TopNav extends LitElement {
  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
  }

  static styles = [unsafeCSS(globalStyles), unsafeCSS(topNavStyles)];

  @property({ type: String })
  public SiteLogoFilename: string | undefined = import.meta.env.VITE_SiteLogo;

  @property({ type: String })
  public SiteName: string = import.meta.env.VITE_SiteName ?? "";

  @state({ type: String })
  private Selected: string = "home";

  @property({ type: Array })
  public SiteSections: string[] = new Array<string>();

  override render() {
    let SectionTemplate = html``;
    this.SiteSections.forEach((section) => {
      const dynamicClasses = {
        selected: !section.localeCompare(this.Selected),
      };
      const sectionLink = `/${section.replaceAll(" ", "").toLowerCase()}/`;
      SectionTemplate = html`${SectionTemplate}
        <div
          id="${section.replaceAll(" ", "")}"
          class="${classMap(dynamicClasses)} v-full items-stretch flex-top-left"
        >
          <span
            class="v-full spectrum-Heading spectrum-Heading--light text-4xl"
          >
            <a href="${sectionLink}">${section}</a>
          </span>
        </div> `;
    });

    return html`
      <div id="TopNav" class="bg-SpectrumCyan-700 flex">
        <div id="LogoContainer" class="flex items-stretch flex-top-left">
          <div id="Logo" class="flex-1">
            ${when(
              this.SiteLogoFilename !== undefined,
              () => {
                return html`<img src="${this.SiteLogoFilename!}"></img>`;
              },
              () => nothing
            )}
          </div>
          <div id="home" class=" v-full items-stretch flex-top-left">
            <span
              class="v-full spectrum-Heading spectrum-Heading--light text-4xl"
            >
              <a href="/">Home</a>
            </span>
          </div>
        </div>
        <div id="SiteSections" class="flex items-stretch flex-top-right">
          ${SectionTemplate}
        </div>
      </div>
    `;
  }
}
