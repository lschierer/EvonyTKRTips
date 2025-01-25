import { LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { SignalWatcher, html } from "@lit-labs/signals";

import * as stores from "./pairingstores.ts";

@customElement("debug-stores")
export default class DebugStores extends SignalWatcher(LitElement) {
  protected override render(): TemplateResult {
    return html`
      Generic Options:
      <ul>
        <li>generalusecase is ${stores.generalusecase}</li>
        <li>generalSpeciality is ${stores.generalSpeciality}</li>
      </ul>
      Primary General Options:
      <ul>
        <li>ascending level: ${stores.ascendingLevel}</li>
      </ul>
    `;
  }
}
