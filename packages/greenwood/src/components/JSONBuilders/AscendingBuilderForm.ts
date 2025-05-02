import { Ascending } from "@evonytkrtips/schemas";
import type { SafeParseSuccess, SafeParseError } from "zod";

export default class AscendingBuilderForm extends HTMLElement {
  private formData: Ascending.GeneralAscending = {
    name: "",
    ascending: [] as unknown[],
  };

  private validationResult:
    | SafeParseSuccess<Ascending.GeneralAscending>
    | SafeParseError<Ascending.GeneralAscending>
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
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = Ascending.GeneralAscending.safeParse(this.formData);
    this.validationResult = result;

    // Display result
    const outputContainer = this.querySelector("#output-container");
    const validationContainer = this.querySelector("#validation-container");
    if (outputContainer && validationContainer) {
      if (result.success) {
        // Format the JSON with 2 spaces indentation
        this.jsonOutput = JSON.stringify(result.data, null, 2);
        outputContainer.innerHTML = `<pre>${this.jsonOutput}</pre>`;
        validationContainer.innerHTML = '<p class="success">✅ Validation successful!</p>';
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

    // Ascending levels
    this.collectAscendingLevels();
  }

  private collectAscendingLevels() {
    const levelFields = this.querySelectorAll(".ascending-level-field");
    this.formData.ascending = [];
    
    levelFields.forEach((field) => {
      const levelInput = field.querySelector(".level") as HTMLInputElement;
      const attackInput = field.querySelector(".attack") as HTMLInputElement;
      const defenseInput = field.querySelector(".defense") as HTMLInputElement;
      const healthInput = field.querySelector(".health") as HTMLInputElement;
      const politicsInput = field.querySelector(".politics") as HTMLInputElement;
      const leadershipInput = field.querySelector(".leadership") as HTMLInputElement;
      
      if (levelInput && attackInput && defenseInput && healthInput && politicsInput && leadershipInput) {
        const level = parseInt(levelInput.value) || 0;
        const attack = parseInt(attackInput.value) || 0;
        const defense = parseInt(defenseInput.value) || 0;
        const health = parseInt(healthInput.value) || 0;
        const politics = parseInt(politicsInput.value) || 0;
        const leadership = parseInt(leadershipInput.value) || 0;
        
        this.formData.ascending.push({
          level,
          attack,
          defense,
          health,
          politics,
          leadership
        });
      }
    });
  }

  private addAscendingLevelField() {
    const container = this.querySelector("#ascending-levels-container");
    if (container) {
      const fieldId = `level-${Date.now()}`;
      const fieldHtml = `
        <div class="ascending-level-field card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-2">
                <div class="form-group">
                  <label for="${fieldId}-level">Level</label>
                  <input type="number" id="${fieldId}-level" class="form-control level" value="1" min="1">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="${fieldId}-attack">Attack</label>
                  <input type="number" id="${fieldId}-attack" class="form-control attack" value="0">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="${fieldId}-defense">Defense</label>
                  <input type="number" id="${fieldId}-defense" class="form-control defense" value="0">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="${fieldId}-health">Health</label>
                  <input type="number" id="${fieldId}-health" class="form-control health" value="0">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="${fieldId}-politics">Politics</label>
                  <input type="number" id="${fieldId}-politics" class="form-control politics" value="0">
                </div>
              </div>
              <div class="col-md-2">
                <div class="form-group">
                  <label for="${fieldId}-leadership">Leadership</label>
                  <input type="number" id="${fieldId}-leadership" class="form-control leadership" value="0">
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-field mt-2">Remove Level</button>
          </div>
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
        const field = target.closest(".ascending-level-field");
        if (field) {
          field.remove();
        }
      });
    });
  }

  private render() {
    this.innerHTML = `
      <div class="container">
        <p>Use this form to create an ascending JSON object for the Evony TKR Tips database.</p>
        
        <form id="ascending-form" class="mt-4">
          <div class="card mb-4">
            <div class="card-header">Basic Information</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">General Name</label>
                <input type="text" id="name" class="form-control" required>
              </div>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-header">Ascending Levels</div>
            <div class="card-body">
              <div id="ascending-levels-container"></div>
              <button type="button" id="add-level" class="btn btn-primary">Add Ascending Level</button>
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

customElements.define('ascending-builder-form', AscendingBuilderForm);
