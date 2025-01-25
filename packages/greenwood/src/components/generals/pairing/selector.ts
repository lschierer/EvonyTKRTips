import {
  LitElement,
  css,
  unsafeCSS,
  type TemplateResult,
  type CSSResultGroup,
} from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { SignalWatcher, html } from "@lit-labs/signals";

import { z } from "zod";
import SpectrumCSSfieldlabel from "@spectrum-css/fieldlabel/dist/index.css" with { type: "css" };
import SpectrumCSSform from "@spectrum-css/form/dist/index.css" with { type: "css" };
import SpectrumCSSmenu from "@spectrum-css/menu/dist/index.css" with { type: "css" };
import SpectrumCSSpagination from "@spectrum-css/pagination/dist/index.css" with { type: "css" };
import SpectrumCSSpicker from "@spectrum-css/picker/dist/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/dist/index.css" with { type: "css" };
import SpectrumCSStextfield from "@spectrum-css/textfield/dist/index.css" with { type: "css" };

import "iconify-icon";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("/components/generals/pairing/selector.ts");

import {
  ascendingLevel,
  generalusecase,
  generalSpeciality,
} from "./pairingstores.ts";

import * as constants from "../../../schemas/constants.ts";

@customElement("pair-selector")
export class PairSelectorForm extends SignalWatcher(LitElement) {
  static override styles?: CSSResultGroup = [
    unsafeCSS(SpectrumCSSfieldlabel),
    unsafeCSS(SpectrumCSSform),
    unsafeCSS(SpectrumCSSmenu),
    unsafeCSS(SpectrumCSSpagination),
    unsafeCSS(SpectrumCSSpicker),
    unsafeCSS(SpectrumCSSstepper),
    unsafeCSS(SpectrumCSStextfield),
    css`
      .pairSelectionValuesForm {
        border: 1px solid var(--sl-color-accent);
        padding: 1rem;
        margin: 0.5rem;
      }

      .overallOptions {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        width: fit-content;
      }

      div.spectrum-Form-item {
        padding-left: 2px;
        padding-right: 0.5rem;
      }
    `,
  ];

  protected renderUseCase = () => {
    return html`
      <div class="spectrum-Form-item">
        <label
          class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
          style=""
          id="fieldlabel-generalUseCase"
          for="form-generalUseCase"
        >
          General Use Case
        </label>
        <div class="spectrum-Form-itemField">
          <select
            id="form-generalUseCase"
            class="spectrum-Picker spectrum-Picker--sizeM"
            value=${generalusecase.get()}
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.BuffActivation.safeParse(target.value);
                if (valid.success) {
                  generalusecase.set(valid.data);
                }
              }
            }}"
          >
            ${constants.BuffActivation.options
              .filter((ba) => {
                if (!ba.localeCompare(constants.BuffActivation.Enum.Mayor)) {
                  return false;
                }
                if (!ba.localeCompare(constants.BuffActivation.Enum.Officer)) {
                  return false;
                }
                return true;
              })
              .map((ba, index) => {
                const itemClasses = {
                  "spectrum-Menu-item": true,
                  "is-selected": !generalusecase.get().localeCompare(ba),
                };
                return html`
                  <option
                    ?selected=${!generalusecase.get().localeCompare(ba)}
                    value="${ba}"
                    class="${classMap(itemClasses)}"
                    id="form-generalUseCase-menu-item-${index}"
                    role="menuitem"
                    aria-disabled="false"
                    tabindex="0"
                  >
                    <span class="spectrum-Menu-itemLabel"> ${ba} </span>
                  </option>
                `;
              })}
          </select>
        </div>
      </div>
    `;
  };

  protected renderGeneralSpeciality = () => {
    return html`
      <div class="spectrum-Form-item">
        <label
          class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
          style=""
          id="fieldlabel-generalSpeciality"
          for="form-generalSpeciality"
        >
          General Speciality
        </label>
        <div class="spectrum-Form-itemField">
          <select
            id="form-generalSpeciality"
            class="spectrum-Picker spectrum-Picker--sizeM"
            value=${generalSpeciality.get()}
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.GeneralType.safeParse(target.value);
                if (valid.success) {
                  generalSpeciality.set(valid.data);
                }
              }
            }}"
          >
            ${constants.GeneralType.options
              .filter((ba) => {
                if (!ba.localeCompare(constants.GeneralType.Enum.mayor)) {
                  return false;
                }
                if (!ba.localeCompare(constants.GeneralType.Enum.officer)) {
                  return false;
                }
                return true;
              })
              .map((gt, index) => {
                const itemClasses = {
                  "spectrum-Menu-item": true,
                  "is-selected": !generalSpeciality.get().localeCompare(gt),
                };
                if (DEBUG) {
                  console.log(
                    `comparing ${generalSpeciality.get()} to ${gt}`,
                    `is-selected is ${itemClasses["is-selected"]}`
                  );
                }
                return html`
                  <option
                    ?selected=${!generalSpeciality.get().localeCompare(gt)}
                    value="${gt}"
                    class="${classMap(itemClasses)}"
                    id="form-generalSpeciality-menu-item-${index}"
                    role="menuitem"
                    aria-disabled="false"
                    tabindex="0"
                  >
                    <span class="spectrum-Menu-itemLabel">
                      ${gt.slice(0, 1).toUpperCase()}${gt
                        .replaceAll("_", " ")
                        .slice(1)}
                    </span>
                  </option>
                `;
              })}
          </select>
        </div>
      </div>
    `;
  };

  protected renderAscendingLevel = () => {
    return html`
      <div class="spectrum-Form-item">
        <label
          class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
          style=""
          id="fieldlabel-ascendingLevel"
          for="form-ascendingLevel"
        >
          Ascending Level
        </label>
        <div class="spectrum-Form-itemField">
          <select
            id="form-ascendingLevel"
            class="spectrum-Picker spectrum-Picker--sizeM"
            value=${ascendingLevel.get()}
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.AscendingLevel.safeParse(target.value);
                if (valid.success) {
                  ascendingLevel.set(valid.data);
                }
              }
            }}"
          >
            ${constants.AscendingLevel.options.map((al, index) => {
              const itemClasses = {
                "spectrum-Menu-item": true,
                "is-selected": !ascendingLevel.get().localeCompare(al),
              };
              if (DEBUG) {
                console.log(
                  `comparing ${ascendingLevel.get()} to ${al}`,
                  `is-selected is ${itemClasses["is-selected"]}`
                );
              }
              return html`
                <option
                  ?selected=${!ascendingLevel.get().localeCompare(al)}
                  value="${al}"
                  class="${classMap(itemClasses)}"
                  id="form-ascendingLevel-menu-item-${index}"
                  role="menuitem"
                  aria-disabled="false"
                  tabindex="0"
                >
                  <span class="spectrum-Menu-itemLabel">
                    ${!al.localeCompare("None")
                      ? al
                      : `${al.slice(-1)} ${al.slice(0, 1).toUpperCase()}${al.slice(1, -1)}`}
                  </span>
                </option>
              `;
            })}
          </select>
        </div>
      </div>
    `;
  };

  protected override render(): TemplateResult {
    const debugheading = html`${DEBUG
      ? html` <h3>PairSelectorForm Rendering</h3> `
      : ""}`;

    return html`${debugheading}
      <div class="pairSelectionValuesForm"
        <form
            class="spectrum-Form spectrum-Form--labelsAbove"
            id="pairSelectionValuesForm"
          >
            <div class="overallOptions">
              ${this.renderUseCase()}
              ${this.renderGeneralSpeciality()}
            </div>
            <div class="primaryOptions">
            </div>
            <div class="secondaryOptions">
              ${this.renderAscendingLevel()}
            </div>
          </form>
      </div>
    `;
  }
}
//customElements.define("pair-selector", PairSelectorForm);
