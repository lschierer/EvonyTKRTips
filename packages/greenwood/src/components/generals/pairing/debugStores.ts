import { LitElement, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";
import { SignalWatcher, html } from "@lit-labs/signals";

import stores from "./pairingstores.ts";

@customElement("debug-stores")
export default class DebugStores extends SignalWatcher(LitElement) {
  protected override render(): TemplateResult {
    return html`
      Generic Options:
      <ul>
        <li>generalusecase is ${stores.pairUseCase}</li>
        <li>generalSpeciality is ${stores.pairSpeciality}</li>
      </ul>

      Primary General Options:
      <ul>
        <li>ascending level: ${stores.primary.ascendingLevel}</li>
        ${stores.primary.specialities.map((sps, index) => {
          return html` <li>Speciality #${index}: ${sps}</li> `;
        })}
        <li>dragon: ${stores.primary.dragon}</li>
        <li>beast: ${stores.primary.beast}</li>
      </ul>

      Secondary General Options:
      <ul>
        ${stores.secondary.specialities.map((sps, index) => {
          return html` <li>Speciality #${index}: ${sps}</li> `;
        })}
        <li>dragon: ${stores.secondary.dragon}</li>
        <li>beast: ${stores.secondary.beast}</li>
      </ul>
    `;
  }
}
