import { LitElement, html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import "./selector.ts";

import "./debugStores.ts";

@customElement("general-pairing")
export default class GeneralPairing extends LitElement {
  protected override render(): TemplateResult {
    return html`
      <div>
        <pair-selector></pair-selector>
        <div>
          <debug-stores></debug-stores>
        </div>
      </div>
    `;
  }
}
