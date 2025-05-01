export const prerender = false;

import type { GetFrontmatter } from "@greenwood/cli";
import type { SafeParseSuccess, SafeParseError } from "zod";

import { Constants, Generals } from "@evonytkrtips/schemas";

const getFrontmatter: GetFrontmatter = async () => {
  return Promise.resolve({
    title: "General JSON Builder",
    layout: "standard",
  });
};

export { getFrontmatter };

export default class GeneralBuilderPage extends HTMLElement {
  private formData: Generals.General = {
    name: "",
    ascending: false,
    basic_attributes: {
      attack: { base: 0, increment: 0 },
      defense: { base: 0, increment: 0 },
      leadership: { base: 0, increment: 0 },
      politics: { base: 0, increment: 0 },
    },
    book: "",
    specialities: ["", "", "", ""],
    stars: Constants.AscendingLevel.Enum.None,
    type: [],
    level: 1,
    note: [],
    specialityLevels: [],
    extra: [],
    warnings: [],
  };

  private validationResult:
    | SafeParseSuccess<Generals.General>
    | SafeParseError<Generals.General>
    | undefined = undefined;
  private jsonOutput = "";

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    setTimeout(() => {
      // Form submission
      const form = this.querySelector("#general-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.validateAndGenerateJSON();
        });
      }

      // Add note button
      const addNoteBtn = this.querySelector("#add-note");
      if (addNoteBtn) {
        addNoteBtn.addEventListener("click", () => {
          this.addNoteField();
        });
      }

      // Add speciality level button
      const addSpecialityLevelBtn = this.querySelector("#add-speciality-level");
      if (addSpecialityLevelBtn) {
        addSpecialityLevelBtn.addEventListener("click", () => {
          this.addSpecialityLevelField();
        });
      }

      // Add extra button
      const addExtraBtn = this.querySelector("#add-extra");
      if (addExtraBtn) {
        addExtraBtn.addEventListener("click", () => {
          this.addExtraField();
        });
      }

      // Add warning button
      const addWarningBtn = this.querySelector("#add-warning");
      if (addWarningBtn) {
        addWarningBtn.addEventListener("click", () => {
          this.addWarningField();
        });
      }

      // Add general type button
      const addTypeBtn = this.querySelector("#add-type");
      if (addTypeBtn) {
        addTypeBtn.addEventListener("click", () => {
          this.addTypeField();
        });
      }
    }, 0);
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = Generals.General.safeParse(this.formData);
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
    this.formData.name =
      (this.querySelector("#name") as HTMLInputElement).value || "";
    this.formData.ascending =
      (this.querySelector("#ascending") as HTMLInputElement).checked || false;
    this.formData.book =
      (this.querySelector("#book") as HTMLInputElement).value || "";
    this.formData.stars = this.querySelector("#stars")
      ? ((this.querySelector("#stars") as HTMLSelectElement)
          .value as Constants.AscendingLevel)
      : Constants.AscendingLevel.Enum.None;
    this.formData.level = parseInt(
      (this.querySelector("#level") as HTMLInputElement).value || "1"
    );

    // Basic attributes
    this.formData.basic_attributes = {
      attack: {
        base: parseInt(
          (this.querySelector("#attack-base") as HTMLInputElement).value || "0"
        ),
        increment: parseInt(
          (this.querySelector("#attack-increment") as HTMLInputElement).value ||
            "0"
        ),
      },
      defense: {
        base: parseInt(
          (this.querySelector("#defense-base") as HTMLInputElement).value || "0"
        ),
        increment: parseInt(
          (this.querySelector("#defense-increment") as HTMLInputElement)
            .value || "0"
        ),
      },
      leadership: {
        base: parseInt(
          (this.querySelector("#leadership-base") as HTMLInputElement).value ||
            "0"
        ),
        increment: parseInt(
          (this.querySelector("#leadership-increment") as HTMLInputElement)
            .value || "0"
        ),
      },
      politics: {
        base: parseInt(
          (this.querySelector("#politics-base") as HTMLInputElement).value ||
            "0"
        ),
        increment: parseInt(
          (this.querySelector("#politics-increment") as HTMLInputElement)
            .value || "0"
        ),
      },
    };

    // Specialities
    this.formData.specialities = [];
    const specialityInputs: NodeListOf<HTMLInputElement> =
      this.querySelectorAll(".speciality-input");
    specialityInputs.forEach((input) => {
      if (input.value.trim()) {
        this.formData.specialities.push(input.value.trim());
      }
    });

    // General types
    this.formData.type = [];
    const typeInputs: NodeListOf<HTMLSelectElement> =
      this.querySelectorAll(".type-select");
    typeInputs.forEach((select) => {
      if (select.value) {
        this.formData.type.push(select.value as Constants.GeneralType);
      }
    });

    // Notes
    this.formData.note = [];
    const noteContainers = this.querySelectorAll(".note-container");
    noteContainers.forEach((container) => {
      const severity = (
        container.querySelector(".note-severity") as HTMLInputElement
      ).value;
      const text = (container.querySelector(".note-text") as HTMLInputElement)
        .value;
      if (severity && text && this.formData.note) {
        this.formData.note.push({ severity, text });
      }
    });

    // Speciality levels
    this.formData.specialityLevels = [];
    const specialityLevelSelects: NodeListOf<HTMLSelectElement> =
      this.querySelectorAll(".speciality-level-select");
    specialityLevelSelects.forEach((select) => {
      if (select.value && this.formData.specialityLevels) {
        this.formData.specialityLevels.push(
          select.value as Constants.SpecialityLevelName
        );
      }
    });

    // Extra
    this.formData.extra = [];
    const extraInputs: NodeListOf<HTMLInputElement> =
      this.querySelectorAll(".extra-input");
    extraInputs.forEach((input) => {
      if (input.value.trim() && this.formData.extra) {
        this.formData.extra.push(input.value.trim());
      }
    });

    // Warnings
    this.formData.warnings = [];
    const warningInputs: NodeListOf<HTMLInputElement> =
      this.querySelectorAll(".warning-input");
    warningInputs.forEach((input) => {
      if (input.value.trim() && this.formData.warnings) {
        this.formData.warnings.push(input.value.trim());
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

  private addNoteField() {
    const notesContainer = this.querySelector("#notes-container");
    if (!notesContainer) return;

    const noteDiv = document.createElement("div");
    noteDiv.className = "note-container";
    noteDiv.innerHTML = `
      <input type="text" class="note-severity spectrum-Textfield" placeholder="Severity">
      <input type="text" class="note-text spectrum-Textfield" placeholder="Note text">
      <button type="button" class="remove-note spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    notesContainer.appendChild(noteDiv);

    // Add remove button functionality
    const removeBtn = noteDiv.querySelector(".remove-note");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        notesContainer.removeChild(noteDiv);
      });
    }
  }

  private addSpecialityLevelField() {
    const container = this.querySelector("#speciality-levels-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "speciality-level-container";
    div.innerHTML = `
      <select class="speciality-level-select spectrum-Dropdown">
        <option value="">Select Level</option>
        ${Object.values(Constants.SpecialityLevelName.Enum)
          .map((level) => `<option value="${level}">${level}</option>`)
          .join("")}
      </select>
      <button type="button" class="remove-speciality-level spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-speciality-level");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private addExtraField() {
    const container = this.querySelector("#extra-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "extra-field-container";
    div.innerHTML = `
      <input type="text" class="extra-input spectrum-Textfield" placeholder="Extra information">
      <button type="button" class="remove-extra spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-extra");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private addWarningField() {
    const container = this.querySelector("#warnings-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "warning-field-container";
    div.innerHTML = `
      <input type="text" class="warning-input spectrum-Textfield" placeholder="Warning message">
      <button type="button" class="remove-warning spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-warning");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private addTypeField() {
    const container = this.querySelector("#types-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "type-field-container";
    div.innerHTML = `
      <select class="type-select spectrum-Dropdown">
        <option value="">Select Type</option>
        ${Object.values(Constants.GeneralType.Enum)
          .map((type) => `<option value="${type}">${type}</option>`)
          .join("")}
      </select>
      <button type="button" class="remove-type spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-type");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private render() {
    this.innerHTML = `
      <div class="spectrum spectrum-Typography">
        <h1 class="spectrum-Heading spectrum-Heading--sizeL">General JSON Builder</h1>
        <p class="spectrum-Body spectrum-Body--sizeM">
          Use this form to create a valid General JSON object. Fill in the fields and click "Generate JSON" to validate and create the JSON.
        </p>

        <form id="general-form" class="spectrum-Form">
          <div class="spectrum-Form-item">
            <label for="name" class="spectrum-FieldLabel">Name</label>
            <input type="text" id="name" class="spectrum-Textfield" required>
          </div>

          <div class="spectrum-Form-item">
            <label for="ascending" class="spectrum-FieldLabel">Ascending</label>
            <input type="checkbox" id="ascending" class="spectrum-Checkbox">
          </div>

          <div class="spectrum-Form-item">
            <label for="book" class="spectrum-FieldLabel">Book</label>
            <input type="text" id="book" class="spectrum-Textfield" required>
          </div>

          <div class="spectrum-Form-item">
            <label for="stars" class="spectrum-FieldLabel">Stars</label>
            <select id="stars" class="spectrum-Dropdown" required>
              ${Object.values(Constants.AscendingLevel.Enum)
                .map((level) => `<option value="${level}">${level}</option>`)
                .join("")}
            </select>
          </div>

          <div class="spectrum-Form-item">
            <label for="level" class="spectrum-FieldLabel">Level (1-45)</label>
            <input type="number" id="level" class="spectrum-Textfield" min="1" max="45" value="1">
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Basic Attributes</h3>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Attack</label>
            <div class="attribute-inputs">
              <input type="number" id="attack-base" class="spectrum-Textfield" placeholder="Base" required>
              <input type="number" id="attack-increment" class="spectrum-Textfield" placeholder="Increment" required>
            </div>
          </div>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Defense</label>
            <div class="attribute-inputs">
              <input type="number" id="defense-base" class="spectrum-Textfield" placeholder="Base" required>
              <input type="number" id="defense-increment" class="spectrum-Textfield" placeholder="Increment" required>
            </div>
          </div>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Leadership</label>
            <div class="attribute-inputs">
              <input type="number" id="leadership-base" class="spectrum-Textfield" placeholder="Base" required>
              <input type="number" id="leadership-increment" class="spectrum-Textfield" placeholder="Increment" required>
            </div>
          </div>

          <div class="spectrum-Form-item">
            <label class="spectrum-FieldLabel">Politics</label>
            <div class="attribute-inputs">
              <input type="number" id="politics-base" class="spectrum-Textfield" placeholder="Base" required>
              <input type="number" id="politics-increment" class="spectrum-Textfield" placeholder="Increment" required>
            </div>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Specialities</h3>
          <div id="specialities-container" class="spectrum-Form-item">
            <div class="speciality-field-container">
              <input type="text" class="speciality-input spectrum-Textfield" placeholder="Speciality name">
            </div>
            <div class="speciality-field-container">
              <input type="text" class="speciality-input spectrum-Textfield" placeholder="Speciality name">
            </div>
            <div class="speciality-field-container">
              <input type="text" class="speciality-input spectrum-Textfield" placeholder="Speciality name">
            </div>
            <div class="speciality-field-container">
              <input type="text" class="speciality-input spectrum-Textfield" placeholder="Speciality name">
            </div>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">General Types</h3>
          <div id="types-container" class="spectrum-Form-item">
            <button type="button" id="add-type" class="spectrum-Button spectrum-Button--primary">Add Type</button>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Notes (Optional)</h3>
          <div id="notes-container" class="spectrum-Form-item">
            <button type="button" id="add-note" class="spectrum-Button spectrum-Button--primary">Add Note</button>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Speciality Levels (Optional)</h3>
          <div id="speciality-levels-container" class="spectrum-Form-item">
            <button type="button" id="add-speciality-level" class="spectrum-Button spectrum-Button--primary">Add Speciality Level</button>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Extra Information (Optional)</h3>
          <div id="extra-container" class="spectrum-Form-item">
            <button type="button" id="add-extra" class="spectrum-Button spectrum-Button--primary">Add Extra Info</button>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Warnings (Optional)</h3>
          <div id="warnings-container" class="spectrum-Form-item">
            <button type="button" id="add-warning" class="spectrum-Button spectrum-Button--primary">Add Warning</button>
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
        .attribute-inputs {
          display: flex;
          gap: 10px;
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

        .note-container, .speciality-level-container, .extra-field-container, .warning-field-container, .type-field-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .speciality-field-container {
          margin-bottom: 10px;
        }
      </style>
    `;
  }
}
