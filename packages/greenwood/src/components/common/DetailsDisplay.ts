import type { CustomElement } from "typed-custom-elements";

/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import {
  Ascending,
  Specialities,
  Covenants,
  SkillBooks,
  Constants,
  type Buff,
} from "@evonytkrtips/schemas";
/* eslint-disable-next-line @typescript-eslint/consistent-type-imports */
import { z } from "zod";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

// Define a type for the supported data types
type SupportedDataType =
  | Ascending.GeneralAscending
  | Specialities.Speciality
  | Covenants.Covenant
  | SkillBooks.SkillBook;

// Define a type for the configuration options
interface DisplayConfig {
  elementName: string;
  attributeName: string;
  cssPrefix: string;
  titleField: string;
  levelField: string;
  buffField: string;
  levelValidator: z.ZodType;
  parser: z.ZodType<SupportedDataType>;
}

/**
 * Abstract base class for displaying details of various game elements
 */
export abstract class BaseDetailsDisplay
  extends HTMLElement
  implements CustomElement
{
  protected data: SupportedDataType | null = null;
  protected config: DisplayConfig;

  // Shared templates
  protected static templateElement: HTMLTemplateElement;
  protected static levelTemplate: HTMLTemplateElement;
  private static buffTemplate: HTMLTemplateElement;
  private static classTemplate: HTMLTemplateElement;
  private static conditionTemplate: HTMLTemplateElement;

  static {
    // Main template
    this.templateElement = document.createElement("template");
    this.templateElement.innerHTML = `
      <div class="details-container">
        <h2 class="spectrum-Heading spectrum-Heading--sizeXL title"></h2>
        <div class="levels">
        </div>
      </div>
    `;

    // Level template
    this.levelTemplate = document.createElement("template");
    this.levelTemplate.innerHTML = `
      <div class="level-container">
        <ul class="level-details">
        </ul>
      </div>
    `;

    // Buff template
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

    // Class template
    this.classTemplate = document.createElement("template");
    this.classTemplate.innerHTML = `
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeXS">Affected Troops: </span>
        <span class="spectrum-Body spectrum-Body--sizeXS buff-class"></span>
      </li>
    `;

    // Condition template
    this.conditionTemplate = document.createElement("template");
    this.conditionTemplate.innerHTML = `
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
        <span class="spectrum-Body spectrum-Body--sizeXS buff-condition"></span>
      </li>
    `;
  }

  constructor(config: DisplayConfig) {
    super();
    this.config = config;
  }

  static get observedAttributes() {
    return ["data-attribute"];
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

    // Check if this is our data attribute
    if (name === this.config.attributeName && newValue) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(newValue)) as object;
        const valid = this.config.parser.safeParse(parsedData);

        if (valid.success) {
          if (DEBUG) {
            console.log(
              `Successfully parsed ${this.config.attributeName} data`
            );
          }
          this.data = valid.data;
        } else if (DEBUG) {
          console.error(`Parse error: ${valid.error.message}`);
        }
      } catch (error) {
        console.error(`Error parsing ${this.config.attributeName}:`, error);
      }
    }
  }

  protected render() {
    this.innerHTML = `<!-- ${this.config.elementName} -->`;

    if (!this.data) {
      console.warn(`No ${this.config.elementName} data present`);
      return;
    } else if (DEBUG) {
      console.log(`Rendering ${JSON.stringify(this.data)}`);
    }

    const content = BaseDetailsDisplay.templateElement.content.cloneNode(
      true
    ) as DocumentFragment;
    const container = content.querySelector(".details-container");
    if (!container) return;

    // Add the CSS class based on the element type
    container.classList.add(this.config.cssPrefix);

    // Set the title
    const nameElement = container.querySelector(".title");
    if (nameElement) {
      nameElement.textContent =
        this.data[this.config.titleField as keyof typeof this.data];
    }

    // Render levels
    const levelContainer = container.querySelector(".levels");
    if (levelContainer) {
      this.renderLevels(levelContainer);
    } else if (DEBUG) {
      console.warn(`No level container found`);
    }

    this.innerHTML = "";
    this.appendChild(content);
  }

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  protected renderLevels(levelContainer: Element) {
    // This method will be implemented by subclasses
  }

  protected renderBuffs(buffList: Element, buffs: Buff.Buff[]) {
    for (const buff of buffs) {
      const buffContent = BaseDetailsDisplay.buffTemplate.content.cloneNode(
        true
      ) as DocumentFragment;
      const container = buffContent.querySelector(".buff-details > ul");

      if (container) {
        // Set attribute
        const attribute = container.querySelector(".buff-attribute");
        if (attribute) {
          attribute.textContent = buff.attribute;
        }

        // Set value
        const value = container.querySelector(".buff-value");
        if (value) {
          value.textContent = `${buff.value.number} ${buff.value.unit === Constants.Unit.Enum.flat ? "" : "%"}`;
        }

        // Add class if present
        if (buff.class) {
          container.appendChild(
            BaseDetailsDisplay.classTemplate.content.cloneNode(true)
          );
          const classContainer = container.querySelector(".buff-class");
          if (classContainer) {
            classContainer.textContent = buff.class;
          }
        }

        // Add conditions if present
        if (buff.condition) {
          container.appendChild(
            BaseDetailsDisplay.conditionTemplate.content.cloneNode(true)
          );
          const condition = container.querySelector(".buff-condition");
          if (condition) {
            condition.textContent = buff.condition
              .map((c: string) => c)
              .join(" ");
          }
        }

        buffList.appendChild(container);
      } else if (DEBUG) {
        console.warn(`Container for buff ${JSON.stringify(buff)} not found`);
      }
    }
  }

  public connectedCallback() {
    // Render the component when it's connected to the DOM
    this.render();
  }
}
