import {
  LitElement,
  html,
  css,
  unsafeCSS,
  type TemplateResult,
  type CSSResultGroup,
} from "lit";
import { customElement } from "lit/decorators.js";

import { withStores } from "@nanostores/lit";

import SpectrumCSSfieldlabel from "@spectrum-css/fieldlabel/dist/index.css" with { type: "css" };
import SpectrumCSSform from "@spectrum-css/form/dist/index.css" with { type: "css" };
import SpectrumCSSmenu from "@spectrum-css/menu/dist/index.css" with { type: "css" };
import SpectrumCSSpagination from "@spectrum-css/pagination/dist/index.css" with { type: "css" };
import SpectrumCSSpicker from "@spectrum-css/picker/dist/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/dist/index.css" with { type: "css" };
import SpectrumCSStextfield from "@spectrum-css/textfield/dist/index.css" with { type: "css" };

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("/components/generals/pairing/selector.ts");

import * as stores from "./pairingstores.ts";

@customElement("pair-selector")
export class PairSelectorForm extends withStores(LitElement, [
  stores.generalusecase,
]) {
  static override styles?: CSSResultGroup = [
    unsafeCSS(SpectrumCSSfieldlabel),
    unsafeCSS(SpectrumCSSform),
    unsafeCSS(SpectrumCSSmenu),
    unsafeCSS(SpectrumCSSpagination),
    unsafeCSS(SpectrumCSSpicker),
    unsafeCSS(SpectrumCSSstepper),
    unsafeCSS(SpectrumCSStextfield),
    css``,
  ];

  protected override render(): TemplateResult {
    return html`${DEBUG ? html` <span>PairSelectorForm Rendering</span> ` : ""}`;
  }
}
//customElements.define("pair-selector", PairSelectorForm);
