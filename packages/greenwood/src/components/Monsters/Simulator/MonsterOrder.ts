import SpectrumCSStextfield from "@spectrum-css/textfield/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/index.css" with { type: "css" };
import SpectrumCSSinfieldbutton from "@spectrum-css/infieldbutton/index.css" with { type: "css" };

import "iconify-icon";
import { z } from "zod";

import { LitElement, html, css, nothing } from "lit";

import { customElement } from "lit/decorators.js";

import { SignalWatcher } from "@lit-labs/signals";

import simulatorState from "./state.ts";

import { getModifier } from "./reference.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/Monsters/Simulator/MonsterOrder.ts");

@customElement("monster-order")
export default class MonsterOrder extends SignalWatcher(LitElement) {
  private orderHandler = async (e: Event) => {
    const target = (e as CustomEvent).target as HTMLInputElement | null;
    if (target) {
      const valid = z.number().min(0).safeParse(+target.value);
      if (valid.success) {
        if (DEBUG) {
          console.log(`setting value ${valid.data} for MonsterOrder`);
        }
        simulatorState.orderNumber.set(valid.data);
        await getModifier();
      } else {
        console.error(`error parsing, ${valid.error.message}`);
      }
    }
  };

  static override styles = [
    SpectrumCSStextfield,
    SpectrumCSSstepper,
    SpectrumCSSinfieldbutton,
    css`
      input.spectrum-Textfield-input.spectrum-Stepper-input {
        width: 4rem;
      }
    `,
  ];

  protected override render() {
    return html`
      <div class="MonsterOrder">
        <span>Order Number: </span>
        <div
          class=" spectrum-Stepper spectrum-Stepper--sizeM "
          id="stepper-vpbqf"
          style="--mod-actionbutton-icon-size:10px;"
        >
          <div
            class="spectrum-Textfield spectrum-Textfield--sizeM spectrum-Stepper-textfield"
            style=""
            id="stepper-vpbqf-input"
          >
            <input
              type="number"
              id="MonsterOrder"
              class=" spectrum-Textfield-input spectrum-Stepper-input "
              min="0"
              @change="${this.orderHandler}"
              value="${simulatorState.orderNumber.get()}"
            />
          </div>
          <span class="spectrum-Stepper-buttons">
            <button
              aria-haspopup="listbox"
              type="button"
              class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--top spectrum-Stepper-button "
              tabindex="-1"
            >
              <div class="spectrum-InfieldButton-fill">
                <iconify-icon
                  icon="ion:chevron-up"
                  width="1rem"
                  focusable="false"
                  aria-hidden="true"
                  role="img"
                  class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                ></iconify-icon>
              </div>
            </button>
            <button
              aria-haspopup="listbox"
              type="button"
              class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--bottom spectrum-Stepper-button "
              tabindex="-1"
            >
              <div class="spectrum-InfieldButton-fill">
                <iconify-icon
                  icon="ion:chevron-down"
                  width="1rem"
                  focusable="false"
                  aria-hidden="true"
                  role="img"
                  class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                ></iconify-icon>
              </div>
            </button>
          </span>
        </div>

        ${DEBUG
          ? html`<span>Modifier is ${simulatorState.modifier.get()} </span>`
          : nothing}
      </div>
    `;
  }
}
