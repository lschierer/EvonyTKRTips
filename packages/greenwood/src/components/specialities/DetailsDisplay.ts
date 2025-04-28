import type { CustomElement } from "typed-custom-elements";

import { Specialities, Constants } from "@evonytkrtips/schemas";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG is ${DEBUG} for ${new URL(import.meta.url).pathname}`);

export default class SpecialityDetailsPage
  extends HTMLElement
  implements CustomElement
{
  private speciality: Specialities.Speciality | null;
  private static templateElement: HTMLTemplateElement;
  private static levelTemplate: HTMLTemplateElement;
  private static buffTemplate: HTMLTemplateElement;
  private static classTemplate: HTMLTemplateElement;
  private static conditiontemplate: HTMLTemplateElement;

  static {
    this.templateElement = document.createElement("template");
    this.templateElement.innerHTML = `
      <div class="speciality">
        <h2 class="spectrum-Heading spectrum-Heading--sizeXL"></h2>
        <div class="levels">
        </div>
      </div>
    `;
    this.levelTemplate = document.createElement("template");
    this.levelTemplate.innerHTML = `
      <div class="specialityLevel">
        <ul class="levelDetails">


        </ul>
      </div>
    `;
    this.buffTemplate = document.createElement("template");
    this.buffTemplate.innerHTML = `
      <li class="buffDetails">
        <ul>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Attribute: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS specialityAttribute"></span>
          </li>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Value: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS specialityValue"></span>
          </li>
        </ul>
      </li>
    `;
    this.classTemplate = document.createElement("template");
    this.classTemplate.innerHTML = `
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeXS">Affected Troops: </span>
        <span class="spectrum-Body spectrum-Body--sizeXS specialityClass"></span>
      </li>
    `;

    this.conditiontemplate = document.createElement("template");
    this.classTemplate.innerHTML = `
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
        <span class="spectrum-Body spectrum-Body--sizeXS specialityCondition"></span>
      </li>
    `;
  }

  constructor() {
    super();
    this.speciality = null;
  }

  static get observedAttributes() {
    return ["speciality"];
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
    if (!name.localeCompare("speciality") && newValue) {
      const valid = Specialities.Speciality.safeParse(
        JSON.parse(decodeURIComponent(newValue))
      );
      if (valid.success) {
        if (DEBUG) {
          console.log(`successful parse of changed attribute`);
        }
        this.speciality = valid.data;
        // Update the DOM when the general changes
        //this.render();
      } else if (DEBUG) {
        console.error(valid.error.message);
      }
    }
  }
  private render() {
    this.innerHTML = `<!-- SpecialityDetailsPage -->`;

    if (!this.speciality) {
      console.warn(`no Speciality present`);
      return;
    } else if (DEBUG) {
      console.log(`rendering ${JSON.stringify(this.speciality)}`);
    }

    const content = SpecialityDetailsPage.templateElement.content.cloneNode(
      true
    ) as DocumentFragment;
    const container = content.querySelector(".speciality");
    if (!container) return;

    const nameElement = container.querySelector("h2");
    if (nameElement) {
      nameElement.textContent = this.speciality.name;
    }

    const levelContainer = container.querySelector(".levels");
    if (levelContainer) {
      for (const level of this.speciality.levels) {
        if (DEBUG) {
          console.log(`processing ${level.level}`);
        }
        const levelContent =
          SpecialityDetailsPage.levelTemplate.content.cloneNode(
            true
          ) as DocumentFragment;
        const container2 = levelContent.querySelector(".specialityLevel");
        if (container2) {
          if (Constants.SpecialityLevelName.options.includes(level.level)) {
            if (DEBUG) {
              console.log(`adding ${level.level}`);
            }
            container2.classList.add(level.level);
          } else if (DEBUG) {
            console.log(`invalid level: ${level.level}`);
          }
          const buffList = container2.querySelector(".levelDetails");
          if (buffList) {
            const ba = level.buff;

            for (const buff of ba) {
              const buffContent =
                SpecialityDetailsPage.buffTemplate.content.cloneNode(
                  true
                ) as DocumentFragment;
              const container3 = buffContent.querySelector(".buffDetails > ul");
              if (container3) {
                const attribute = container3.querySelector(
                  ".specialityAttribute"
                );
                if (attribute) {
                  attribute.textContent = buff.attribute;
                }
                const value = container3.querySelector(".specialityValue");
                if (value) {
                  value.textContent = `${buff.value.number} ${!buff.value.unit.localeCompare(Constants.Unit.Enum.flat) ? "" : "%"}`;
                }
                if (buff.class) {
                  container3.appendChild(
                    SpecialityDetailsPage.classTemplate.content.cloneNode(true)
                  );
                  const classContainer =
                    container3.querySelector(".specialityClass");
                  if (classContainer) {
                    classContainer.textContent = buff.class;
                  }
                }
                if (buff.condition) {
                  container3.appendChild(
                    SpecialityDetailsPage.conditiontemplate.content.cloneNode(
                      true
                    )
                  );
                  const condition = container3.querySelector(
                    ".specialityCondition"
                  );
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
customElements.define("speciality-details", SpecialityDetailsPage);
