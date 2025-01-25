import { LitElement, html, type TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

import { provide } from "@lit/context";

import * as stores from "./pairingstores.ts";

import * as constants from "../../../schemas/constants.ts";

import "./selector.ts";

import "./debugStores.ts";

@customElement("general-pairing")
export default class GeneralPairing extends LitElement {
  @provide({ context: stores.generalusecase })
  protected generalusecase = constants.BuffActivation.Enum.Overall;

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
