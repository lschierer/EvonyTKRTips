import type { CustomElement } from "typed-custom-elements";
import type { Buff } from "@evonytkrtips/schemas";
import type { ZodType } from "zod";
import { Constants } from "@evonytkrtips/schemas";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

// Define a generic type for the data
export type DisplayData = Record<string, unknown>;

// Define a type for the configuration options
export interface DisplayConfig<T extends DisplayData> {
  elementName: string;
  attributeName: string;
  cssPrefix: string;
  titleField: keyof T;
  levelField: keyof T;
  buffField: string;
  levelValidator: ZodType;
  parser: ZodType<T>;
}

/**
 * Abstract base class for displaying details of various game elements
 */
export default abstract class BaseDetailsDisplay<T extends DisplayData>
  extends HTMLElement
  implements CustomElement
{
  protected data: T | null = null;
  protected config: DisplayConfig<T>;

  // Shared templates
  protected static templateElement: HTMLTemplateElement;
  protected static levelTemplate: HTMLTemplateElement;
  protected static buffTemplate: HTMLTemplateElement;
  protected static classTemplate: HTMLTemplateElement;
  protected static conditionTemplate: HTMLTemplateElement;

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

  constructor(config: DisplayConfig<T>) {
    super();
    this.config = config;
  }

  static get observedAttributes(): string[] {
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
          this.render(); // Call render when data changes
        } else if (DEBUG) {
          console.error(`Parse error: ${valid.error.message}`);
        }
      } catch (error) {
        console.error(`Error parsing ${this.config.attributeName}:`, error);
      }
    }
  }

  protected render(): void {
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
      const titleField = this.config.titleField;
      const title = String(this.data[titleField] || "");
      nameElement.textContent = title;
    }

    // Render levels
    const levelContainer = content.querySelector(".levels");
    if (levelContainer) {
      this.renderLevels(levelContainer);
    } else if (DEBUG) {
      console.warn(`No level container found`);
    }

    this.innerHTML = "";
    this.appendChild(content);
  }

  protected abstract renderLevels(levelContainer: Element): void;

  /**
   * Renders an array of buffs into the provided element
   * @param buffList The element to render buffs into
   * @param buffs Array of Buff objects to render
   */
  protected renderBuffs(buffList: Element, buffs: Buff.Buff[]): void {
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
            condition.textContent = buff.condition.join(" ");
          }
        }

        buffList.appendChild(container);
      } else if (DEBUG) {
        console.warn(`Container for buff ${JSON.stringify(buff)} not found`);
      }
    }
  }

  public connectedCallback(): void {
    // Render the component when it's connected to the DOM
    this.render();
  }
}
