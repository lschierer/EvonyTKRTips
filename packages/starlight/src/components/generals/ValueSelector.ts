import {
  LitElement,
  css,
  html,
  nothing,
  unsafeCSS,
  type CSSResultGroup,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { subscribeKeys } from "nanostores";

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

import { selectedValues, generals } from "./store";

import * as constants from "@schemas/constants";
import { General, GeneralPair, GeneralType } from "@schemas/generals";
import { AscendingLevel } from "@schemas/constants";

import ValueSelectorCSS from "../../styles/valueSelector.css?inline";
const DEBUG = true;

export default class ValueSelector extends LitElement {
  @state()
  private level = 1;

  @state()
  private stars: constants.AscendingLevel = constants.AscendingLevel.Enum.None;

  @state()
  private ascending = false;

  @state()
  private generalType: GeneralType = GeneralType.Enum.mounted_specialist;

  @state()
  private primarySpecialityLevels: constants.SpecialityLevelName[] =
    new Array<constants.SpecialityLevelName>();

  @state()
  private secondarySpecialityLevels: constants.SpecialityLevelName[] =
    new Array<constants.SpecialityLevelName>();

  constructor() {
    super();

    subscribeKeys(
      selectedValues,
      [
        "level",
        "ascending",
        "type",
        "primarySpecialityLevels",

        "secondarySpecialityLevels",
      ],
      (value, oldValue?, changed?) => {
        if (DEBUG) {
          console.log(
            `changed includes ${changed ? JSON.stringify(changed) : '""'}`
          );
        }
        if (!changed) {
          this.level = value.level;
          this.ascending = value.ascending;
          this.stars = value.stars;
          this.generalType = value.type;
          this.primarySpecialityLevels[0] = value.primarySpecialityLevels[0];
          this.primarySpecialityLevels[1] = value.primarySpecialityLevels[1];
          this.primarySpecialityLevels[2] = value.primarySpecialityLevels[2];
          this.primarySpecialityLevels[3] = value.primarySpecialityLevels[3];
          this.secondarySpecialityLevels[0] =
            value.secondarySpecialityLevels[0];
          this.secondarySpecialityLevels[1] =
            value.secondarySpecialityLevels[1];
          this.secondarySpecialityLevels[2] =
            value.secondarySpecialityLevels[2];
          this.secondarySpecialityLevels[3] =
            value.secondarySpecialityLevels[3];
        } else {
          if (changed.includes("level")) {
            this.level = value.level;
          }
          if (changed.includes("ascending") || this.ascending) {
            this.ascending = value.ascending;
            this.stars = value.stars;
          }
          if (changed.includes("type")) {
            if (Array.isArray(value.type)) {
              this.generalType = value.type[0];
            } else {
              this.generalType = value.type;
            }
          }
          if (changed.includes(`primarySpecialityLevels`)) {
            Array.from(Array(4).keys()).map((n) => {
              this.primarySpecialityLevels[n] =
                value.primarySpecialityLevels[n];
              this.requestUpdate("primarySpecialityLevels");
            });
          }
          if (changed.includes(`secondarySpecialityLevels`)) {
            Array.from(Array(4).keys()).map((n) => {
              this.secondarySpecialityLevels[n] =
                value.secondarySpecialityLevels[n];
              this.requestUpdate("secondarySpecialityLevels");
            });
          }
        }
      }
    );
  }

  override firstUpdated = async () => {
    if (DEBUG) {
      console.log(`firstUpdated start`);
    }
    await customElements.whenDefined("sp-picker").then(() => {
      if (DEBUG) {
        console.log(`sp-picker is now defined`);
      }
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
            this.stars = valid.data;
            if (this.stars == AscendingLevel.Values.None) {
              this.ascending = false;
              selectedValues.setKey("ascending", false);
              selectedValues.setKey("stars", "None");
            } else {
              this.ascending = true;
              selectedValues.setKey("ascending", true);
              selectedValues.setKey("stars", this.stars);
            }
          }
          if (DEBUG) {
            console.log(`stars are ${this.stars}`);
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
          const valid = GeneralType.safeParse(target.value);
          if (valid.success) {
            this.generalType = valid.data;
            selectedValues.setKey("type", valid.data);
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
            this.level = 1;
          } else {
            this.level = target.value;
          }
          if (DEBUG) {
            console.log(`level is ${this.level}`);
          }
          selectedValues.setKey("level", this.level);
        });
      } else {
        console.warn(`#level not found`);
      }
    });
    Array.from(Array(4).keys()).map((n) => {
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
            if (n == 3) {
              if (
                !this.primarySpecialityLevels[0].localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                ) &&
                !this.primarySpecialityLevels[1].localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                ) &&
                !this.primarySpecialityLevels[2].localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                )
              ) {
                this.primarySpecialityLevels[3] = valid.data;
              } else {
                if (DEBUG) {
                  console.log(`setting 3 to none`);
                }
                this.primarySpecialityLevels[3] =
                  constants.SpecialityLevelName.Enum.None;
              }
            } else {
              if (DEBUG) {
                console.log(`n is ${n}, value is ${valid.data}`);
              }
              if (
                valid.data.localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                )
              ) {
                if (DEBUG) {
                  console.log(`${n} was not gold`);
                }
                this.primarySpecialityLevels[3] =
                  constants.SpecialityLevelName.Enum.None;
                this.primarySpecialityLevels[n] = valid.data;
              } else {
                if (DEBUG) {
                  console.log(`setting gold for ${n}`);
                }
                this.primarySpecialityLevels[n] = valid.data;
                if (
                  !this.primarySpecialityLevels[0].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  ) &&
                  !this.primarySpecialityLevels[1].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  ) &&
                  !this.primarySpecialityLevels[2].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  )
                ) {
                  if (DEBUG) {
                    console.log(`first 3 are gold`);
                  }
                  this.primarySpecialityLevels[3] =
                    constants.SpecialityLevelName.Enum.Green;
                } else {
                  if (DEBUG) {
                    console.log(`first 3 not all gold`);
                    console.log(this.primarySpecialityLevels.join(" "));
                  }
                }
              }
            }
          } else {
            if (DEBUG) {
              console.warn(`invalid value: ${valid.error.message}`);
            }
          }
          if (DEBUG) {
            console.log(
              `selected values are ${this.primarySpecialityLevels.join(" ")}`
            );
          }
          selectedValues.setKey(
            "primarySpecialityLevels",
            this.primarySpecialityLevels
          );
          this.requestUpdate("primarySpecialityLevels");
        });
      } else {
        console.warn(`#primary-speciality-${n} not found`);
      }
      specialityPicker = this.renderRoot?.querySelector(
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
            if (n == 3) {
              if (
                !this.secondarySpecialityLevels[0].localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                ) &&
                !this.secondarySpecialityLevels[1].localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                ) &&
                !this.secondarySpecialityLevels[2].localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                )
              ) {
                this.secondarySpecialityLevels[3] = valid.data;
              } else {
                if (DEBUG) {
                  console.log(`setting 3 to none`);
                }
                this.secondarySpecialityLevels[3] =
                  constants.SpecialityLevelName.Enum.None;
              }
            } else {
              if (DEBUG) {
                console.log(`n is ${n}, value is ${valid.data}`);
              }
              if (
                valid.data.localeCompare(
                  constants.SpecialityLevelName.Enum.Gold
                )
              ) {
                if (DEBUG) {
                  console.log(`${n} was not gold`);
                }
                this.secondarySpecialityLevels[3] =
                  constants.SpecialityLevelName.Enum.None;
                this.secondarySpecialityLevels[n] = valid.data;
              } else {
                if (DEBUG) {
                  console.log(`setting gold for ${n}`);
                }
                this.secondarySpecialityLevels[n] = valid.data;
                if (
                  !this.secondarySpecialityLevels[0].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  ) &&
                  !this.secondarySpecialityLevels[1].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  ) &&
                  !this.secondarySpecialityLevels[2].localeCompare(
                    constants.SpecialityLevelName.Enum.Gold
                  )
                ) {
                  if (DEBUG) {
                    console.log(`first 3 are gold`);
                  }
                  this.secondarySpecialityLevels[3] =
                    constants.SpecialityLevelName.Enum.Green;
                } else {
                  if (DEBUG) {
                    console.log(`first 3 not all gold`);
                    console.log(this.secondarySpecialityLevels.join(" "));
                  }
                }
              }
            }
          } else {
            if (DEBUG) {
              console.warn(`invalid value: ${valid.error.message}`);
            }
          }
          if (DEBUG) {
            console.log(
              `selected values are ${this.secondarySpecialityLevels.join(" ")}`
            );
          }
          selectedValues.setKey(
            "secondarySpecialityLevels",
            this.secondarySpecialityLevels
          );
          this.requestUpdate("secondarySpecialityLevels");
        });
      }
    });
  };

  protected enableSpecialityPicker = (
    n: number,
    role: "primary" | "secondary" = "primary"
  ) => {
    if (n != 3) {
      return true;
    } else if (
      !role.localeCompare("primary") &&
      !this.primarySpecialityLevels[0].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      ) &&
      !this.primarySpecialityLevels[1].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      ) &&
      !this.primarySpecialityLevels[2].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      )
    ) {
      return true;
    } else if (
      !role.localeCompare("secondary") &&
      !this.secondarySpecialityLevels[0].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      ) &&
      !this.secondarySpecialityLevels[1].localeCompare(
        constants.SpecialityLevelName.Enum.Gold
      ) &&
      !this.secondarySpecialityLevels[2].localeCompare(
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
              value="${this.generalType}"
            >
              <span slot="label">Which type of General?</span>
              ${GeneralType.options.map((gt) => {
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
              value="${this.level}"
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
              value="${this.stars}"
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
                  value="${this.primarySpecialityLevels[n]}"
                  style="width: 7rem;"
                >
                  <span slot="label">Choose a Speciality Level:</span>
                  ${constants.SpecialityLevelName.options.map((spn) => {
                    if (!spn.localeCompare(this.primarySpecialityLevels[n])) {
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
                  value="${this.secondarySpecialityLevels[n] ??
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
