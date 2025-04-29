import type { CustomElement } from "typed-custom-elements";

import { Ascending, Constants } from "@evonytkrtips/schemas";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG is ${DEBUG} for ${new URL(import.meta.url).pathname}`);

export default class AscendingDetailsPage
  extends HTMLElement
  implements CustomElement
{
  private ascendingattribute: Ascending.GeneralAscending | null;
  private static templateElement: HTMLTemplateElement;
  private static levelTemplate: HTMLTemplateElement;
  private static buffTemplate: HTMLTemplateElement;
  private static classTemplate: HTMLTemplateElement;
  private static conditiontemplate: HTMLTemplateElement;

  static {
    this.templateElement = document.createElement("template");
    this.templateElement.innerHTML = `
      <div class="ascending-attribute">
        <h2 class="spectrum-Heading spectrum-Heading--sizeXL"></h2>
        <div class="levels">
        </div>
      </div>
    `;
    this.levelTemplate = document.createElement("template");
    this.levelTemplate.innerHTML = `
      <div class="ascending-level">
        <ul class="level-details">
        </ul>
      </div>
    `;
    this.buffTemplate = document.createElement("template");
    this.buffTemplate.innerHTML = `
      <li class="buff-details">
        <ul>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Attribute: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS buff-attribute"></span>
          </li>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Value: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS buff-value"></span>
          </li>
        </ul>
      </li>
    `;
    this.classTemplate = document.createElement("template");
    this.classTemplate.innerHTML = `
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeXS">Affected Troops: </span>
        <span class="spectrum-Body spectrum-Body--sizeXS buff-class"></span>
      </li>
    `;

    this.conditiontemplate = document.createElement("template");
    this.classTemplate.innerHTML = `
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
        <span class="spectrum-Body spectrum-Body--sizeXS buff-condition"></span>
      </li>
    `;
  }

  constructor() {
    super();
    this.ascendingattribute = null;
  }

  static get observedAttributes() {
    return ["ascendingattribute"];
  }

  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void {
    if (DEBUG) {
      console.log(
        `Attribute ${name} has changed from ${oldValue} to ${newValue}.`
      );
    }
    if (!name.localeCompare("ascendingattribute") && newValue) {
      const valid = Ascending.GeneralAscending.safeParse(
        JSON.parse(decodeURIComponent(newValue))
      );
      if (valid.success) {
        if (DEBUG) {
          console.log(`successful parse of changed attribute`);
        }
        this.ascendingattribute = valid.data;
        // Update the DOM when the general changes
        //this.render();
      } else if (DEBUG) {
        console.error(valid.error.message);
      }
    }
  }

  private render() {
    this.innerHTML = `<!-- AscendingAttributeDetailsPage -->`;

    if (!this.ascendingattribute) {
      console.warn(`no Speciality present`);
      return;
    } else if (DEBUG) {
      console.log(`rendering ${JSON.stringify(this.ascendingattribute)}`);
    }

    const content = AscendingDetailsPage.templateElement.content.cloneNode(
      true
    ) as DocumentFragment;
    const container = content.querySelector(".ascending-attribute");
    if (!container) return;

    const nameElement = container.querySelector("h2");
    if (nameElement) {
      nameElement.textContent = this.ascendingattribute.general;
    }

    const levelContainer = container.querySelector(".levels");
    if (levelContainer) {
      for (const level of this.ascendingattribute.ascending) {
        if (DEBUG) {
          console.log(`processing ${level.level}`);
        }

        const levelContent =
          AscendingDetailsPage.levelTemplate.content.cloneNode(
            true
          ) as DocumentFragment;

        const container2 = levelContent.querySelector(".ascending-level");
        if (container2) {
          if (Constants.AscendingLevel.options.includes(level.level)) {
            if (DEBUG) {
              console.log(`adding ${level.level}`);
            }

            container2.classList.add(level.level);
          } else if (DEBUG) {
            console.log(`invalid level: ${level.level}`);
          }

          const buffList = container2.querySelector(".level-details");
          if (buffList) {
            const ba = level.buff;

            for (const buff of ba) {
              const buffContent =
                AscendingDetailsPage.buffTemplate.content.cloneNode(
                  true
                ) as DocumentFragment;

              const container3 =
                buffContent.querySelector(".buff-details > ul");
              if (container3) {
                const attribute = container3.querySelector(".buff-attribute");
                if (attribute) {
                  attribute.textContent = buff.attribute;
                }
                const value = container3.querySelector(".buff-value");
                if (value) {
                  value.textContent = `${buff.value.number} ${!buff.value.unit.localeCompare(Constants.Unit.Enum.flat) ? "" : "%"}`;
                }
                if (buff.class) {
                  container3.appendChild(
                    AscendingDetailsPage.classTemplate.content.cloneNode(true)
                  );
                  const classContainer =
                    container3.querySelector(".buff-class");
                  if (classContainer) {
                    classContainer.textContent = buff.class;
                  }
                }
                if (buff.condition) {
                  container3.appendChild(
                    AscendingDetailsPage.conditiontemplate.content.cloneNode(
                      true
                    )
                  );
                  const condition = container3.querySelector(".buff-condition");
                  if (condition) {
                    condition.textContent = buff.condition
                      .map((c) => c)
                      .join(" ");
                  }
                }
                buffList.appendChild(container3);
              } else if (DEBUG) {
                console.warn(
                  `container3 for buff ${JSON.stringify(buff)} not found`
                );
              }
            }
          }
        } else if (DEBUG) {
          console.log(`container2 for ${level.level} not found`);
        }
        levelContainer.appendChild(levelContent);
      }
    } else if (DEBUG) {
      console.warn(`no levelContainer found`);
    }

    this.innerHTML = "";
    this.appendChild(content);
  }

  public connectedCallback() {
    // Render the component
    this.render();
  }
}
customElements.define("ascendingattribute-details", AscendingDetailsPage);
