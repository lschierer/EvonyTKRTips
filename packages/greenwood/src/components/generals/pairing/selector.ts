import {
  LitElement,
  css,
  unsafeCSS,
  type TemplateResult,
  type CSSResultGroup,
  type PropertyValues,
} from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { SignalWatcher, html } from "@lit-labs/signals";

import SpectrumCSSfieldlabel from "@spectrum-css/fieldlabel/dist/index.css" with { type: "css" };
import SpectrumCssfieldgroup from "@spectrum-css/fieldgroup/dist/index.css" with { type: "css" };
import SpectrumCSSform from "@spectrum-css/form/dist/index.css" with { type: "css" };
import SpectrumCSSmenu from "@spectrum-css/menu/dist/index.css" with { type: "css" };
import SpectrumCSSpagination from "@spectrum-css/pagination/dist/index.css" with { type: "css" };
import SpectrumCSSpicker from "@spectrum-css/picker/dist/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/dist/index.css" with { type: "css" };
import SpectrumCSStextfield from "@spectrum-css/textfield/dist/index.css" with { type: "css" };
import SpectrumCSSradio from "@spectrum-css/radio/dist/index.css" with { type: "css" };
import SpectrumCSSpopover from "@spectrum-css/popover/dist/index.css" with { type: "css" };

import "iconify-icon";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/generals/pairing/selector.ts");

import * as constants from "../../../schemas/constants.ts";

import stores from "./pairingstores.ts";

@customElement("pair-selector")
export class PairSelectorForm extends SignalWatcher(LitElement) {
  static override styles?: CSSResultGroup = [
    unsafeCSS(SpectrumCSSpopover),
    unsafeCSS(SpectrumCSSfieldlabel),
    unsafeCSS(SpectrumCssfieldgroup),
    unsafeCSS(SpectrumCSSform),
    unsafeCSS(SpectrumCSSmenu),
    unsafeCSS(SpectrumCSSpagination),
    unsafeCSS(SpectrumCSSpicker),
    unsafeCSS(SpectrumCSSstepper),
    unsafeCSS(SpectrumCSStextfield),
    unsafeCSS(SpectrumCSSradio),
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

      .primaryOptions,
      .secondaryOptions {
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
            value=${stores.pairUseCase}
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.BuffActivation.safeParse(target.value);
                if (valid.success) {
                  stores.pairUseCase = valid.data;
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
                  "is-selected": !stores.pairUseCase.localeCompare(ba),
                };
                return html`
                  <option
                    ?selected=${!stores.pairUseCase.localeCompare(ba)}
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
            value=${stores.pairSpeciality}
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.GeneralType.safeParse(target.value);
                if (valid.success) {
                  stores.pairSpeciality = valid.data;
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
                  "is-selected": !stores.pairSpeciality.localeCompare(gt),
                };
                return html`
                  <option
                    ?selected=${!stores.pairSpeciality.localeCompare(gt)}
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
            value=${stores.primary.ascendingLevel}
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.AscendingLevel.safeParse(target.value);
                if (valid.success) {
                  stores.primary.ascendingLevel = valid.data;
                }
              }
            }}"
          >
            ${constants.AscendingLevel.options.map((al, index) => {
              const itemClasses = {
                "spectrum-Menu-item": true,
                "is-selected": !stores.primary.ascendingLevel.localeCompare(al),
              };

              return html`
                <option
                  ?selected=${!stores.primary.ascendingLevel.localeCompare(al)}
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

  protected FourthSpeciality = (role: constants.GeneralRole) => {
    if (!role.localeCompare("primary")) {
      console.log(`role is primary`);
      if (
        !stores.primary.specialities[0].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        )
      ) {
        console.log(`s0 is gold`);
        if (
          !stores.primary.specialities[1].localeCompare(
            constants.SpecialityLevelName.Enum.Gold
          )
        ) {
          if (
            !stores.primary.specialities[2].localeCompare(
              constants.SpecialityLevelName.Enum.Gold
            )
          ) {
            if (
              stores.primary.specialities[3].localeCompare(
                constants.SpecialityLevelName.Enum.None
              )
            ) {
              return stores.primary.specialities[3];
            } else {
              stores.primary.specialities[3] =
                constants.SpecialityLevelName.Enum.Green;
              return constants.SpecialityLevelName.Enum.Green;
            }
          }
        }
      }
      stores.primary.specialities[3] = constants.SpecialityLevelName.Enum.None;
      return constants.SpecialityLevelName.Enum.None;
    }
    if (
      !stores.secondary.specialities[0].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      )
    ) {
      console.log(`s0 is gold`);
      if (
        !stores.secondary.specialities[1].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        )
      ) {
        if (
          !stores.secondary.specialities[2].localeCompare(
            constants.SpecialityLevelName.Enum.Gold
          )
        ) {
          if (
            stores.secondary.specialities[3].localeCompare(
              constants.SpecialityLevelName.Enum.None
            )
          ) {
            return stores.secondary.specialities[3];
          } else {
            stores.secondary.specialities[3] =
              constants.SpecialityLevelName.Enum.Green;
            return constants.SpecialityLevelName.Enum.Green;
          }
        }
      }
    }
    stores.secondary.specialities[3] = constants.SpecialityLevelName.Enum.None;
    return constants.SpecialityLevelName.Enum.None;
  };
  protected renderSpecialityLevel = (
    role: constants.GeneralRole,
    index: number
  ) => {
    return html`
      <div class="spectrum-Form-item">
        <label
          class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
          style=""
          id="fieldlabel-SpecialityLevelName-${index}"
          for="form-SpecialityLevelName-${index}"
        >
          Speciality # ${index}
        </label>
        <div class="spectrum-Form-itemField">
          <select
            id="form-SpecialityLevelName-${index}"
            class="spectrum-Picker spectrum-Picker--sizeM"
            ?disabled=${index == 3
              ? !role.localeCompare("primary")
                ? !stores.primary.specialities[0].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  ) &&
                  !stores.primary.specialities[1].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  ) &&
                  !stores.primary.specialities[2].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  )
                  ? false
                  : true
                : !stores.secondary.specialities[0].localeCompare(
                      constants.SpecialityLevelName.Enum.Gold
                    ) &&
                    !stores.secondary.specialities[1].localeCompare(
                      constants.SpecialityLevelName.Enum.Gold
                    ) &&
                    !stores.secondary.specialities[2].localeCompare(
                      constants.SpecialityLevelName.Enum.Gold
                    )
                  ? false
                  : true
              : false}
            value=${index === 3
              ? !role.localeCompare("primary")
                ? this.FourthSpeciality("primary")
                : this.FourthSpeciality("secondary")
              : !role.localeCompare("primary")
                ? stores.primary.specialities[index]
                : stores.secondary.specialities[index]}
            @change="${(e: Event) => {
              if (DEBUG) {
                console.log(`speciality level callback`, `role is ${role}`);
              }
              const target = (e as CustomEvent)
                .target as HTMLSelectElement | null;
              if (target) {
                const valid = constants.SpecialityLevelName.safeParse(
                  target.value
                );
                if (valid.success) {
                  if (DEBUG) {
                    console.log(`valid data: ${valid.data}`);
                  }
                  if (!role.localeCompare("primary")) {
                    stores.primary.specialities[index] = valid.data;

                    if (DEBUG) {
                      console.log(
                        `role is primary`,
                        `index is ${index}`,
                        `set value to ${valid.data}`
                      );
                    }
                  } else {
                    stores.secondary.specialities[index] = valid.data;
                  }
                }
              }
            }}"
          >
            ${constants.SpecialityLevelName.options.map((spln, index2) => {
              const sv =
                index2 == 3
                  ? !role.localeCompare("primary")
                    ? this.FourthSpeciality("primary")
                    : this.FourthSpeciality("secondary")
                  : !role.localeCompare("primary")
                    ? stores.primary.specialities[index]
                    : stores.secondary.specialities[index];
              const itemClasses = {
                "spectrum-Menu-item": true,
                "is-selected": !sv.localeCompare(spln),
              };
              return html`
                <option
                  ?selected=${!sv.localeCompare(spln)}
                  value="${spln}"
                  class="${classMap(itemClasses)}"
                  id="form-SpecialityLevelName-${index}-menu-item-${index2}"
                  role="menuitem"
                  aria-disabled="false"
                  tabindex="0"
                >
                  <span class="spectrum-Menu-itemLabel"> ${spln} </span>
                </option>
              `;
            })}
          </select>
        </div>
      </div>
    `;
  };

  protected renderAnimalOptions = (role: constants.GeneralRole) => {
    return html`
      <div class="spectrum-Form-item">
        <label
          class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
          style=""
          id="fieldlabel-animal-${role}"
          for="form-animal-${role}"
        >
          Pick One
        </label>

        <div class="spectrum-Form-itemField">
          <div
            class="spectrum-FieldGroup spectrum-FieldGroup--vertical"
            role="radiogroup"
          >
            <div class="spectrum-FieldGroupInputLayout">
              <div
                class="spectrum-Radio spectrum-Radio--sizeM spectrum-FieldGroup-item"
                style=""
              >
                <input
                  type="radio"
                  name="form-group-animal-${role}"
                  class="spectrum-Radio-input"
                  id="form-dragon-${role}"
                  value="dragon"
                  ?checked=${!role.localeCompare("primary")
                    ? stores.primary.dragon
                    : stores.secondary.dragon}
                  @change=${(e: Event) => {
                    const target = (e as CustomEvent)
                      .target as HTMLInputElement | null;
                    if (target && !target.value.localeCompare("dragon")) {
                      if (!role.localeCompare("primary")) {
                        stores.primary.dragon = true;
                        stores.primary.beast = false;
                      } else {
                        stores.secondary.dragon = true;
                        stores.secondary.beast = false;
                      }
                    }
                  }}
                />
                <span
                  class="spectrum-Radio-button spectrum-Radio-button--sizeS"
                ></span>
                <label
                  class="spectrum-Radio-label spectrum-Radio-label--sizeS"
                  for="form-animal-${role}"
                  >Dragon</label
                >
              </div>

              <div
                class="spectrum-Radio spectrum-Radio--sizeM spectrum-FieldGroup-item"
                style=""
              >
                <input
                  type="radio"
                  name="form-group-animal-${role}"
                  class="spectrum-Radio-input"
                  id="form-beast-${role}"
                  value="beast"
                  ?checked=${!role.localeCompare("primary")
                    ? stores.primary.beast
                    : stores.secondary.beast}
                  @change=${(e: Event) => {
                    const target = (e as CustomEvent)
                      .target as HTMLInputElement | null;
                    if (target && !target.value.localeCompare("beast")) {
                      if (!role.localeCompare("primary")) {
                        stores.primary.dragon = false;
                        stores.primary.beast = true;
                      } else {
                        stores.secondary.dragon = false;
                        stores.secondary.beast = true;
                      }
                    }
                  }}
                />
                <span
                  class="spectrum-Radio-button spectrum-Radio-button--sizeS"
                ></span>
                <label
                  class="spectrum-Radio-label spectrum-Radio-label--sizeS"
                  for="form-beast-${role}"
                  >Spiritual Beast</label
                >
              </div>

              <div
                class="spectrum-Radio spectrum-Radio--sizeM spectrum-FieldGroup-item"
                style=""
              >
                <input
                  type="radio"
                  name="form-group-animal-${role}"
                  class="spectrum-Radio-input"
                  id="form-none-${role}"
                  value="none"
                  ?checked=${!role.localeCompare("primary")
                    ? !stores.primary.beast && !stores.primary.dragon
                    : !stores.secondary.beast && !stores.secondary.dragon}
                  @change=${(e: Event) => {
                    const target = (e as CustomEvent)
                      .target as HTMLInputElement | null;
                    if (target && !target.value.localeCompare("none")) {
                      if (!role.localeCompare("primary")) {
                        stores.primary.dragon = false;
                        stores.primary.beast = false;
                      } else {
                        stores.secondary.dragon = false;
                        stores.secondary.beast = false;
                      }
                    }
                  }}
                />
                <span
                  class="spectrum-Radio-button spectrum-Radio-button--sizeS"
                ></span>
                <label
                  class="spectrum-Radio-label spectrum-Radio-label--sizeS"
                  for="form-none-${role}"
                  >None</label
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  };

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (DEBUG) {
      console.log(
        `_changedProperties:\n${Object.keys(_changedProperties).join("\n")}`
      );
    }
  }

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
            <div class="primarySection">
              <h3 spectrum-Heading spectrum-Heading--sizeM>Primary General Options</h3>
              <div class="primaryOptions">
                ${Array.from(Array(4)).map((_, i) =>
                  this.renderSpecialityLevel("primary", i)
                )}
                ${this.renderAnimalOptions("primary")}
                ${this.renderAscendingLevel()}
              </div>
            </div>
            <div class="secondarySection">
              <h3 spectrum-Heading spectrum-Heading--sizeM>Secondary General Options</h3>
              <div class="secondaryOptions">

                ${Array.from(Array(4)).map((_, i) =>
                  this.renderSpecialityLevel("secondary", i)
                )}
                ${this.renderAnimalOptions("secondary")}
              </div>
            </div>
          </form>
      </div>
    `;
  }
}
//customElements.define("pair-selector", PairSelectorForm);
