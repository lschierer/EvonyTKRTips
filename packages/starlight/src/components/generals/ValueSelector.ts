import {
  LitElement,
  css,
  html,
  nothing,
  unsafeCSS,
  type CSSResultGroup,
  type PropertyValues,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { subscribeKeys, listenKeys } from "nanostores";
import { withStores, StoreController } from "@nanostores/lit";

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
  stores.primarySpecialityLevels,
  stores.secondarySpecialityLevels,
  stores.generalSpecalist,
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
        /*#primary-speciality-0 */
        let specialityPicker = this.renderRoot?.querySelector(
          `#primary-speciality-${n}`
        );
        if (specialityPicker) {
          if (DEBUG) {
            console.log(`#primary-speciality-${n} found`);
          }
          specialityPicker.addEventListener("change", (event) => {
            const ps = stores.primarySpecialityLevels.get();
            if (DEBUG) {
              console.log(
                `EventListener for change for #primary-speciality-${n}`
              );
            }
            const target = event.target as Picker;
            const valid = constants.SpecialityLevelName.safeParse(target.value);
            if (valid.success) {
              stores.setPrimaryLevel(valid.data, index);
              let enable4 = false;

              Array.from(Array(4).keys()).map((n2, index) => {
                enable4 = this.enableSpecialityPicker(n2, "primary");
                if (!enable4) {
                  stores.setPrimaryLevel(
                    constants.SpecialityLevelName.Enum.None,
                    3
                  );
                }
              });

              if (enable4) {
                if (
                  !ps[3].localeCompare(constants.SpecialityLevelName.Enum.None)
                ) {
                  stores.setPrimaryLevel(
                    constants.SpecialityLevelName.Enum.Green,
                    3
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
                `event listener sees primary values: ${JSON.stringify(stores.primarySpecialityLevels.value)}`
              );
            }
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
            const ss = stores.secondarySpecialityLevels.get();
            if (DEBUG) {
              console.log(
                `EventListener for change for #secondary-speciality-${n}`
              );
            }
            const target = event.target as Picker;
            const valid = constants.SpecialityLevelName.safeParse(target.value);
            if (valid.success) {
              stores.setSecondaryLevel(valid.data, index);

              let enable4 = false;
              Array.from(Array(4).keys()).map((n2) => {
                enable4 = this.enableSpecialityPicker(n2, "secondary");
                if (!enable4) {
                  stores.setSecondaryLevel(
                    constants.SpecialityLevelName.Enum.None,
                    3
                  );
                }
              });

              if (enable4) {
                if (
                  !ss[3].localeCompare(constants.SpecialityLevelName.Enum.None)
                ) {
                  stores.setSecondaryLevel(
                    constants.SpecialityLevelName.Enum.Green,
                    3
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
                `secondary event listener sees values: ${stores.secondarySpecialityLevels.value.join(" ")}`
              );
            }
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
            stores.generalSpecalist.set(valid.data);
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

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("primarySpecialityLevels")) {
      if (DEBUG) {
        console.log(`willupdate sees change to primarySpecialityLevels`);
      }
    }
  }

  protected enableSpecialityPicker = (
    n: number,
    role: "primary" | "secondary" = "primary"
  ) => {
    if (!role.localeCompare("primary")) {
      const ps = stores.primarySpecialityLevels.get();
      if (ps.length < 4) {
        Array.from(Array(4).keys()).map((n, index) => {
          ps[index] = constants.SpecialityLevelName.Enum.None;
        });
        stores.primarySpecialityLevels.set(ps);
      }
    } else {
      const ss = stores.secondarySpecialityLevels.get();
      if (ss.length < 4) {
        Array.from(Array(4).keys()).map((n, index) => {
          ss[index] = constants.SpecialityLevelName.Enum.None;
        });
      }
    }
    if (n != 3) {
      return true;
    } else if (
      !role.localeCompare("primary") &&
      !stores.primarySpecialityLevels
        .get()[0]
        .localeCompare(constants.SpecialityLevelName.Enum.Gold) &&
      !stores.primarySpecialityLevels
        .get()[1]
        .localeCompare(constants.SpecialityLevelName.Enum.Gold) &&
      !stores.primarySpecialityLevels
        .get()[2]
        .localeCompare(constants.SpecialityLevelName.Enum.Gold)
    ) {
      return true;
    } else if (
      !role.localeCompare("secondary") &&
      !stores.secondarySpecialityLevels.value[0].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      ) &&
      !stores.secondarySpecialityLevels.value[1].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      ) &&
      !stores.secondarySpecialityLevels.value[2].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      )
    ) {
      return true;
    }
    return false;
  };

  static override styles: CSSResultGroup = [unsafeCSS(ValueSelectorCSS)];

  protected override render() {
    if (DEBUG) {
      console.log(
        `render sees primarySpecialityLevels: ${stores.primarySpecialityLevels.value.join(" ")}`
      );
      console.log(
        `render sees secondarySpecialityLevels: ${stores.secondarySpecialityLevels.value.join(" ")}`
      );
    }
    return html`
      <div class="pairOptions not-content">
        <sp-field-label>Generic Options</sp-field-label>
        <div class="firstRow">
          <div class="flexColumn">
            <sp-field-label for="generalType" size="m"
              >General Type:</sp-field-label
            >
            <sp-picker
              id="generalType"
              size="m"
              label="General Type"
              value="${stores.generalSpecalist.value}"
            >
              <span slot="label">Which type of General?</span>
              ${constants.GeneralType.options
                .filter((gt) => {
                  return gt.localeCompare(constants.GeneralType.Enum.mayor);
                })
                .map((gt) => {
                  return html`
                    <sp-menu-item value="${gt}">
                      ${gt[0].toUpperCase() + gt.slice(1).replaceAll("_", " ")}
                    </sp-menu-item>
                  `;
                })}
            </sp-picker>
          </div>
        </div>
      </div>
      <div class="primary not-content">
        <sp-field-label>Primary General Options</sp-field-label>
        <div class="firstRow">
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
                  value="${stores.primarySpecialityLevels.value[n]}"
                  style="width: 7rem;"
                >
                  <span slot="label">Choose a Speciality Level:</span>
                  ${constants.SpecialityLevelName.options.map((spn) => {
                    if (
                      !spn.localeCompare(
                        stores.primarySpecialityLevels.value[n]
                      )
                    ) {
                      return html` <sp-menu-item value="${spn}" selected>
                        ${spn}
                      </sp-menu-item>`;
                    } else {
                      return html` <sp-menu-item value="${spn}">
                        ${spn}
                      </sp-menu-item>`;
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
                  value="${stores.secondarySpecialityLevels.value[n] ??
                  constants.SpecialityLevelName.Enum.None}"
                  style="width: 7rem;"
                >
                  <span slot="label">Choose a Speciality Level:</span>
                  ${constants.SpecialityLevelName.options.map((spn) => {
                    if (
                      !spn.localeCompare(
                        stores.secondarySpecialityLevels.value[n]
                      )
                    ) {
                      return html` <sp-menu-item value="${spn}" selected>
                        ${spn}
                      </sp-menu-item>`;
                    } else {
                      return html` <sp-menu-item value="${spn}">
                        ${spn}
                      </sp-menu-item>`;
                    }
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
