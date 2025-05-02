import { Constants, Generals } from "@evonytkrtips/schemas";
import type { SafeParseSuccess, SafeParseError } from "zod";

export default class GeneralBuilderForm extends HTMLElement {
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

    // Use requestAnimationFrame to ensure DOM is ready
    window.requestAnimationFrame(() => {
      this.setupEventListeners();
    });
  }

  private setupEventListeners() {
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
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = Generals.General.safeParse(this.formData);
    this.validationResult = result;

    // Display result
    const outputContainer = this.querySelector("#output-container");
    const validationContainer = this.querySelector("#validation-container");
    if (outputContainer && validationContainer) {
      if (result.success) {
        // Format the JSON with 2 spaces indentation
        this.jsonOutput = JSON.stringify(result.data, null, 2);
        outputContainer.innerHTML = `<pre>${this.jsonOutput}</pre>`;
        validationContainer.innerHTML =
          '<p class="success">✅ Validation successful!</p>';
      } else {
        outputContainer.innerHTML = "";
        validationContainer.innerHTML = `<p class="error">❌ Validation failed:</p><pre>${JSON.stringify(
          result.error.format(),
          null,
          2
        )}</pre>`;
      }
    }
  }

  private collectFormData() {
    // Basic info
    const nameInput: HTMLInputElement | null = this.querySelector("#name");
    if (nameInput) this.formData.name = nameInput.value;

    const levelInput: HTMLInputElement | null = this.querySelector("#level");
    if (levelInput) this.formData.level = parseInt(levelInput.value) || 1;

    const bookInput: HTMLInputElement | null = this.querySelector("#book");
    if (bookInput) this.formData.book = bookInput.value;

    const ascendingInput: HTMLInputElement | null =
      this.querySelector("#ascending");
    if (ascendingInput) this.formData.ascending = ascendingInput.checked;

    const starsSelect: HTMLSelectElement | null = this.querySelector("#stars");
    if (starsSelect) {
      this.formData.stars = starsSelect.value as Constants.AscendingLevel;
    }

    // Basic attributes
    const attackBaseInput: HTMLInputElement | null =
      this.querySelector("#attack-base");
    if (attackBaseInput)
      this.formData.basic_attributes.attack.base =
        parseInt(attackBaseInput.value) || 0;

    const attackIncrementInput: HTMLInputElement | null =
      this.querySelector("#attack-increment");
    if (attackIncrementInput)
      this.formData.basic_attributes.attack.increment =
        parseInt(attackIncrementInput.value) || 0;

    const defenseBaseInput: HTMLInputElement | null =
      this.querySelector("#defense-base");
    if (defenseBaseInput)
      this.formData.basic_attributes.defense.base =
        parseInt(defenseBaseInput.value) || 0;

    const defenseIncrementInput: HTMLInputElement | null =
      this.querySelector("#defense-increment");
    if (defenseIncrementInput)
      this.formData.basic_attributes.defense.increment =
        parseInt(defenseIncrementInput.value) || 0;

    const leadershipBaseInput: HTMLInputElement | null =
      this.querySelector("#leadership-base");
    if (leadershipBaseInput)
      this.formData.basic_attributes.leadership.base =
        parseInt(leadershipBaseInput.value) || 0;

    const leadershipIncrementInput: HTMLInputElement | null =
      this.querySelector("#leadership-increment");
    if (leadershipIncrementInput)
      this.formData.basic_attributes.leadership.increment =
        parseInt(leadershipIncrementInput.value) || 0;

    const politicsBaseInput: HTMLInputElement | null =
      this.querySelector("#politics-base");
    if (politicsBaseInput)
      this.formData.basic_attributes.politics.base =
        parseInt(politicsBaseInput.value) || 0;

    const politicsIncrementInput: HTMLInputElement | null = this.querySelector(
      "#politics-increment"
    );
    if (politicsIncrementInput)
      this.formData.basic_attributes.politics.increment =
        parseInt(politicsIncrementInput.value) || 0;

    // Specialities
    for (let i = 0; i < 4; i++) {
      const specialityInput: HTMLInputElement | null = this.querySelector(
        `#speciality-${i + 1}`
      );
      if (specialityInput)
        this.formData.specialities[i] = specialityInput.value;
    }

    // Dynamic fields
    this.collectDynamicFields();
  }

  private collectDynamicFields() {
    // Speciality levels
    const specialityLevelFields = this.querySelectorAll(
      ".speciality-level-field"
    );
    this.formData.specialityLevels = [];
    specialityLevelFields.forEach((field) => {
      const specialityInput: HTMLInputElement | null =
        field.querySelector(".speciality-name");
      const levelInput: HTMLInputElement | null =
        field.querySelector(".speciality-level");
      if (
        specialityInput &&
        levelInput &&
        specialityInput.value &&
        this.formData.specialityLevels
      ) {
        const i = (Constants.SpecialityLevelName.options as string[]).indexOf(
          levelInput.value
        );

        this.formData.specialityLevels.push(
          Constants.SpecialityLevelName.options[i] ||
            Constants.SpecialityLevelName.Enum.None
        );
      }
    });

    // Type fields
    const typeFields = this.querySelectorAll(".type-field");
    this.formData.type = [];
    typeFields.forEach((field) => {
      const input = field.querySelector("input");
      if (input) {
        const i = (Constants.GeneralType.options as string[]).indexOf(
          input.value
        );
        this.formData.type.push(Constants.GeneralType.options[i]);
      }
    });
  }

  private addNoteField() {
    const container = this.querySelector("#notes-container");
    if (container) {
      const fieldId = `note-${Date.now()}`;
      const fieldHtml = `
        <div class="note-field form-group">
          <input type="text" id="${fieldId}" class="form-control" placeholder="Note">
          <button type="button" class="btn btn-danger btn-sm remove-field">Remove</button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", fieldHtml);
      this.setupRemoveButtons();
    }
  }

  private addSpecialityLevelField() {
    const container = this.querySelector("#speciality-levels-container");
    if (container) {
      const fieldId = `speciality-level-${Date.now()}`;
      const fieldHtml = `
        <div class="speciality-level-field form-group">
          <input type="text" id="${fieldId}-name" class="form-control speciality-name" placeholder="Speciality Name">
          <input type="number" id="${fieldId}-level" class="form-control speciality-level" placeholder="Level" min="1" max="5" value="1">
          <button type="button" class="btn btn-danger btn-sm remove-field">Remove</button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", fieldHtml);
      this.setupRemoveButtons();
    }
  }

  private addExtraField() {
    const container = this.querySelector("#extra-container");
    if (container) {
      const fieldId = `extra-${Date.now()}`;
      const fieldHtml = `
        <div class="extra-field form-group">
          <input type="text" id="${fieldId}" class="form-control" placeholder="Extra Information">
          <button type="button" class="btn btn-danger btn-sm remove-field">Remove</button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", fieldHtml);
      this.setupRemoveButtons();
    }
  }

  private addWarningField() {
    const container = this.querySelector("#warnings-container");
    if (container) {
      const fieldId = `warning-${Date.now()}`;
      const fieldHtml = `
        <div class="warning-field form-group">
          <input type="text" id="${fieldId}" class="form-control" placeholder="Warning">
          <button type="button" class="btn btn-danger btn-sm remove-field">Remove</button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", fieldHtml);
      this.setupRemoveButtons();
    }
  }

  private addTypeField() {
    const container = this.querySelector("#types-container");
    if (container) {
      const fieldId = `type-${Date.now()}`;
      const fieldHtml = `
        <div class="type-field form-group">
          <input type="text" id="${fieldId}" class="form-control" placeholder="General Type">
          <button type="button" class="btn btn-danger btn-sm remove-field">Remove</button>
        </div>
      `;
      container.insertAdjacentHTML("beforeend", fieldHtml);
      this.setupRemoveButtons();
    }
  }

  private setupRemoveButtons() {
    const removeButtons = this.querySelectorAll(".remove-field");
    removeButtons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const target = e.target as HTMLElement;
        const field = target.closest(".form-group");
        if (field) {
          field.remove();
        }
      });
    });
  }

  private render() {
    this.innerHTML = `
      <div class="container">
        <p>Use this form to create a general JSON object for the Evony TKR Tips database.</p>

        <form id="general-form" class="mt-4">
          <div class="card mb-4">
            <div class="card-header">Basic Information</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">General Name</label>
                <input type="text" id="name" class="form-control" required>
              </div>

              <div class="form-group">
                <label for="level">Level</label>
                <input type="number" id="level" class="form-control" min="1" value="1">
              </div>

              <div class="form-group">
                <label for="book">Skill Book</label>
                <input type="text" id="book" class="form-control">
              </div>

              <div class="form-check">
                <input type="checkbox" id="ascending" class="form-check-input">
                <label for="ascending" class="form-check-label">Ascending</label>
              </div>

              <div class="form-group">
                <label for="stars">Stars</label>
                <select id="stars" class="form-control">
                  ${Constants.AscendingLevel.options
                    .map((level) => {
                      return `
                      <option value="${level}" >
                        ${
                          level === Constants.AscendingLevel.Enum.None
                            ? level
                            : `${level[level.length - 1]} ${level.charAt(0).toUpperCase()}${level.slice(1, -1)} Stars`
                        }
                      </option>
                    `;
                    })
                    .join("\n")}

                </select>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">Basic Attributes</div>
            <div class="card-body">
              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="attack-base">Attack Base</label>
                    <input type="number" step="0.01" id="attack-base" class="form-control" value="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="attack-increment">Attack Increment</label>
                    <input type="number" step="0.01" id="attack-increment" class="form-control" value="0">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="defense-base">Defense Base</label>
                    <input type="number" step="0.01" id="defense-base" class="form-control" value="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="defense-increment">Defense Increment</label>
                    <input type="number" step="0.01" id="defense-increment" class="form-control" value="0">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="leadership-base">Leadership Base</label>
                    <input type="number" step="0.01" id="leadership-base" class="form-control" value="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="leadership-increment">Leadership Increment</label>
                    <input type="number" step="0.01" id="leadership-increment" class="form-control" value="0">
                  </div>
                </div>
              </div>

              <div class="row">
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="politics-base">Politics Base</label>
                    <input type="number" step="0.01" id="politics-base" class="form-control" value="0">
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="form-group">
                    <label for="politics-increment">Politics Increment</label>
                    <input type="number" step="0.01" id="politics-increment" class="form-control" value="0">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">Specialities</div>
            <div class="card-body">
              <div class="form-group">
                <label for="speciality-1">Speciality 1</label>
                <input type="text" id="speciality-1" class="form-control">
              </div>

              <div class="form-group">
                <label for="speciality-2">Speciality 2</label>
                <input type="text" id="speciality-2" class="form-control">
              </div>

              <div class="form-group">
                <label for="speciality-3">Speciality 3</label>
                <input type="text" id="speciality-3" class="form-control">
              </div>

              <div class="form-group">
                <label for="speciality-4">Speciality 4</label>
                <input type="text" id="speciality-4" class="form-control">
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">Notes</div>
            <div class="card-body">
              <div id="notes-container"></div>
              <button type="button" id="add-note" class="btn btn-primary">Add Note</button>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">Speciality Levels</div>
            <div class="card-body">
              <div id="speciality-levels-container"></div>
              <button type="button" id="add-speciality-level" class="btn btn-primary">Add Speciality Level</button>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">Extra Information</div>
            <div class="card-body">
              <div id="extra-container"></div>
              <button type="button" id="add-extra" class="btn btn-primary">Add Extra Info</button>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">Warnings</div>
            <div class="card-body">
              <div id="warnings-container"></div>
              <button type="button" id="add-warning" class="btn btn-primary">Add Warning</button>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">General Types</div>
            <div class="card-body">
              <div id="types-container"></div>
              <button type="button" id="add-type" class="btn btn-primary">Add Type</button>
            </div>
          </div>

          <button type="submit" class="btn btn-success btn-lg">Generate JSON</button>
        </form>

        <div class="mt-4">
          <div id="validation-container"></div>
          <div id="output-container" class="mt-3"></div>
        </div>
      </div>
    `;
  }
}

customElements.define("general-builder-form", GeneralBuilderForm);
