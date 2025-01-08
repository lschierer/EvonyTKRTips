import {
  LitElement,
  css,
  html,
  nothing,
  unsafeCSS,
  type CSSResultGroup,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { subscribeKeys, listenKeys } from "nanostores";
import { withStores } from "@nanostores/lit";

import "@spectrum-web-components/combobox/sp-combobox.js";
import "@spectrum-web-components/field-group/sp-field-group.js";
import "@spectrum-web-components/field-label/sp-field-label.js";
import "@spectrum-web-components/menu/sp-menu.js";
import "@spectrum-web-components/menu/sp-menu-item.js";
import "@spectrum-web-components/menu/sp-menu-divider.js";
import "@spectrum-web-components/number-field/sp-number-field.js";
import "@spectrum-web-components/picker/sp-picker.js";
import { Combobox } from "@spectrum-web-components/combobox";
import { NumberField } from "@spectrum-web-components/number-field";
import { Picker } from "@spectrum-web-components/picker";

import * as stores from "./store";

import * as constants from "@schemas/constants";
import { General, GeneralPair } from "@schemas/generals";
import { AscendingLevel } from "@schemas/constants";

import ValueSelectorCSS from "../../styles/valueSelector.css?inline";
const DEBUG = false;

export default class ValueSelector extends withStores(LitElement, [
  stores.selectedValues,
]) {
  constructor() {
    super();
  }

  override firstUpdated = async () => {
    if (DEBUG) {
      console.log(`firstUpdated start`);
    }
    await customElements.whenDefined("sp-picker").then(() => {
      if (DEBUG) {
        console.log(`sp-picker is now defined`);
      }
      Array.from(Array(4).keys()).map((n, index) => {
        if (DEBUG) {
          console.log(`getSetValues Array.from loop ${n}`);
        }
        /*#primary-speciality-0 */
        let specialityPicker = this.renderRoot?.querySelector(
          `#primary-speciality-${n}`
        );
        if (specialityPicker) {
          if (DEBUG) {
            console.log(`#primary-speciality-${n} found`);
          }
          specialityPicker.addEventListener("change", (event) => {
            if (DEBUG) {
              console.log(
                `EventListener for change for #primary-speciality-${n}`
              );
            }
            const target = event.target as Picker;
            const valid = constants.SpecialityLevelName.safeParse(target.value);
            if (valid.success) {
              stores.selectedValues.setKey(
                `primarySpecialityLevels[${index}]`,
                valid.data
              );
              let enable4 = false;
              Array.from(Array(4).keys()).map((n2) => {
                enable4 = this.enableSpecialityPicker(n2, "primary");
                if (!enable4) {
                  stores.selectedValues.setKey(
                    `primarySpecialityLevels[3]`,
                    constants.SpecialityLevelName.Enum.None
                  );
                }
              });

              if (enable4) {
                if (
                  !stores.selectedValues
                    .get()
                    .primarySpecialityLevels[3].localeCompare(
                      constants.SpecialityLevelName.Enum.None
                    )
                ) {
                  stores.selectedValues.setKey(
                    `primarySpecialityLevels[3]`,
                    constants.SpecialityLevelName.Enum.Green
                  );
                }
              }
            } else {
              if (DEBUG) {
                console.warn(`invalid value: ${valid.error.message}`);
              }
            }

            if (DEBUG) {
              console.log(
                `values are ${JSON.stringify(stores.selectedValues.value)}`
              );
            }

            this.requestUpdate("primarySpecialityLevels");
          });
        } else {
          console.warn(`#primary-speciality-${n} not found`);
        }
      });

      Array.from(Array(4).keys()).map((n, index) => {
        if (DEBUG) {
          console.log(`getSetValues Array.from loop ${n}`);
        }
        /*secondary picker */
        let specialityPicker = this.renderRoot?.querySelector(
          `#secondary-speciality-${n}`
        );
        if (specialityPicker) {
          if (DEBUG) {
            console.log(`#secondary-speciality-${n} found`);
          }
          specialityPicker.addEventListener("change", (event) => {
            if (DEBUG) {
              console.log(
                `EventListener for change for #secondary-speciality-${n}`
              );
            }
            const target = event.target as Picker;
            const valid = constants.SpecialityLevelName.safeParse(target.value);
            if (valid.success) {
              stores.selectedValues.setKey(
                `secondarySpecialityLevels[${index}]`,
                valid.data
              );
              let enable4 = false;
              Array.from(Array(4).keys()).map((n2) => {
                enable4 = this.enableSpecialityPicker(n2, "secondary");
                if (!enable4) {
                  stores.selectedValues.setKey(
                    `secondarySpecialityLevels[3]`,
                    constants.SpecialityLevelName.Enum.None
                  );
                }
              });

              if (enable4) {
                if (
                  !stores.selectedValues
                    .get()
                    .secondarySpecialityLevels[3].localeCompare(
                      constants.SpecialityLevelName.Enum.None
                    )
                ) {
                  stores.selectedValues.setKey(
                    `secondarySpecialityLevels[3]`,
                    constants.SpecialityLevelName.Enum.Green
                  );
                }
              }
            } else {
              if (DEBUG) {
                console.warn(`invalid value: ${valid.error.message}`);
              }
            }
            if (DEBUG) {
              console.log(
                `selected values are ${stores.selectedValues.get().secondarySpecialityLevels.join(" ")}`
              );
            }

            this.requestUpdate("secondarySpecialityLevels");
          });
        }
      });
      const ascendingSelector =
        this.renderRoot?.querySelector("#primary-ascending");
      if (ascendingSelector) {
        if (DEBUG) {
          console.log(`ascendingSelector found`);
        }
        ascendingSelector.addEventListener("change", (event) => {
          if (DEBUG) {
            console.log(`EventListener for change for #primary-ascending`);
          }
          const target = event.target as Picker;
          const valid = AscendingLevel.safeParse(target.value);
          if (valid.success) {
            stores.selectedValues.setKey("stars", valid.data);
            if (valid.data == AscendingLevel.Values.None) {
              stores.selectedValues.setKey("ascending", false);
            } else {
              stores.selectedValues.setKey("ascending", true);
            }
          }
          if (DEBUG) {
            console.log(`stars are ${valid.data}`);
          }
        });
      } else {
        if (DEBUG) {
          console.log(`ascendingSelector not found`);
        }
      }
      const typeSelector = this.renderRoot?.querySelector("#generalType");
      if (typeSelector) {
        if (DEBUG) {
          console.log(`typeSelector found`);
        }
        typeSelector.addEventListener("change", (event) => {
          const target = event.target as Picker;
          const valid = constants.GeneralType.safeParse(target.value);
          if (valid.success) {
            stores.selectedValues.setKey("type", valid.data);
          }
        });
      } else {
        if (DEBUG) {
          console.log(`typeSelector not found`);
        }
      }
    });

    await customElements.whenDefined("sp-number-field").then(() => {
      if (DEBUG) {
        console.log(`ValueSelector getSetValues whenDefined sp-number-field`);
      }
      const levelSelector = this.renderRoot?.querySelector("#level");
      if (levelSelector) {
        levelSelector.addEventListener("change", (event) => {
          if (DEBUG) {
            console.log(`ValueSelector levelSelector EventListener cb`);
          }
          const target = event.target as NumberField;
          if (DEBUG) {
            console.log(`target is ${target.value}`);
          }
          if (isNaN(target.value)) {
            stores.selectedValues.setKey("level", 1);
          } else {
            stores.selectedValues.setKey("level", target.value);
          }
          if (DEBUG) {
            console.log(`level is ${target.value}`);
          }
        });
      } else {
        console.warn(`#level not found`);
      }
    });
  };

  protected enableSpecialityPicker = (
    n: number,
    role: "primary" | "secondary" = "primary"
  ) => {
    if (!role.localeCompare("primary")) {
      if (stores.selectedValues.get().primarySpecialityLevels.length < 4) {
        Array.from(Array(4).keys()).map((n, index) => {
          stores.selectedValues.setKey(
            `primarySpecialityLevels[${index}]`,
            constants.SpecialityLevelName.Enum.None
          );
        });
      }
    } else {
      if (stores.selectedValues.get().secondarySpecialityLevels.length < 4) {
        Array.from(Array(4).keys()).map((n, index) => {
          stores.selectedValues.setKey(
            `secondarySpecialityLevels[${index}]`,
            constants.SpecialityLevelName.Enum.None
          );
        });
      }
    }
    if (n != 3) {
      return true;
    } else if (
      !role.localeCompare("primary") &&
      !stores.selectedValues
        .get()
        .primarySpecialityLevels[0].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        ) &&
      !stores.selectedValues
        .get()
        .primarySpecialityLevels[1].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        ) &&
      !stores.selectedValues
        .get()
        .primarySpecialityLevels[2].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        )
    ) {
      return true;
    } else if (
      !role.localeCompare("secondary") &&
      !stores.selectedValues
        .get()
        .secondarySpecialityLevels[0].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        ) &&
      !stores.selectedValues
        .get()
        .secondarySpecialityLevels[1].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        ) &&
      !stores.selectedValues
        .get()
        .secondarySpecialityLevels[2].localeCompare(
          constants.SpecialityLevelName.Enum.Gold
        )
    ) {
      return true;
    }
    return false;
  };

  static override styles: CSSResultGroup = [unsafeCSS(ValueSelectorCSS)];

  protected override render(): unknown {
    return html`
      <div class="primary not-content">
        <sp-field-label>Primary General Options</sp-field-label>
        <div class="firstRow">
          <div class="flexColumn">
            <sp-field-label for="generalType" size="m"
              >General Type:</sp-field-label
            >
            <sp-picker
              id="generalType"
              size="m"
              label="General Type"
              value="${stores.selectedValues.get().type}"
            >
              <span slot="label">Which type of General?</span>
              ${constants.GeneralType.options.map((gt) => {
                return html`
                  <sp-menu-item value="${gt}">
                    ${gt[0].toUpperCase() + gt.slice(1).replaceAll("_", " ")}
                  </sp-menu-item>
                `;
              })}
            </sp-picker>
          </div>
          <div class="flexColumn">
            <sp-field-label for="level" size="m">General Level</sp-field-label>
            <sp-number-field
              id="level"
              value="${stores.selectedValues.get().level}"
              min="1"
              max="45"
              step="1"
              style="width: 5rem"
            ></sp-number-field>
          </div>
          <div class="flexColumn">
            <sp-field-label for="primary-ascending" size="m"
              >Ascending Level:</sp-field-label
            >
            <sp-picker
              id="primary-ascending"
              size="m"
              label="Ascending Level"
              value="${stores.selectedValues.get().stars}"
              style="width: 7rem;"
            >
              <span slot="label">Choose an Ascending Level:</span>
              ${constants.AscendingLevel.options.map((al) => {
                return html`<sp-menu-item value="${al}">${al}</sp-menu-item>`;
              })}
            </sp-picker>
          </div>
        </div>
        <div class="secondRow">
          ${Array.from(Array(4).keys()).map((n) => {
            return html`
              <div class="flexColumn speciality-${n}">
                <sp-field-label for="primary-speciality-${n}" size="m"
                  >Speciality Level:</sp-field-label
                >
                <sp-picker
                  ?disabled=${this.enableSpecialityPicker(n, "primary")
                    ? false
                    : true}
                  id="primary-speciality-${n}"
                  size="m"
                  value="${stores.selectedValues.get().primarySpecialityLevels[
                    n
                  ]}"
                  style="width: 7rem;"
                >
                  <span slot="label">Choose a Speciality Level:</span>
                  ${constants.SpecialityLevelName.options.map((spn) => {
                    if (
                      !spn.localeCompare(
                        stores.selectedValues.get().primarySpecialityLevels[n]
                      )
                    ) {
                      return html`<sp-menu-item value="${spn}" selected
                        >${spn}</sp-menu-item
                      >`;
                    } else {
                      return html`<sp-menu-item value="${spn}"
                        >${spn}</sp-menu-item
                      >`;
                    }
                  })}
                </sp-picker>
              </div>
            `;
          })}
        </div>
      </div>
      <div class="primary not-content">
        <sp-field-label>Secondary General Options</sp-field-label>
        <div class="firstRow">
          ${Array.from(Array(4).keys()).map((n) => {
            return html`
              <div class="not-content speciality-${n}">
                <sp-field-label for="secondary-speciality-${n}" size="m"
                  >Speciality Level:</sp-field-label
                >
                <sp-picker
                  id="secondary-speciality-${n}"
                  ?disabled=${this.enableSpecialityPicker(n, "secondary")
                    ? false
                    : true}
                  size="m"
                  label="Speciality Level"
                  value="${stores.selectedValues.get()
                    .secondarySpecialityLevels[n] ??
                  constants.SpecialityLevelName.Enum.None}"
                  style="width: 7rem;"
                >
                  <span slot="label">Choose a Speciality Level:</span>
                  ${constants.SpecialityLevelName.options.map((spn) => {
                    return html`<sp-menu-item value="${spn}"
                      >${spn}</sp-menu-item
                    >`;
                  })}
                </sp-picker>
              </div>
            `;
          })}
        </div>
        <div class="secondRow"></div>
      </div>
    `;
  }
}
customElements.define("value-selector", ValueSelector);
