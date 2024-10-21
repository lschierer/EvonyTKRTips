import { unsafeCSS, html, LitElement, type PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import globalStyles from "@styles/global.css?inline";
import topNavStyles from "./top-nav.css?inline";

@customElement("top-nav")
export class TopNav extends LitElement {
  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
  }

  static styles = [unsafeCSS(globalStyles), unsafeCSS(topNavStyles)];

  override render() {
    return html`
      <div class="TopNav">
        <p>TopNav</p>
      </div>
    `;
  }
}
