export const prerender = false;

import type { GetFrontmatter } from "@greenwood/cli";
import type { SafeParseSuccess, SafeParseError } from "zod";

import { Constants, GeneralConflictGroups } from "@evonytkrtips/schemas";

const getFrontmatter: GetFrontmatter = async () => {
  return Promise.resolve({
    title: "Conflict Group JSON Builder",
    layout: "standard",
  });
};

export { getFrontmatter };

export default class ConflictGroupBuilderPage extends HTMLElement {
  private formData = {
    name: "",
    members: [] as string[],
    others: [] as string[],
    books: [] as unknown[],
  };

  private validationResult:
    | SafeParseSuccess<GeneralConflictGroups.ConflictGroup>
    | SafeParseError<GeneralConflictGroups.ConflictGroup>
    | undefined = undefined;
  private jsonOutput = "";

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    setTimeout(() => {
      // Form submission
      const form = this.querySelector("#conflict-group-form");
      if (form) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          this.validateAndGenerateJSON();
        });
      }

      // Add member button
      const addMemberBtn = this.querySelector("#add-member");
      if (addMemberBtn) {
        addMemberBtn.addEventListener("click", () => {
          this.addMemberField();
        });
      }

      // Add other group button
      const addOtherBtn = this.querySelector("#add-other");
      if (addOtherBtn) {
        addOtherBtn.addEventListener("click", () => {
          this.addOtherField();
        });
      }

      // Add book conflict button
      const addBookBtn = this.querySelector("#add-book");
      if (addBookBtn) {
        addBookBtn.addEventListener("click", () => {
          this.addBookField();
        });
      }

      // Generate UUID button
      const generateUuidBtn = this.querySelector("#generate-uuid");
      if (generateUuidBtn) {
        generateUuidBtn.addEventListener("click", () => {
          const nameInput: HTMLInputElement | null =
            this.querySelector("#name");
          if (nameInput) {
            nameInput.value = this.generateUUID();
          }
        });
      }
    }, 0);
  }

  private generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = GeneralConflictGroups.ConflictGroup.safeParse(this.formData);
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

    // Members
    this.formData.members = [];
    const memberInputs: NodeListOf<HTMLInputElement> =
      this.querySelectorAll(".member-input");
    memberInputs.forEach((input) => {
      if (input.value.trim()) {
        this.formData.members.push(input.value.trim());
      }
    });

    // Others (other conflict groups)
    this.formData.others = [];
    const otherInputs: NodeListOf<HTMLInputElement> =
      this.querySelectorAll(".other-input");
    otherInputs.forEach((input) => {
      if (input.value.trim()) {
        this.formData.others.push(input.value.trim());
      }
    });

    // Book conflicts
    this.formData.books = [];
    const bookContainers = this.querySelectorAll(".book-container");

    bookContainers.forEach((container) => {
      const bookName = (
        container.querySelector(".book-name") as HTMLInputElement
      ).value;
      const bookLevel = parseInt(
        (container.querySelector(".book-level") as HTMLInputElement).value ||
          "0"
      );
      const condition = (
        container.querySelector(".book-condition") as HTMLSelectElement
      ).value as Constants.Condition | null;

      if (bookName && condition) {
        this.formData.books.push({
          book: {
            name: bookName,
            level: bookLevel,
          },
          condition,
        });
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

  private addMemberField() {
    const container = this.querySelector("#members-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "member-field-container";
    div.innerHTML = `
      <input type="text" class="member-input spectrum-Textfield" placeholder="Member name">
      <button type="button" class="remove-member spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-member");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private addOtherField() {
    const container = this.querySelector("#others-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "other-field-container";
    div.innerHTML = `
      <input type="text" class="other-input spectrum-Textfield" placeholder="Other conflict group UUID">
      <button type="button" class="remove-other spectrum-Button spectrum-Button--negative">Remove</button>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-other");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private addBookField() {
    const container = this.querySelector("#books-container");
    if (!container) return;

    const div = document.createElement("div");
    div.className = "book-container";
    div.innerHTML = `
      <div class="book-header">
        <input type="text" class="book-name spectrum-Textfield" placeholder="Book name">
        <input type="number" class="book-level spectrum-Textfield" placeholder="Level" min="1">
        <button type="button" class="remove-book spectrum-Button spectrum-Button--negative">Remove</button>
      </div>
      <div class="book-condition-container">
        <select class="book-condition spectrum-Dropdown">
          <option value="">Select Condition</option>
          <optgroup label="Book Conditions">
            ${Object.values(Constants.BookCondition.Enum)
              .map((cond) => `<option value="${cond}">${cond}</option>`)
              .join("")}
          </optgroup>
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
        </select>
      </div>
    `;

    container.appendChild(div);

    // Add remove button functionality
    const removeBtn = div.querySelector(".remove-book");
    if (removeBtn) {
      removeBtn.addEventListener("click", () => {
        container.removeChild(div);
      });
    }
  }

  private render() {
    this.innerHTML = `
      <div class="spectrum spectrum-Typography">
        <h1 class="spectrum-Heading spectrum-Heading--sizeL">Conflict Group JSON Builder</h1>
        <p class="spectrum-Body spectrum-Body--sizeM">
          Use this form to create a valid ConflictGroup JSON object. Fill in the fields and click "Generate JSON" to validate and create the JSON.
        </p>

        <form id="conflict-group-form" class="spectrum-Form">
          <div class="spectrum-Form-item">
            <label for="name" class="spectrum-FieldLabel">Group UUID</label>
            <div class="uuid-container">
              <input type="text" id="name" class="spectrum-Textfield" required>
              <button type="button" id="generate-uuid" class="spectrum-Button spectrum-Button--primary">Generate UUID</button>
            </div>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Members</h3>
          <div id="members-container" class="spectrum-Form-item">
            <button type="button" id="add-member" class="spectrum-Button spectrum-Button--primary">Add Member</button>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Other Conflict Groups (Optional)</h3>
          <div id="others-container" class="spectrum-Form-item">
            <button type="button" id="add-other" class="spectrum-Button spectrum-Button--primary">Add Other Group</button>
          </div>

          <h3 class="spectrum-Heading spectrum-Heading--sizeM">Book Conflicts (Optional)</h3>
          <div id="books-container" class="spectrum-Form-item">
            <button type="button" id="add-book" class="spectrum-Button spectrum-Button--primary">Add Book Conflict</button>
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

        .uuid-container {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .member-field-container, .other-field-container {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .book-container {
          border: 1px solid #eee;
          padding: 10px;
          margin-bottom: 10px;
          border-radius: 4px;
        }

        .book-header {
          display: flex;
          gap: 10px;
          margin-bottom: 10px;
          align-items: center;
        }

        .book-condition-container {
          margin-bottom: 10px;
        }
      </style>
    `;
  }
}
