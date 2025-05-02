import { SkillBooks } from "@evonytkrtips/schemas";
import type { SafeParseSuccess, SafeParseError } from "zod";

export default class SkillBookBuilderForm extends HTMLElement {
  private formData: SkillBooks.SkillBook = {
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
    
    // Use requestAnimationFrame to ensure DOM is ready
    window.requestAnimationFrame(() => {
      this.setupEventListeners();
    });
  }

  private setupEventListeners() {
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
  }

  private updateBuffsContainer() {
    try {
      const singleBuffContainer = this.querySelector("#single-buff-container");
      const multipleBuffsContainer = this.querySelector("#multiple-buffs-container");
      const toggleBtn = this.querySelector("#toggle-buffs") as HTMLButtonElement;

      if (singleBuffContainer && multipleBuffsContainer && toggleBtn) {
        if (this.useMultipleBuffs) {
          singleBuffContainer.classList.add("d-none");
          multipleBuffsContainer.classList.remove("d-none");
          toggleBtn.textContent = "Switch to Single Buff";
        } else {
          singleBuffContainer.classList.remove("d-none");
          multipleBuffsContainer.classList.add("d-none");
          toggleBtn.textContent = "Switch to Multiple Buffs";
        }
      }
    } catch (error) {
      console.debug('Error updating buffs container:', error);
    }
  }

  private validateAndGenerateJSON() {
    // Collect form data
    this.collectFormData();

    // Validate with schema
    const result = SkillBooks.SkillBook.safeParse(this.formData);
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

    const levelInput: HTMLInputElement | null = this.querySelector("#level");
    if (levelInput) this.formData.level = parseInt(levelInput.value) || 1;

    // Collect buff data
    if (this.useMultipleBuffs) {
      this.collectMultipleBuffs();
    } else {
      this.collectSingleBuff();
    }
  }

  private collectSingleBuff() {
    const typeSelect: HTMLSelectElement | null = this.querySelector("#buff-type");
    const targetSelect: HTMLSelectElement | null = this.querySelector("#buff-target");
    const valueInput: HTMLInputElement | null = this.querySelector("#buff-value");
    
    if (typeSelect && targetSelect && valueInput) {
      const type = typeSelect.value;
      const target = targetSelect.value;
      const value = parseFloat(valueInput.value) || 0;
      
      this.formData.buff = {
        type,
        target,
        value
      };
    }
  }

  private collectMultipleBuffs() {
    const buffFields = this.querySelectorAll(".buff-field");
    const buffs: any[] = [];
    
    buffFields.forEach((field) => {
      const typeSelect = field.querySelector(".buff-type") as HTMLSelectElement;
      const targetSelect = field.querySelector(".buff-target") as HTMLSelectElement;
      const valueInput = field.querySelector(".buff-value") as HTMLInputElement;
      
      if (typeSelect && targetSelect && valueInput) {
        const type = typeSelect.value;
        const target = targetSelect.value;
        const value = parseFloat(valueInput.value) || 0;
        
        buffs.push({
          type,
          target,
          value
        });
      }
    });
    
    if (buffs.length > 0) {
      this.formData.buff = buffs;
    }
  }

  private addBuffField() {
    const container = this.querySelector("#buffs-container");
    if (container) {
      const fieldId = `buff-${Date.now()}`;
      const fieldHtml = `
        <div class="buff-field card mb-3">
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="form-group">
                  <label for="${fieldId}-type">Buff Type</label>
                  <select id="${fieldId}-type" class="form-control buff-type">
                    <option value="attack">Attack</option>
                    <option value="defense">Defense</option>
                    <option value="health">Health</option>
                    <option value="march_size">March Size</option>
                    <option value="march_speed">March Speed</option>
                    <option value="construction_speed">Construction Speed</option>
                    <option value="research_speed">Research Speed</option>
                    <option value="training_speed">Training Speed</option>
                    <option value="gathering_speed">Gathering Speed</option>
                    <option value="load">Load</option>
                    <option value="pvp_attack">PVP Attack</option>
                    <option value="pvp_defense">PVP Defense</option>
                    <option value="monster_attack">Monster Attack</option>
                    <option value="monster_defense">Monster Defense</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="${fieldId}-target">Target</label>
                  <select id="${fieldId}-target" class="form-control buff-target">
                    <option value="ground">Ground</option>
                    <option value="mounted">Mounted</option>
                    <option value="archer">Archer</option>
                    <option value="siege">Siege</option>
                    <option value="all">All</option>
                  </select>
                </div>
              </div>
              <div class="col-md-4">
                <div class="form-group">
                  <label for="${fieldId}-value">Value (%)</label>
                  <input type="number" id="${fieldId}-value" class="form-control buff-value" value="0" step="0.1">
                </div>
              </div>
            </div>
            <button type="button" class="btn btn-danger btn-sm remove-field mt-2">Remove Buff</button>
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
        const field = target.closest(".buff-field");
        if (field) {
          field.remove();
        }
      });
    });
  }

  private render() {
    this.innerHTML = `
      <div class="container">
        <p>Use this form to create a skill book JSON object for the Evony TKR Tips database.</p>
        
        <form id="skillbook-form" class="mt-4">
          <div class="card mb-4">
            <div class="card-header">Basic Information</div>
            <div class="card-body">
              <div class="form-group">
                <label for="name">Skill Book Name</label>
                <input type="text" id="name" class="form-control" required>
              </div>
              
              <div class="form-group">
                <label for="level">Level</label>
                <input type="number" id="level" class="form-control" min="1" value="1">
              </div>
            </div>
          </div>
          
          <div class="card mb-4">
            <div class="card-header">
              Buff Information
              <button type="button" id="toggle-buffs" class="btn btn-secondary btn-sm float-right">
                Switch to Multiple Buffs
              </button>
            </div>
            <div class="card-body">
              <!-- Single Buff Container -->
              <div id="single-buff-container">
                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="buff-type">Buff Type</label>
                      <select id="buff-type" class="form-control">
                        <option value="attack">Attack</option>
                        <option value="defense">Defense</option>
                        <option value="health">Health</option>
                        <option value="march_size">March Size</option>
                        <option value="march_speed">March Speed</option>
                        <option value="construction_speed">Construction Speed</option>
                        <option value="research_speed">Research Speed</option>
                        <option value="training_speed">Training Speed</option>
                        <option value="gathering_speed">Gathering Speed</option>
                        <option value="load">Load</option>
                        <option value="pvp_attack">PVP Attack</option>
                        <option value="pvp_defense">PVP Defense</option>
                        <option value="monster_attack">Monster Attack</option>
                        <option value="monster_defense">Monster Defense</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="buff-target">Target</label>
                      <select id="buff-target" class="form-control">
                        <option value="ground">Ground</option>
                        <option value="mounted">Mounted</option>
                        <option value="archer">Archer</option>
                        <option value="siege">Siege</option>
                        <option value="all">All</option>
                      </select>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label for="buff-value">Value (%)</label>
                      <input type="number" id="buff-value" class="form-control" value="0" step="0.1">
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Multiple Buffs Container -->
              <div id="multiple-buffs-container" class="d-none">
                <div id="buffs-container"></div>
                <button type="button" id="add-buff" class="btn btn-primary">Add Buff</button>
              </div>
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

customElements.define('skillbook-builder-form', SkillBookBuilderForm);
