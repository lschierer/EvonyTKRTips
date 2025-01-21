import { LitElement, css, unsafeCSS, html } from "lit";
import { customElement } from "lit/decorators.js";

import { z } from "zod";

import { TanStackFormController } from "@tanstack/lit-form";

import SpectrumCssMenu from "@spectrum-css/menu/dist/index.css?inline";
import SpectrumCssFieldLabel from "@spectrum-css/fieldlabel/dist/index.css?inline";
import SpectrumCssPicker from "@spectrum-css/picker/dist/index.css?inline";
import SpectrumCssPopover from "@spectrum-css/popover/dist/index.css?inline";
import SpectrumCssStepper from "@spectrum-css/stepper/dist/index.css?inline";
import SpectrumCssTextfield from "@spectrum-css/textfield/dist/index.css?inline";
import GeneralOptionsFormCss from "@styles/GeneralOptionsForm.css?inline";

import "iconify-icon";

import * as constants from "@schemas/constants";

import {
  type GeneralOptions,
  PairOptions,
  GeneralSpecialtyLevelArray,
} from "./store";
import { classMap } from "lit/directives/class-map.js";

@customElement("general-options")
export class GeneralOptionsForm extends LitElement {
  #form = new TanStackFormController(this, {
    validators: {
      onMount: PairOptions,
      onSubmit: PairOptions,
      onSubmitAsync: PairOptions,
    },
    defaultValues: {
      primary: {
        role: "primary",
        options: {
          level: 44,
          ascendingLevel: constants.AscendingLevel.Enum.red5,
          specialityLevels: [
            constants.SpecialityLevelName.Enum.None,
            constants.SpecialityLevelName.Enum.Gold,
            constants.SpecialityLevelName.Enum.Gold,
            constants.SpecialityLevelName.Enum.Gold,
          ],
          dragon: true,
          beast: false,
        },
      } as GeneralOptions,
      secondary: {
        role: "secondary",
        options: {
          specialityLevels: [
            constants.SpecialityLevelName.Enum.Gold,
            constants.SpecialityLevelName.Enum.Gold,
            constants.SpecialityLevelName.Enum.Gold,
            constants.SpecialityLevelName.Enum.Gold,
          ],
          dragon: true,
          beast: false,
        },
      } as GeneralOptions,
    },
  });

  static override get styles() {
    return [
      unsafeCSS(SpectrumCssMenu),
      unsafeCSS(SpectrumCssFieldLabel),
      unsafeCSS(SpectrumCssTextfield),
      unsafeCSS(SpectrumCssPicker),
      unsafeCSS(SpectrumCssPopover),
      unsafeCSS(SpectrumCssStepper),
      unsafeCSS(GeneralOptionsFormCss),
      css``,
    ];
  }

  protected override render() {
    return html`
      <form
        id="GeneralOptions"
        @submit=${(e: Event) => {
          e.preventDefault();
        }}
      >
        <h3>General Options</h3>
        <div class="primaryOptions FlexAlignSpaceAround">
          ${this.#form.field(
            {
              name: "primary.options.level",
              defaultValue: 44,

              validators: {
                onChange: z
                  .number()
                  .gte(1, "Level must be at least 1")
                  .lte(45, "Level can be no more than 45"),
              },
            },
            (field) => {
              const inputClasses = {
                "?is-invalid": field.state.meta.errors.length > 0,
              };
              return html`
                <div class="flexColumn">
                  <label
                    class="spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-FieldLabel--left"
                  >
                    General Level${
                      field.state.meta.errors.length > 0
                        ? html`
                            <iconify-icon
                              icon="tdesign:error-triangle-filled"
                              inline
                              class="inlineIcon"
                              style="color: var(--spectrum-negative-color-600)"
                            ></iconify-icon>
                          `
                        : ""
                    }
                  </label>
                  <div
                    class="spectrum-Stepper spectrum-Stepper--sizeM hide-stepper"
                    id="stepper-sylea"
                    style="--mod-actionbutton-icon-size:10px;"
                  >
                    <div
                      class="spectrum-Textfield spectrum-Textfield--sizeM spectrum-Stepper-textfield"
                      style=""
                      id="stepper-sylea-input"
                    >
                      <input
                        type="number"
                        id="stepper-sylea-input-input"
                        class="${classMap(
                          inputClasses
                        )} spectrum-Textfield-input spectrum-Stepper-input"
                        value="${field.state.value}"
                        min="1"
                        max="45"
                        @input="${(e: Event) => {
                          const target = e.target as HTMLInputElement;
                          field.handleChange(+target.value);
                        }}"
                      >

                      </input>
                    </div>
                  </div>
                </div>

              `;
            }
          )}
          ${this.#form.field(
            {
              name: "primary.options.ascendingLevel",
              defaultValue: constants.AscendingLevel.Enum.red5,
              validators: {
                onChange: constants.AscendingLevel,
              },
            },
            (field) => {
              return html`
                <div class="flexColumn">
                  <label
                    class="spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-FieldLabel--left"
                  >
                    Ascending Level
                    ${field.getMeta().errors.length > 0
                      ? html`
                          <iconify-icon
                            icon="tdesign:error-triangle-filled"
                            inline
                            class="inlineIcon"
                            style="color: var(--spectrum-negative-color-600)"
                          ></iconify-icon>
                        `
                      : ""}
                  </label>

                  <div
                    style="--spectrum-popover-height:142px;--spectrum-popover-width:89px;position:relative;display:inline-flex;align-items:center;justify-content:center;"
                  >
                    <select
                      name=${field.name}
                      id=${field.name}
                      value=${field.state.value}
                      class="spectrum-Picker spectrum-Picker--sizeM spectrum-Picker--quiet"
                    >
                      ${constants.AscendingLevel.options.map((level, index) => {
                        return html`
                          <option
                            class="spectrum-Menu-item"
                            role="menuitem"
                            aria-selected=${!field.state.value.localeCompare(
                              level
                            )}
                            aria-disabled="false"
                            tabindex=${index}
                            value=${level}
                            ?selected=${!field.state.value.localeCompare(level)}
                          >
                            <span class="spectrum-Menu-itemLabel">
                              ${level.localeCompare("None")
                                ? `${level.slice(-1)} ${level.slice(0, 1).toUpperCase()}${level.slice(1, -1)} Stars`
                                : level}
                            </span>
                          </option>
                        `;
                      })}
                    </select>
                  </div>
                </div>
              `;
            }
          )}
          <div
            class="specialities flexRow FlexJustifySpaceAround FlexAlignSpaceAround"
          >
            ${this.#form.field(
              {
                name: "primary.options.specialityLevels",
                defaultValue: [
                  constants.SpecialityLevelName.Enum.Gold,
                  constants.SpecialityLevelName.Enum.Gold,
                  constants.SpecialityLevelName.Enum.Gold,
                  constants.SpecialityLevelName.Enum.Gold,
                  constants.SpecialityLevelName.Enum.Gold,
                ],
                validators: {
                  onChange: GeneralSpecialtyLevelArray,
                },
              },
              (field) => {
                return Array.from(Array(4).keys()).map((n, index) => {
                  return html`
                    <div class="flexColumn">
                      <label
                        class="spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-FieldLabel--left"
                      >
                        Speciality Level #${index + 1}
                        ${field.getMeta().errors.length > 0
                          ? html`
                              <iconify-icon
                                icon="tdesign:error-triangle-filled"
                                inline
                                class="inlineIcon"
                                style="color: var(--spectrum-negative-color-600)"
                              ></iconify-icon>
                            `
                          : ""}
                      </label>

                      <div
                        style="--spectrum-popover-height:142px;--spectrum-popover-width:89px;position:relative;display:inline-flex;align-items:center;justify-content:center;"
                      >
                        <select
                          name="${field.name}-${index}"
                          id="${field.name}-${index}"
                          value=${field.state.value[index]}
                          class="spectrum-Picker spectrum-Picker--sizeM spectrum-Picker--quiet"
                        >
                          ${constants.SpecialityLevelName.options.map(
                            (level, index2) => {
                              return html`
                                <option
                                  class="spectrum-Menu-item"
                                  role="menuitem"
                                  aria-selected=${!field.state.value[
                                    index
                                  ].localeCompare(level)}
                                  aria-disabled="false"
                                  tabindex=${index2}
                                  value=${level}
                                  ?selected=${!field.state.value[
                                    index
                                  ].localeCompare(level)}
                                >
                                  <span class="spectrum-Menu-itemLabel">
                                    ${level.localeCompare("None")
                                      ? `${level.slice(0, 1).toUpperCase()}${level.slice(1)}`
                                      : level}
                                  </span>
                                </option>
                              `;
                            }
                          )}
                        </select>
                      </div>
                    </div>
                  `;
                });
              }
            )}
          </div>
        </div>
      </form>
      <pre>${JSON.stringify(this.#form.api.state, null, 2)}</pre>
    `;
  }
}
