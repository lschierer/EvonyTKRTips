import { Constants, Generals } from "@evonytkrtips/schemas";

import { type CSSResultGroup, LitElement } from "lit";
import { SignalWatcher, html } from "@lit-labs/signals";
import { SignalArray } from "signal-utils/array";
import { SignalObject } from "signal-utils/object";
import { state } from "lit/decorators.js";

const general = new SignalObject<Generals.General>({
  name: "",
  ascending: true,
  book: "",
  specialities: new SignalArray<string>([]),
  stars: Constants.AscendingLevel.Enum.None,
  type: new SignalArray<Constants.GeneralType>([]),
  basic_attributes: {
    attack: {
      base: 0,
      increment: 0,
    },
    defense: {
      base: 0,
      increment: 0,
    },
    leadership: {
      base: 0,
      increment: 0,
    },
    politics: {
      base: 0,
      increment: 0,
    },
  },
});

export default class GeneralBuilderForm extends SignalWatcher(LitElement) {
  static override styles?: CSSResultGroup | undefined;

  @state() private _error: boolean = false;

  @state() private _error_message: string = "";

  protected override render() {
    const valid = Generals.General.safeParse(general);
    if (!valid.success && !this._error) {
      this._error = true;
      this._error_message = valid.error.message;
    } else if (!valid.success && this._error) {
      if (this._error_message.localeCompare(valid.error.message)) {
        this._error_message = valid.error.message;
      }
    }
    return html`
      <form
        id="GeneralBuilderForm"
      >
        <div class="form-group">
          <label for="name">General Name</label>
          <input
            type="text"
            id="name"
            class="form-control"
            value="${general.name}"
            required
            @change="${(e: Event) => {
              const target = (e as CustomEvent).target;
              if (target) {
                const value = (target as HTMLInputElement).value;
                general.name = value;
              }
            }}"
          ></input>
        </div>
        <div class="form-group>">
          <label for="ascending">Ascending</label>
          <input type="checkbox" id="ascending" required
            .checked=${general.ascending}
            @change="${(e: Event) => {
              const target = (e as CustomEvent).target;
              if (target) {
                general.ascending = !general.ascending;
              }
            }}"
          ></input>
        </div>
        <div class="form-group">
          <label for="basic_attributes.attack.base">Attack</label>
          <input
            type="number"
            id="basic_attributes.attack.base"
            class="form-control"
            required
            @change="${(e: Event) => {
              const target = (e as CustomEvent).target;
              if (target) {
                const value = (target as HTMLInputElement).value;
                general.basic_attributes.attack.base = parseFloat(value);
              }
            }}"
          ></input>
        </div>
      </form>
      <div class="result">
        ${
          this._error
            ? html` <span>${this._error_message}</span> `
            : html`<pre> ${JSON.stringify(general, null, 2)} </pre>`
        }
      </div>
    `;
  }
}

customElements.define("general-builder-form", GeneralBuilderForm);
