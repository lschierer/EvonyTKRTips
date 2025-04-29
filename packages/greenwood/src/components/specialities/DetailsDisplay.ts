import type { CustomElement } from "typed-custom-elements";
import { Specialities, Constants } from "@evonytkrtips/schemas";
import BaseDetailsDisplay from "../common/BaseDetailsDisplay.ts";

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);
console.log(`DEBUG is ${DEBUG} for ${new URL(import.meta.url).pathname}`);

/**
 * Component for displaying Speciality details
 */
export default class SpecialityDetailsDisplay
  extends BaseDetailsDisplay<Specialities.Speciality>
  implements CustomElement
{
  constructor() {
    super({
      elementName: "Speciality",
      attributeName: "speciality",
      cssPrefix: "speciality",
      titleField: "name",
      levelField: "levels",
      buffField: "buff",
      levelValidator: Constants.SpecialityLevelName,
      parser: Specialities.Speciality,
    });
  }

  static override get observedAttributes() {
    return ["speciality"];
  }

  protected renderLevels(levelContainer: Element): void {
    const levels = this.data?.levels || [];

    for (const level of levels) {
      if (DEBUG) {
        console.log(`Processing ${level.level}`);
      }

      const levelContent = BaseDetailsDisplay.levelTemplate.content.cloneNode(
        true
      ) as DocumentFragment;
      const container = levelContent.querySelector(".level-container");

      if (container) {
        // Add the level as a class
        if (Constants.SpecialityLevelName.options.includes(level.level)) {
          container.classList.add(level.level);
        } else if (DEBUG) {
          console.log(`Invalid level: ${level.level}`);
        }

        // Render buffs
        const buffList = container.querySelector(".level-details");
        if (buffList) {
          this.renderBuffs(buffList, level.buff);
        }
      } else if (DEBUG) {
        console.log(`Container for ${level.level} not found`);
      }

      levelContainer.appendChild(levelContent);
    }
  }
}

customElements.define("speciality-details", SpecialityDetailsDisplay);
