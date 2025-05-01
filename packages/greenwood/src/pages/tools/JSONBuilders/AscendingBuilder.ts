export const prerender = false;

import type { GetFrontmatter } from "@greenwood/cli";
import { Constants, Ascending } from "@evonytkrtips/schemas";
import type { SafeParseSuccess, SafeParseError } from "zod";

const getFrontmatter: GetFrontmatter = async () => {
  return Promise.resolve({
    title: "Ascending JSON Builder",
    layout: "standard",
  });
};

export { getFrontmatter };

export default class AscendingBuilderPage extends HTMLElement {
  private formData = {
    id: "",
    general: "",
    ascending: [] as unknown[],
  };

  private validationResult:
    | SafeParseSuccess<Ascending.GeneralAscending>
    | SafeParseError<Ascending.GeneralAscending>
    | undefined = undefined;
  private jsonOutput = "";

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    setTimeout(() => {
      // Form submission
      const form = this.querySelector("#ascending-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.validateAndGenerateJSON();
        });
      }

      // Add ascending level button
      const addLevelBtn = this.querySelector("#add-level");
      if (addLevelBtn) {
        addLevelBtn.addEventListener("click", () => {
          this.addAscendingLevelField();
        });
      }
    }, 0);
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = Ascending.GeneralAscending.safeParse(this.formData);
    this.validationResult = result;

    if (result.success) {
      this.jsonOutput = JSON.stringify(result.data, null, 2);
    } else {
      this.jsonOutput = "";
    }

    // Update the output section
    this.updateOutput();
  }

  private collectFormData() {
    // Basic fields
    this.formData.id =
      (this.querySelector("#id") as HTMLInputElement).value || "";
    this.formData.general =
      (this.querySelector("#general") as HTMLInputElement).value || "";

    // Ascending levels
    this.formData.ascending = [];
    const levelContainers = this.querySelectorAll(".ascending-level-container");

    levelContainers.forEach((container) => {
      const level = (
        container.querySelector(".level-select") as HTMLSelectElement
      ).value as Constants.AscendingLevel | null;

      if (level) {
        const buffContainers = container.querySelectorAll(".buff-container");
        const buffs: unknown[] = [];

        buffContainers.forEach((buffContainer) => {
          const attribute = (
            buffContainer.querySelector(".buff-attribute") as HTMLSelectElement
          ).value;
          const valueNumber = parseFloat(
            (
              buffContainer.querySelector(
                ".buff-value-number"
              ) as HTMLInputElement
            ).value || "0"
          );
          const valueUnit = (
            buffContainer.querySelector(".buff-value-unit") as HTMLSelectElement
          ).value as Constants.Unit;
          const troopClass =
            (buffContainer.querySelector(".buff-class") as HTMLSelectElement)
              .value || undefined;

          // Collect conditions
          const conditionSelects = buffContainer.querySelectorAll(
            ".buff-condition"
          ) as NodeListOf<HTMLSelectElement> | null;
          const conditions: string[] = [];

          if (conditionSelects) {
            conditionSelects.forEach((select) => {
              if (select.value) {
                conditions.push(select.value);
              }
            });
          }

          if (attribute) {
            const buff = {
              attribute,
              value: {
                number: valueNumber,
                unit: valueUnit,
              },
              ...(troopClass && troopClass !== "none"
                ? { class: troopClass }
                : {}),
              ...(conditions.length > 0 ? { condition: conditions } : {}),
            };

            buffs.push(buff);
          }
        });

        if (buffs.length > 0) {
          this.formData.ascending.push({
            level,
            buff: buffs,
          });
        }
      }
    });
  }

  private updateOutput() {
    const outputContainer = this.querySelector("#output-container");
    if (!outputContainer) return;

    if (this.validationResult && this.validationResult.success) {
      outputContainer.innerHTML = `
        <h3>Valid JSON:</h3>
        <pre class="json-output">${this.jsonOutput}</pre>
        <button id="copy-json" class="spectrum-Button spectrum-Button--primary">Copy to Clipboard</button>
      `;

      // Add copy button functionality
      const copyBtn = this.querySelector("#copy-json");
      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          navigator.clipboard
            .writeText(this.jsonOutput)
            .then(() => {
              alert("JSON copied to clipboard!");
            })
            .catch((err: unknown) => {
              console.error("Failed to copy: ", err);
            });
        });
      }
    } else if (this.validationResult) {
      outputContainer.innerHTML = `
        <h3>Validation Errors:</h3>
        <pre class="error-output">${JSON.stringify(this.validationResult.error.format(), null, 2)}</pre>
      `;
    }
  }

  private addAscendingLevelField() {
    const container = this.querySelector("#ascending-levels-container");
    if (!container) return;

    const levelDiv = document.createElement("div");
    levelDiv.className = "ascending-level-container";
    levelDiv.innerHTML = `
      <div class="level-header">
        <select class="level-select spectrum-Dropdown">
          <option value="">Select Level</option>
          ${Object.values(Constants.AscendingLevel.Enum)
            .map((level) => `<option value="${level}">${level}</option>`)
            .join("")}
        </select>
        <button type="button" class="add-buff spectrum-Button spectrum-Button--primary">Add Buff</button>
        <button type="button" class="remove-level spectrum-Button spectrum-Button--negative">Remove Level</button>
      </div>
      <div class="buffs-container"></div>
    `;

    container.appendChild(levelDiv);

    // Add event listeners for this level
    const addBuffBtn = levelDiv.querySelector(".add-buff");
    if (addBuffBtn) {
      addBuffBtn.addEventListener("click", () => {
        this.addBuffField(
          levelDiv.querySelector(".buffs-container") as HTMLElement
        );
      });
    }

    const removeLevelBtn = levelDiv.querySelector(".remove-level");
    if (removeLevelBtn) {
      removeLevelBtn.addEventListener("click", () => {
        container.removeChild(levelDiv);
      });
    }
  }

  private addBuffField(container: HTMLElement) {
    const buffDiv = document.createElement("div");
    buffDiv.className = "buff-container";
    buffDiv.innerHTML = `
      <div class="buff-header">
        <select class="buff-attribute spectrum-Dropdown">
          <option value="">Select Attribute</option>
          ${Object.values(Constants.Attribute.Enum)
            .map((attr) => `<option value="${attr}">${attr}</option>`)
            .join("")}
        </select>
        <button type="button" class="remove-buff spectrum-Button spectrum-Button--negative">Remove</button>
      </div>
      <div class="buff-value">
        <input type="number" class="buff-value-number spectrum-Textfield" placeholder="Value" step="0.1">
        <select class="buff-value-unit spectrum-Dropdown">
          <option value="">Select Unit</option>
          ${Object.values(Constants.Unit.Enum)
            .map((unit) => `<option value="${unit}">${unit}</option>`)
            .join("")}
        </select>
      </div>
      <div class="buff-class-container">
        <select class="buff-class spectrum-Dropdown">
          <option value="none">No Troop Class</option>
          ${Object.values(Constants.TroopClass.Enum)
            .map((cls) => `<option value="${cls}">${cls}</option>`)
            .join("")}
        </select>
      </div>
      <div class="buff-conditions">
        <button type="button" class="add-condition spectrum-Button spectrum-Button--primary">Add Condition</button>
        <div class="conditions-container"></div>
      </div>
    `;

    container.appendChild(buffDiv);

    // Add event listeners for this buff
    const removeBuffBtn = buffDiv.querySelector(".remove-buff");
    if (removeBuffBtn) {
      removeBuffBtn.addEventListener("click", () => {
        container.removeChild(buffDiv);
      });
    }

    const addConditionBtn = buffDiv.querySelector(".add-condition");
    if (addConditionBtn) {
      addConditionBtn.addEventListener("click", () => {
        this.addConditionField(
          buffDiv.querySelector(".conditions-container") as HTMLElement
        );
      });
    }
  }

  private addConditionField(container: HTMLElement) {
    const conditionDiv = document.createElement("div");
    conditionDiv.className = "condition-container";
    conditionDiv.innerHTML = `
      <select class="buff-condition spectrum-Dropdown">
        <option value="">Select Condition</option>
        <optgroup label="Buff Conditions">
          ${Object.values(Constants.BuffCondition.Enum)
            .map((cond) => `<option value="${cond}">${cond}</option>`)
            .join("")}
        </optgroup>
        <optgroup label="Debuff Conditions">
          ${Object.values(Constants.DebuffCondition.Enum)
            .map((cond) => `<option value="${cond}">${cond}</option>`)
            .join("")}
        </optgroup>
        <optgroup label="Book Conditions">
          ${Object.values(Constants.BookCondition.Enum)
            .map((cond) => `<option value="${cond}">${cond}</option>`)
            .join("")}
        </optgroup>
      </select>
      <button type="button" class="remove-condition spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(conditionDiv);

    // Add event listener for removing this condition
    const removeConditionBtn = conditionDiv.querySelector(".remove-condition");
    if (removeConditionBtn) {
      removeConditionBtn.addEventListener("click", () => {
        container.removeChild(conditionDiv);
      });
    }
  }

  private render() {
    this.innerHTML = `
      <div class="spectrum spectrum-Typography">
        <h1 class="spectrum-Heading spectrum-Heading--sizeL">Ascending JSON Builder</h1>
        <p class="spectrum-Body spectrum-Body--sizeM">
          Use this form to create a valid GeneralAscending JSON object. Fill in the fields and click "Generate JSON" to validate and create the JSON.
        </p>

        <form id="ascending-form" class="spectrum-Form">
          <div class="spectrum-Form-item">
            <label for="id" class="spectrum-FieldLabel">ID</label>
            <input type="text" id="id" class="spectrum-Textfield" required>
          </div>

          <div class="spectrum-Form-item">
            <label for="general" class="spectrum-FieldLabel">General Name</label>
            <input type="text" id="general" class="spectrum-Textfield" required>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Ascending Levels</h3>
          <div id="ascending-levels-container" class="spectrum-Form-item">
            <button type="button" id="add-level" class="spectrum-Button spectrum-Button--primary">Add Ascending Level</button>
          </div>

          <div class="spectrum-Form-item">
            <button type="submit" class="spectrum-Button spectrum-Button--cta">Generate JSON</button>
          </div>
        </form>

        <div id="output-container" class="output-section">
          <!-- JSON output or validation errors will be displayed here -->
        </div>
      </div>

      <style>
        .output-section {
          margin-top: 30px;
          padding: 20px;
          background-color: #f5f5f5;
          border-radius: 4px;
        }

        .json-output {
          background-color: #f0f0f0;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
          white-space: pre-wrap;
        }

        .error-output {
          background-color: #fff0f0;
          color: #d32f2f;
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
          white-space: pre-wrap;
        }

        .ascending-level-container {
          border: 1px solid #ccc;
          padding: 15px;
          margin-bottom: 20px;
          border-radius: 4px;
        }

        .level-header {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
          align-items: center;
        }

        .buff-container {
          border: 1px solid #eee;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 4px;
        }

        .buff-header {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .buff-value {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .buff-class-container {
          margin-bottom: 10px;
        }

        .condition-container {
          display: flex;
          gap: 10px;
          margin-top: 5px;
          align-items: center;
        }

        .conditions-container {
          margin-top: 10px;
          padding-left: 20px;
        }
      </style>
    `;
  }
}
