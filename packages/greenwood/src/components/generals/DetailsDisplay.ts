import {
  Generals,
  type Ascending,
  type Buff as BuffImport,
  type SkillBooks,
} from "@evonytkrtips/schemas";
type GeneralAscending = Ascending.GeneralAscending;
type Buff = BuffImport.Buff;
const General = Generals.General;
type General = Generals.General;
type SkillBook = SkillBooks.SkillBook;

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

const printAscendingRows = (acendingDetails: GeneralAscending, index = 0) => {
  let recursionRequired = false;
  const template: string =
    `
    <tr>
      ${acendingDetails.ascending
        .map((al) => {
          if (al.buff.length > index) {
            if (al.buff.length > index + 1) {
              recursionRequired = true;
            }
            return `
            <td>
              <ul>
                <li>
                  <span class="spectrum-Heading spectrum-Heading--sizeXS">Attribute: </span>
                  <span class="spectrum-Body spectrum-Body--sizeXS">${al.buff[index].attribute}</span>
                </li>
                <li>
                  <span class="spectrum-Heading spectrum-Heading--sizeXS">Value: </span>
                  <span class="spectrum-Body spectrum-Body--sizeXS">${al.buff[index].value.number}${al.buff[index].value.unit.localeCompare("percentage") ? "%" : ""}</span>
                </li>
                ${
                  al.buff[index].class
                    ? `
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Affected Troops: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS">${al.buff[index].class}</span>
                  </li>
                `
                    : ""
                }
                ${
                  Array.isArray(al.buff[index].condition)
                    ? `
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS">${al.buff[index].condition.map((c) => c).join(", ")}</span>
                  </li>
                `
                    : ""
                }
              </ul>

            </td>
          `;
          } else {
            return "<td></td>";
          }
        })
        .join("\n")}
    </tr>
  ` +
    /*eslint-disable @typescript-eslint/no-unnecessary-condition */
    (recursionRequired ? printAscendingRows(acendingDetails, index + 1) : "");
  return template;
};

const getAscendingDetails = (general: General) => {
  const ascendingDetails: GeneralAscending | undefined = undefined;
  if (ascendingDetails) {
    return `
      <div class="AscendingDetails">
        <table>
           <thead>
          ${ascendingDetails.ascending
            .map((al, index) => {
              return `
              <th>
                <span class="spectrum-Heading spectrum-Heading--sizeS">
                  ${al.level.slice(-1)} ${al.level.slice(0, 1).toUpperCase()}${al.level.slice(1, -1)} Star${index > 0 ? "s" : ""}:
                </span>
              </th>
              `;
            })
            .join("\n")}
          </thead>
          <tbody>
            ${printAscendingRows(ascendingDetails)}
          </tbody>
        </table>
      </div>
    `;
  } else {
    return `
      <span class="spectrum-Body spectrum-Body--sizeS">Ascending Details for ${general.name} are not available.</span>
    `;
  }
};

const getSpecialSkill = async (general: General, depth: number) => {
  const skillbook: SkillBook | undefined = undefined;
  if (skillbook) {
    const buffs = new Array<Buff>();
    if (Array.isArray(skillbook.buff)) {
      skillbook.buff.map((buff) => buffs.push(buff));
    } else {
      buffs.push(skillbook.buff);
    }
    const bookbuffTemplate = buffs
      .map((buff: Buff) => {
        return `
          <li>
            <ul class="buffDisplay">
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeXS">Attribute: </span>
                <span class="spectrum-Body spectrum-Body--sizeXS">${buff.attribute}</span>
              </li>
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeXS">Value: </span>
                <span class="spectrum-Body spectrum-Body--sizeXS">${buff.value.number}${buff.value.unit.localeCompare("percentage") ? "%" : ""}</span>
              </li>
              ${
                buff.class &&
                `
                <li>
                  <span class="spectrum-Heading spectrum-Heading--sizeXS">Affected Troops: </span>
                  <span class="spectrum-Body spectrum-Body--sizeXS">${buff.class}</span>
                </li>
              `
              }
              ${
                Array.isArray(buff.condition)
                  ? `<li>
                      <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
                      ${buff.condition
                        .map((condition) => {
                          return `
                          <span class="spectrum-Body spectrum-Body--sizeXS">${condition}</span>
                        `;
                        })
                        .join("\n")}
                    </li>`
                  : `<li>
                      <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
                      <span class="spectrum-Body spectrum-Body--sizeXS">${buff.condition}</span>
                    </li>`
              }
            </ul>
          </li>
        `;
      })
      .join("\n");
    let ascendingTemplate = "";
    if (general.ascending) {
      ascendingTemplate = `
        <div class="ascendingAttributes">
          <h4 class="spectrum-Heading spectrum-Heading--sizeM">
            ${skillbook.name} - Ascended:
          </h4>
          ${await getAscendingDetails(general, depth)}
        </div>
      `;
    }
    return `
      <div class="specialSkill">
        <h3 class="spectrum-Heading spectrum-Heading--sizeL">
          Special Skill
        <h3>
        <span class="spectrum-Body spectrum-Body--sizeL">${general.name}'s special skill is ${skillbook.name}.</span>
        <h4 class="spectrum-Heading spectrum-Heading--sizeM">
          Buffs Provided:
        </h4>
        <div class="BookBuffs">
          <ul class="buffList">
            ${bookbuffTemplate}
          </ul>
        </div>
        ${ascendingTemplate}
      </div>
    `;
  } else {
    return `
    <div class="specialSkill">
      <h3 class="spectrum-Heading spectrum-Heading--sizeL">
        Special Skill
      <h3>
      <span class="spectrum-Body spectrum-Body--sizeM">${general.name}'s special skill, ${general.book}, is unknown.</span>
    </div>
    `;
  }
};

export default class GeneralDetailsPage extends HTMLElement {
  private general: General | null;
  private static templateElement: HTMLTemplateElement;

  static {
    // Create a template element once for the class
    this.templateElement = document.createElement("template");
    this.templateElement.innerHTML = `
      <div class="general">
        <h2 class="spectrum-Heading spectrum-Heading--sizeXL"></h2>
        <div class="basicInfo">
          <div class="baseStats">
            <h3 class="spectrum-Heading spectrum-Heading--sizeL">
              Base Stats
            </h3>
            <ul class="baseStats">
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeS">Leadership:</span>
                <ul>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS leadership-base"></span>
                  </li>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS leadership-increment"></span>
                  </li>
                </ul>
              </li>
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeS">Attack:</span>
                <ul>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS attack-base"></span>
                  </li>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS attack-increment"></span>
                  </li>
                </ul>
              </li>
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeS">Defense:</span>
                <ul>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS defense-base"></span>
                  </li>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS defense-increment"></span>
                  </li>
                </ul>
              </li>
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeS">Politics:</span>
                <ul>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS politics-base"></span>
                  </li>
                  <li>
                    <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
                    <span class="spectrum-Body spectrum-Body--sizeXS politics-increment"></span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <div class="ExtraBaseInfo">
            <h3 class="spectrum-Heading spectrum-Heading--sizeL">
              Basic Information
            </h3>
            <ul class="baseInfo">
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeM">Type: </span>
                <span class="spectrum-Body spectrum-Body--sizeM type-value"></span>
              </li>
              <li>
                <span class="spectrum-Heading spectrum-Heading--sizeM">Ascendable: </span>
                <span class="spectrum-Body spectrum-Body--sizeM ascending-value"></span>
              </li>
            </ul>
          </div>
        </div>
        <div class="specialSkill"></div>
        <div class="specialities"></div>
      </div>
    `;
  }

  constructor() {
    super();
    this.general = null;
  }

  static get observedAttributes() {
    return ["general"];
  }

  public attributeChangedCallback(
    name: string,
    oldValue: string,
    newValue: string
  ) {
    if (DEBUG) {
      console.log(
        `Attribute ${name} has changed from ${oldValue} to ${newValue}.`
      );
    }
    if (!name.localeCompare("general")) {
      try {
        const valid = General.safeParse(
          JSON.parse(decodeURIComponent(newValue))
        );
        if (valid.success) {
          this.general = valid.data;
          // Update the DOM when the general changes
          this.render();
        }
      } catch (e) {
        console.error("Error parsing general data:", e);
      }
    }
  }

  private populateSpecialSkill(container: Element) {
    if (!this.general) return;

    const specialSkillContainer = container.querySelector(".specialSkill");
    if (!specialSkillContainer) return;

    // Use your existing getSpecialSkill function
    specialSkillContainer.innerHTML = ``;
  }

  private populateSpecialities(container: Element) {
    if (!this.general) return;

    const specialitiesContainer = container.querySelector(".specialities");
    if (!specialitiesContainer) return;

    // Use your existing getSpecialities function
    specialitiesContainer.innerHTML = "";
  }

  private render() {
    this.innerHTML = "<!--GeneralDetailsPage-->";

    if (!this.general) {
      return;
    }

    // Clone the template
    const content = GeneralDetailsPage.templateElement.content.cloneNode(
      true
    ) as DocumentFragment;

    // Get the main container
    const container = content.querySelector(".general");
    if (!container) return;

    // Update general name
    const nameElement = container.querySelector("h2");
    if (nameElement) nameElement.textContent = this.general.name;

    // Update type and ascending
    const typeElement = container.querySelector(".type-value");
    if (typeElement)
      typeElement.textContent = this.general.type
        .map((t) => t.replaceAll("_", " "))
        .join(", ");

    const ascendingElement = container.querySelector(".ascending-value");
    if (ascendingElement)
      ascendingElement.textContent = this.general.ascending ? "Yes" : "No";

    // Update base stats
    const leadership = {
      base: container.querySelector(".leadership-base"),
      increment: container.querySelector(".leadership-increment"),
    };
    if (leadership.base)
      leadership.base.textContent = String(
        this.general.basic_attributes.leadership.base
      );
    if (leadership.increment)
      leadership.increment.textContent = String(
        this.general.basic_attributes.leadership.increment
      );

    const attack = {
      base: container.querySelector(".attack-base"),
      increment: container.querySelector(".attack-increment"),
    };
    if (attack.base)
      attack.base.textContent = String(
        this.general.basic_attributes.attack.base
      );
    if (attack.increment)
      attack.increment.textContent = String(
        this.general.basic_attributes.attack.increment
      );

    const defense = {
      base: container.querySelector(".defense-base"),
      increment: container.querySelector(".defense-increment"),
    };
    if (defense.base)
      defense.base.textContent = String(
        this.general.basic_attributes.defense.base
      );
    if (defense.increment)
      defense.increment.textContent = String(
        this.general.basic_attributes.defense.increment
      );

    const politics = {
      base: container.querySelector(".politics-base"),
      increment: container.querySelector(".politics-increment"),
    };
    if (politics.base)
      politics.base.textContent = String(
        this.general.basic_attributes.politics.base
      );
    if (politics.increment)
      politics.increment.textContent = String(
        this.general.basic_attributes.politics.increment
      );

    // Clear and append the basic structure
    this.innerHTML = "";
    this.appendChild(content);

    // Now populate the more complex sections that require async operations
    // We do this after appending to the DOM to show the basic info immediately
    this.populateSpecialSkill(this);
    this.populateSpecialities(this);
  }

  public async connectedCallback() {
    /*start work around for GetFrontmatter requiring async */
    await new Promise((resolve) => setTimeout(resolve, 1));
    /* end workaround */

    // Render the component
    await this.render();
  }
}
customElements.define("details-display", GeneralDetailsPage);
