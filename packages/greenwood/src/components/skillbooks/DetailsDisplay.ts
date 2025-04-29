import type { CustomElement } from "typed-custom-elements";
import { SkillBooks } from "@evonytkrtips/schemas";
import BaseDetailsDisplay from "../common/BaseDetailsDisplay.ts";
import { z } from "zod";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG is ${DEBUG} for ${new URL(import.meta.url).pathname}`);

/**
 * Component for displaying SkillBook details
 */
export default class SkillBookDetailsDisplay
  extends BaseDetailsDisplay<SkillBooks.SkillBook>
  implements CustomElement
{
  constructor() {
    super({
      elementName: "SkillBook",
      attributeName: "skillbook",
      cssPrefix: "skillbook",
      titleField: "name",
      levelField: "level",
      buffField: "buff",
      levelValidator: z.number(),
      parser: SkillBooks.SkillBook,
    });
  }

  static override get observedAttributes() {
    return ["skillbook"];
  }

  protected renderLevels(levelContainer: Element): void {
    const levelContent = BaseDetailsDisplay.levelTemplate.content.cloneNode(
      true
    ) as DocumentFragment;
    const container = levelContent.querySelector(".level-container");

    if (container && this.data) {
      // Add level as class if it exists
      const level = this.data.level;
      if (level !== undefined) {
        container.classList.add(`level-${level}`);
      }

      // Render buffs
      const buffList = container.querySelector(".level-details");
      if (buffList) {
        // Handle both single buff and array of buffs
        if (Array.isArray(this.data.buff)) {
          this.renderBuffs(buffList, this.data.buff);
        } else {
          this.renderBuffs(buffList, [this.data.buff]);
        }
      }
    }

    levelContainer.appendChild(levelContent);
  }
}

customElements.define("skillbook-details", SkillBookDetailsDisplay);
