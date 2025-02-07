import SpectrumCSStextfield from "@spectrum-css/textfield/dist/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/dist/index.css" with { type: "css" };

import { z } from "zod";

import {
  LitElement,
  html,
  unsafeCSS,
  css,
  type CSSResultGroup,
  nothing,
} from "lit";
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

  static override styles: CSSResultGroup = [
    unsafeCSS(SpectrumCSStextfield),
    unsafeCSS(SpectrumCSSstepper),
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
        <input
          id="MonsterOrder"
          class="spectrum-Textfield-input spectrum-Stepper-input"
          type="number"
          min="0"
          @change="${this.orderHandler}"
          value="${simulatorState.orderNumber.get()}"
        />
        ${DEBUG
          ? html`<span>Modifier is ${simulatorState.modifier.get()} </span>`
          : nothing}
      </div>
    `;
  }
}
