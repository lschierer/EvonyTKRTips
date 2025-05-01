export const prerender = false;

import type { GetFrontmatter } from "@greenwood/cli";
import type { SafeParseSuccess, SafeParseError } from "zod";

import { Constants, SkillBooks } from "@evonytkrtips/schemas";

const getFrontmatter: GetFrontmatter = async () => {
  return Promise.resolve({
    title: "Skill Book JSON Builder",
    layout: "standard",
  });
};

export { getFrontmatter };

export default class SkillBookBuilderPage extends HTMLElement {
  private formData = {
    name: "",
    level: 1,
    buff: {} as unknown,
  };

  private validationResult:
    | SafeParseSuccess<SkillBooks.SkillBook>
    | SafeParseError<SkillBooks.SkillBook>
    | undefined = undefined;
  private jsonOutput = "";
  private useMultipleBuffs = false;

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    setTimeout(() => {
      // Form submission
      const form = this.querySelector("#skillbook-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.validateAndGenerateJSON();
        });
      }

      // Toggle between single and multiple buffs
      const toggleBuffsBtn = this.querySelector("#toggle-buffs");
      if (toggleBuffsBtn) {
        toggleBuffsBtn.addEventListener("click", () => {
          this.useMultipleBuffs = !this.useMultipleBuffs;
          this.updateBuffsContainer();
        });
      }

      // Add buff button (for multiple buffs)
      const addBuffBtn = this.querySelector("#add-buff");
      if (addBuffBtn) {
        addBuffBtn.addEventListener("click", () => {
          this.addBuffField();
        });
      }

      // Initialize the buffs container
      this.updateBuffsContainer();
    }, 0);
  }

  private updateBuffsContainer() {
    const singleBuffContainer = this.querySelector("#single-buff-container");
    const multipleBuffsContainer = this.querySelector(
      "#multiple-buffs-container"
    );
    const toggleBtn: HTMLButtonElement | null =
      this.querySelector("#toggle-buffs");

    if (singleBuffContainer && multipleBuffsContainer && toggleBtn) {
      if (this.useMultipleBuffs) {
        singleBuffContainer.classList.add("hidden");
        multipleBuffsContainer.classList.remove("hidden");
        toggleBtn.textContent = "Switch to Single Buff";

        // Make sure we have at least one buff field
        if (
          multipleBuffsContainer.querySelectorAll(".buff-container").length ===
          0
        ) {
          this.addBuffField();
        }
      } else {
        singleBuffContainer.classList.remove("hidden");
        multipleBuffsContainer.classList.add("hidden");
        toggleBtn.textContent = "Switch to Multiple Buffs";
      }
    }
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = SkillBooks.SkillBook.safeParse(this.formData);
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
    this.formData.name = this.querySelector("#name")
      ? (this.querySelector("#name") as HTMLInputElement).value
      : "";
    this.formData.level = this.querySelector("#level")
      ? parseInt((this.querySelector("#level") as HTMLInputElement).value)
      : 1;

    if (this.useMultipleBuffs) {
      // Collect multiple buffs
      const buffs: unknown[] = [];
      const buffContainers = this.querySelectorAll(
        "#multiple-buffs-container .buff-container"
      );

      buffContainers.forEach((container) => {
        const attribute = container.querySelector(".buff-attribute")
          ? (container.querySelector(".buff-attribute") as HTMLSelectElement)
              .value
          : undefined;
        const valueNumber = container.querySelector(".buff-value-number")
          ? parseFloat(
              (
                container.querySelector(
                  ".buff-value-number"
                ) as HTMLInputElement
              ).value
            )
          : 0;
        const valueUnit = container.querySelector(".buff-value-unit")
          ? ((container.querySelector(".buff-value-unit") as HTMLSelectElement)
              .value as Constants.Unit)
          : "percentage";
        const troopClass = container.querySelector(".buff-class")
          ? (container.querySelector(".buff-class") as HTMLSelectElement).value
          : undefined;

        // Collect conditions
        const conditionSelects: NodeListOf<HTMLInputElement> =
          container.querySelectorAll(".buff-condition");
        const conditions: string[] = [];

        conditionSelects.forEach((select) => {
          if (select.value) {
            conditions.push(select.value);
          }
        });

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

      this.formData.buff = buffs;
    } else {
      // Collect single buff
      const container = this.querySelector("#single-buff-container");
      if (container) {
        const attribute = container.querySelector(".buff-attribute")
          ? (container.querySelector(".buff-attribute") as HTMLSelectElement)
              .value
          : undefined;
        const valueNumber = container.querySelector(".buff-value-number")
          ? parseFloat(
              (
                container.querySelector(
                  ".buff-value-number"
                ) as HTMLInputElement
              ).value
            )
          : 0;
        const valueUnit = container.querySelector(".buff-value-unit")
          ? ((container.querySelector(".buff-value-unit") as HTMLSelectElement)
              .value as Constants.Unit)
          : "percentage";
        const troopClass = container.querySelector(".buff-class")
          ? (container.querySelector(".buff-class") as HTMLSelectElement).value
          : undefined;

        // Collect conditions
        const conditionSelects: NodeListOf<HTMLInputElement> =
          container.querySelectorAll(".buff-condition");
        const conditions: string[] = [];

        conditionSelects.forEach((select) => {
          if (select.value) {
            conditions.push(select.value);
          }
        });

        if (attribute) {
          this.formData.buff = {
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
        }
      }
    }
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

  private addBuffField() {
    const container = this.querySelector("#multiple-buffs-container");
    if (!container) return;

    const buffDiv = document.createElement("div");
    buffDiv.className = "buff-container";
    buffDiv.innerHTML = this.getBuffFieldsHTML();

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

  private getBuffFieldsHTML() {
    return `
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
  }

  private render() {
    this.innerHTML = `
      <div class="spectrum spectrum-Typography">
        <h1 class="spectrum-Heading spectrum-Heading--sizeL">Skill Book JSON Builder</h1>
        <p class="spectrum-Body spectrum-Body--sizeM">
          Use this form to create a valid SkillBook JSON object. Fill in the fields and click "Generate JSON" to validate and create the JSON.
        </p>

        <form id="skillbook-form" class="spectrum-Form">
          <div class="spectrum-Form-item">
            <label for="name" class="spectrum-FieldLabel">Book Name</label>
            <input type="text" id="name" class="spectrum-Textfield" required>
          </div>

          <div class="spectrum-Form-item">
            <label for="level" class="spectrum-FieldLabel">Level</label>
            <input type="number" id="level" class="spectrum-Textfield" min="1" value="1">
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Buff</h3>
          <div class="spectrum-Form-item">
            <button type="button" id="toggle-buffs" class="spectrum-Button spectrum-Button--secondary">Switch to Multiple Buffs</button>
          </div>

          <div id="single-buff-container" class="buff-container">
            ${this.getBuffFieldsHTML()}
          </div>

          <div id="multiple-buffs-container" class="hidden">
            <button type="button" id="add-buff" class="spectrum-Button spectrum-Button--primary">Add Buff</button>
            <!-- Buff fields will be added here -->
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
        .hidden {
          display: none;
        }

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
