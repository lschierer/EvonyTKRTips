import {
  nothing,
  css,
  html,
  LitElement,
  unsafeCSS,
  type PropertyValues,
} from "lit";
import { when } from "lit/directives/when.js";

import { customElement, property, state } from "lit/decorators.js";
import globalTailwind from "@styles/base.css?inline";

const DEBUG = 1;

@customElement("top-bar")
export class TopBar extends LitElement {
  @property({ type: String })
  public siteURL: string = "http://localhost/";

  @property({ type: String })
  public siteLogoFilename: string = import.meta.env.VITE_SiteLogo;

  @state()
  private logoUrl: string | undefined = undefined;

  @property({ type: String })
  public siteLogoText: string = import.meta.env.VITE_SiteName;

  @property({ type: String })
  public pageTitle: string = "";

  static override styles = [
    unsafeCSS(globalTailwind),
    css`
      /*local styles go here.*/
    `,
  ];

  constructor() {
    super();
    this.logoUrl = new URL(
      `/${this.siteLogoFilename}`,
      this.siteURL
    ).toString();
    if (DEBUG) {
      console.log(`this.logoUrl is ${this.logoUrl}`);
    }
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("siteLogoFilename")) {
      this.logoUrl = new URL(
        `/${this.siteLogoFilename}`,
        this.siteURL
      ).toString();
      if (DEBUG) {
        console.log(`this.logoUrl is ${this.logoUrl}`);
      }
    }
  }

  override render() {
    return html`
      <div id="TopBar" class="h-full grid grid-cols-6 gap-2">
        <div
          id="LogoSection"
          class="bg-SpectrumCyan-700 col-start-1 col-end-2 flex flex-row isolate object-scale-down object-left-top"
        >
          <div id="LogoGraphic" class="bg-SpectrumCyan-700 flex-initial">
            ${when(
              this.logoUrl != undefined,
              () => {
                return html`
                <img src="${this.logoUrl!}"></img>
                `;
              },
              () => nothing
            )}
          </div>
          <div id="LogoText" class="flex-auto bg-SpectrumCyan-700">
            <h3 id="LogoTextHeader" class="bg-cyan text-3xl">
              ${this.siteLogoText}
            </h3>
          </div>
        </div>
        <div
          id="MenuSection"
          class="bg-SpectrumCyan-700 col-start-2 col-span-4 flex-row object-contain object-right-top"
        ></div>
      </div>
    `;
  }
}
