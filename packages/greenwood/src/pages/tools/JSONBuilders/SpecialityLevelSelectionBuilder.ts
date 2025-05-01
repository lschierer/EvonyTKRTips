export const prerender = false;

import type { GetFrontmatter } from "@greenwood/cli";
import type { SafeParseSuccess, SafeParseError } from "zod";

import { Constants, Specialities } from "@evonytkrtips/schemas";

const getFrontmatter: GetFrontmatter = async () => {
  return Promise.resolve({
    title: "Speciality Level Selection JSON Builder",
    layout: "standard",
  });
};

export { getFrontmatter };

export default class SpecialityLevelSelectionBuilderPage extends HTMLElement {
  private formData = ["None", "None", "None", "None"] as string[];

  private validationResult:
    | SafeParseSuccess<Specialities.SpecialityLevelSelection>
    | SafeParseError<Specialities.SpecialityLevelSelection>
    | undefined = undefined;
  private jsonOutput = "";

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    setTimeout(() => {
      // Form submission
      const form = this.querySelector("#speciality-level-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.validateAndGenerateJSON();
        });
      }
    }, 0);
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = Specialities.SpecialityLevelSelection.safeParse(
      this.formData
    );
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
    // Get values from all four selects
    const selects: NodeListOf<HTMLSelectElement> = this.querySelectorAll(
      ".speciality-level-select"
    );

    this.formData = Array.from(selects).map(
      (select) => select.value as Constants.SpecialityLevelName
    );
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
        <div class="error-explanation">
          <p><strong>Note:</strong> The SpecialityLevelSelection has specific validation rules:</p>
          <ul>
            <li>If the 4th speciality is not "None", then the first 3 specialities must all be "Gold"</li>
            <li>If all first 3 specialities are "Gold", then the 4th speciality cannot be "None"</li>
          </ul>
        </div>
      `;
    }
  }

  private render() {
    this.innerHTML = `
      <div class="spectrum spectrum-Typography">
        <h1 class="spectrum-Heading spectrum-Heading--sizeL">Speciality Level Selection JSON Builder</h1>
        <p class="spectrum-Body spectrum-Body--sizeM">
          Use this form to create a valid SpecialityLevelSelection JSON array. Select the speciality levels and click "Generate JSON" to validate and create the JSON.
        </p>

        <form id="speciality-level-form" class="spectrum-Form">
          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Speciality 1</label>
            <select class="speciality-level-select spectrum-Dropdown" required>
              ${Object.values(Constants.SpecialityLevelName.Enum)
                .map(
                  (level) =>
                    `<option value="${level}" ${level === "None" ? "selected" : ""}>${level}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Speciality 2</label>
            <select class="speciality-level-select spectrum-Dropdown" required>
              ${Object.values(Constants.SpecialityLevelName.Enum)
                .map(
                  (level) =>
                    `<option value="${level}" ${level === "None" ? "selected" : ""}>${level}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Speciality 3</label>
            <select class="speciality-level-select spectrum-Dropdown" required>
              ${Object.values(Constants.SpecialityLevelName.Enum)
                .map(
                  (level) =>
                    `<option value="${level}" ${level === "None" ? "selected" : ""}>${level}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Speciality 4</label>
            <select class="speciality-level-select spectrum-Dropdown" required>
              ${Object.values(Constants.SpecialityLevelName.Enum)
                .map(
                  (level) =>
                    `<option value="${level}" ${level === "None" ? "selected" : ""}>${level}</option>`
                )
                .join("")}
            </select>
          </div>

          <div class="spectrum-Form-item">
            <button type="submit" class="spectrum-Button spectrum-Button--cta">Generate JSON</button>
          </div>
        </form>

        <div class="validation-rules">
          <h3 class="spectrum-Heading spectrum-Heading--sizeS">Validation Rules</h3>
          <ul class="spectrum-Body spectrum-Body--sizeS">
            <li>If the 4th speciality is not "None", then the first 3 specialities must all be "Gold"</li>
            <li>If all first 3 specialities are "Gold", then the 4th speciality cannot be "None"</li>
          </ul>
        </div>

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

        .validation-rules {
          margin-top: 20px;
          padding: 15px;
          background-color: #f8f8f8;
          border-left: 4px solid #2196f3;
        }

        .error-explanation {
          margin-top: 15px;
          padding: 10px;
          background-color: #fff8e1;
          border-left: 4px solid #ffc107;
        }
      </style>
    `;
  }
}
