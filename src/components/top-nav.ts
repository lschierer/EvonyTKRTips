import { nothing, unsafeCSS, html, LitElement, type PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { when } from "lit/directives/when.js";

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

  override render() {
    return html`
      <div id="TopNav" class="bg-SpectrumCyan-700 flex">
        <div id="LogoContainer" class="flex items-stretch flex-top-left">
          <div id="Logo" class="flex-1">
            ${when(
              this.SiteLogoFilename !== undefined,
              () => {
                return html`<img src="${this.SiteLogoFilename}"></img>`;
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
      </div>
    `;
  }
}
