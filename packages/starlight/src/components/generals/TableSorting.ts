import { TanStackFormController } from "@tanstack/lit-form";
import { type SortingState } from "@tanstack/table-core";

import { LitElement, css, unsafeCSS, html, type CSSResultGroup } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { withStores } from "@nanostores/lit";

import { z } from "zod";

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
  sortByPrimarySecondary,
  sortByAttackScoreMarchSize,
  sortByMarchSizeAttackScore,
  SortingPresets,
  sortingStore,
} from "./backendTable";

const SortingPreset = z.object({
  preset: SortingPresets,
});
type SortingPreset = z.infer<typeof SortingPreset>;

const DEBUG = true;

@customElement("table-sorting")
export class TableSorting extends withStores(LitElement, [sortingStore]) {
  #form = new TanStackFormController(this, {
    validators: {
      onMount: SortingPreset,
    },
    defaultValues: {
      preset: SortingPresets.Enum.sortByPrimarySecondary,
    },
  });

  static override styles: CSSResultGroup = [
    unsafeCSS(SpectrumCssMenu),
    unsafeCSS(SpectrumCssFieldLabel),
    unsafeCSS(SpectrumCssPicker),
    unsafeCSS(SpectrumCssPopover),
    unsafeCSS(GeneralOptionsFormCss),
  ];

  protected override render() {
    return html`
      <form
        id="TableSorting"
        @change=${(e: Event) => {
          if (DEBUG) {
            console.log(`TableSorting form change callback`);
          }
          const currentFormState = this.#form.api.state;
          if (DEBUG) {
            console.log(`attemptig to set ${currentFormState.values.preset}`);
          }
          if (
            !currentFormState.values.preset.localeCompare(
              SortingPresets.Enum.sortByPrimarySecondary
            )
          ) {
            sortingStore.set(sortByAttackScoreMarchSize);
          } else if (
            !currentFormState.values.preset.localeCompare(
              SortingPresets.Enum.sortByMarchSizeAttackScore
            )
          ) {
            sortingStore.set(sortByMarchSizeAttackScore);
          } else if (
            !currentFormState.values.preset.localeCompare(
              SortingPresets.Enum.sortByAttackScoreMarchSize
            )
          ) {
            sortingStore.set(sortByAttackScoreMarchSize);
          } else {
            if (DEBUG) {
              console.warn(
                `unknown sort type in ${JSON.stringify(currentFormState)}`
              );
            }
          }
        }}
        @submit=${(e: Event) => {
          e.preventDefault();
        }}
      >
        ${this.#form.field(
          {
            name: "preset",
          },
          (field) => {
            return html`
              <div class="flexRow">
                <label
                  class="spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-FieldLabel--left"
                >
                  Pick Table Sorting Option
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
                    ${SortingPresets.options.map((presetName, index) => {
                      return html`
                        <option
                          class="spectrum-Menu-item"
                          role="menuitem"
                          aria-selected=${!field.state.value.localeCompare(
                            presetName
                          )}
                          aria-disabled="false"
                          tabindex=${index}
                          value=${presetName}
                          ?selected=${!field.state.value.localeCompare(
                            presetName
                          )}
                        >
                          <span class="spectrum-Menu-itemLabel">
                            ${presetName.localeCompare("None")
                              ? `${presetName.slice(0, 1).toUpperCase()}${presetName.slice(1)}`
                              : presetName}
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
      </form>
    `;
  }
}
