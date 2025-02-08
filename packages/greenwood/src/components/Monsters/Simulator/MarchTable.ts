import { LitElement, html, unsafeCSS, css, type CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";

import { z } from "zod";

import SpectrumCSSTable from "@spectrum-css/table/index.css" with { type: "css" };
import SpectrumCSStextfield from "@spectrum-css/textfield/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/index.css" with { type: "css" };
import SpectrumCSSpicker from "@spectrum-css/picker/index.css" with { type: "css" };
import SpectrumCSSmenu from "@spectrum-css/menu/index.css" with { type: "css" };

import * as constants from "../../../schemas/constants.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/Monsters/Simulator/MarchTable.ts");

import simulatorState from "./state.ts";

@customElement("march-table")
export default class MarchTable extends LitElement {
  static override styles: CSSResultGroup = [
    unsafeCSS(SpectrumCSSTable),
    unsafeCSS(SpectrumCSStextfield),
    unsafeCSS(SpectrumCSSstepper),
    unsafeCSS(SpectrumCSSpicker),
    unsafeCSS(SpectrumCSSmenu),
    css`
      input.spectrum-Textfield-input.spectrum-Stepper-input {
        width: 4rem;
      }
    `,
  ];

  protected override render() {
    return html`
      <div class="MarchTable>">
        <h4 class="spectrum-Heading spectrum-Heading--sizeM">
          Choose your Troop/Tier/Total Troops
        </h4>
        <table
          class=" spectrum-Table spectrum-Table--sizeM spectrum-Table--compact spectrum-Table--quiet "
        >
          <thead class="spectrum-Table-head">
            <th class="spectrum-Table-headcell">Attack Type</th>
            <th class="spectrum-Table-headcell">Troop Tier</th>
            <th class="spectrum-Table-headcell">Troop Type</th>
            <th class="spectrum-Table-headcell"># Troops</th>
          </thead>
          <tbody class="spectrum-Table-body">
            <td class="spectrum-Table-cell">
              <select
                id="SoloOrRally"
                class="spectrum-Picker spectrum-Picker--sizeM"
                @change="${(e: Event) => {
                  const target = (e as CustomEvent)
                    .target as HTMLSelectElement | null;
                  if (target) {
                    const valid = z
                      .boolean()
                      .safeParse(!target.value.localeCompare("true"));
                    if (valid.success) {
                      simulatorState.solo.set(valid.data);
                      this.requestUpdate();
                    } else {
                      console.error(`error parsing, ${valid.error.message}`);
                    }
                  }
                }}"
                value="${simulatorState.solo.get()}"
              >
                <option
                  class="spectrum-Menu-item"
                  role="menuitem"
                  ?selected=${simulatorState.solo.get()}
                  value="true"
                >
                  Solo
                </option>
                <option
                  class="spectrum-Menu-item"
                  role="menuitem"
                  ?selected=${!simulatorState.solo.get()}
                  value="false"
                >
                  Rally
                </option>
              </select>
            </td>
            <td class="spectrum-Table-cell">
              <select
                id="TroopTier"
                class="spectrum-Picker spectrum-Picker--sizeM"
                @change="${(e: Event) => {
                  const target = (e as CustomEvent)
                    .target as HTMLSelectElement | null;
                  if (target) {
                    const valid = z
                      .number()
                      .min(1)
                      .max(15)
                      .safeParse(+target.value);
                    if (valid.success) {
                      if (DEBUG) {
                        console.log(`valid parse, value is ${valid.data}`);
                      }
                      simulatorState.troopTier.set(valid.data);
                      this.requestUpdate();
                    } else {
                      console.error(`error parsing, ${valid.error.message}`);
                    }
                  }
                }}"
                value="${simulatorState.troopTier.get()}"
              >
                ${Array.from({ length: 15 }, (_, i) => 1 + i).map((n) => {
                  return html`
                    <option
                      class="spectrum-Menu-item"
                      role="menuitem"
                      ?selected=${n == simulatorState.troopTier.get()}
                      value="${n}"
                    >
                      T${n}
                    </option>
                  `;
                })}
              </select>
            </td>
            <td class="spectrum-Table-cell">
              <select
                id="TroopType"
                class="spectrum-Picker spectrum-Picker--sizeM"
                @change="${(e: Event) => {
                  const target = (e as CustomEvent)
                    .target as HTMLSelectElement | null;
                  if (target) {
                    const valid = constants.ClassEnum.safeParse(target.value);
                    if (valid.success) {
                      if (DEBUG) {
                        console.log(
                          `TroopType valid parse, value is ${valid.data}`
                        );
                      }
                      simulatorState.troopType.set(valid.data);
                      this.requestUpdate();
                    } else {
                      console.error(`error parsing, ${valid.error.message}`);
                    }
                  }
                }}"
                value="${simulatorState.troopType.get()}"
              >
                ${constants.ClassEnum.options
                  .filter((c) => c.localeCompare(constants.ClassEnum.Enum.All))
                  .map((n) => {
                    return html`
                      <option
                        class="spectrum-Menu-item"
                        role="menuitem"
                        ?selected=${!n.localeCompare(
                          simulatorState.troopType.get()
                        )}
                        value="${n}"
                      >
                        ${n}
                      </option>
                    `;
                  })}
              </select>
            </td>
            <td class="spectrum-Table-cell">
              <input
                id="marchSize"
                class="spectrum-Textfield-input spectrum-Stepper-input"
                type="number"
                min="0"
                @change="${(e: Event) => {
                  const target = (e as CustomEvent)
                    .target as HTMLInputElement | null;
                  if (target) {
                    const valid = z.number().min(0).safeParse(+target.value);
                    if (valid.success) {
                      simulatorState.marchSize.set(valid.data);
                      this.requestUpdate();
                    } else {
                      console.error(`error parsing, ${valid.error.message}`);
                    }
                  }
                }}"
                value="${simulatorState.marchSize.get()}"
              />
            </td>
          </tbody>
        </table>
      </div>
    `;
  }
}
