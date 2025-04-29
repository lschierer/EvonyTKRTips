import type { CustomElement } from "typed-custom-elements";
import { Covenants, Constants } from "@evonytkrtips/schemas";
import BaseDetailsDisplay from "../common/BaseDetailsDisplay.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG is ${DEBUG} for ${new URL(import.meta.url).pathname}`);

/**
 * Component for displaying Covenant details
 */
export default class CovenantDetailsDisplay
  extends BaseDetailsDisplay<Covenants.Covenant>
  implements CustomElement
{
  constructor() {
    super({
      elementName: "Covenant",
      attributeName: "covenant",
      cssPrefix: "covenant",
      titleField: "name",
      levelField: "levels",
      buffField: "buff",
      levelValidator: Constants.CovenantCategory,
      parser: Covenants.Covenant,
    });
  }

  static override get observedAttributes() {
    return ["covenant"];
  }

  protected renderLevels(levelContainer: Element): void {
    const levels = this.data?.levels || [];

    for (const level of levels) {
      if (DEBUG) {
        console.log(`Processing ${level.category}`);
      }

      const levelContent = BaseDetailsDisplay.levelTemplate.content.cloneNode(
        true
      ) as DocumentFragment;
      const container = levelContent.querySelector(".level-container");

      if (container) {
        // Add the category and type as classes
        if (Constants.CovenantCategory.options.includes(level.category)) {
          container.classList.add(level.category);
          container.classList.add(level.type);
        } else if (DEBUG) {
          console.log(`Invalid category: ${level.category}`);
        }

        // Render buffs
        const buffList = container.querySelector(".level-details");
        if (buffList) {
          this.renderBuffs(buffList, level.buff);
        }
      } else if (DEBUG) {
        console.log(`Container for ${level.category} not found`);
      }

      levelContainer.appendChild(levelContent);
    }
  }
}

customElements.define("covenant-details", CovenantDetailsDisplay);
