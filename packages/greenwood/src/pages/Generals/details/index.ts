export const prerender = false;
export const isolation = true;

import { type General } from "../../../schemas/generals.ts";
import { type SkillBook } from "../../../schemas/skillBooks.ts";
import { type GeneralAscending } from "../../../schemas/ascending.ts";
import { type Speciality } from "../../../schemas/specialities.ts";
import { type Buff } from "../../../schemas/buff.ts";

import SkillBooksCollection from "../../../lib/collections/skillBooks.ts";
import SpecialitiesCollection from "../../../lib/collections/specialities.ts";
import AscendingAttributesCollection from "../../../lib/collections/ascendingAttributes.ts";

import * as constants from "../../../schemas/constants.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("pages/Generals/details/index.ts");

import GeneralsCollection from "../../../lib/collections/generals.ts";

export const getMainSection = async (general: General, depth: number = 1) => {
  return `
    <div class="general">
      <h2 class="spectrum-Heading spectrum-Heading--sizeXL">
       ${general.id}
      </h2>
      <div class="basicInfo">
        ${getBaseStats(general)}
        <div class="ExtraBaseInfo">
          <h3 class="spectrum-Heading spectrum-Heading--sizeL">
            Basic Information
          </h3>
          <ul class="baseInfo">
            <li>
              <span class="spectrum-Heading spectrum-Heading--sizeM">Type: </span>
              <span class="spectrum-Body spectrum-Body--sizeM">${general.type.map((t) => t.replaceAll("_", " ")).join(", ")}</span>
            </li>
            <li>
              <span class="spectrum-Heading spectrum-Heading--sizeM">Ascendable: </span>
              <span class="spectrum-Body spectrum-Body--sizeM">${
                general.ascending ? "Yes" : "No"
              }</span>
            </li>
          </ul>
        </div>
      </div>
      ${await getSpecialSkill(general, depth)}
      ${await getSpecialities(general, depth)}
    </div>
  `;
};

const printSpecialityColor = (
  specialities: Speciality[],
  color: constants.SpecialityLevelName
) => {
  return `
    <tr class="${color}">
      ${specialities
        .map((s) => {
          const level = s.levels.find((l) => l.level.localeCompare(color));
          if (level) {
            return `
            <td >
              <ul>
                ${level.buff
                  .map((b) => {
                    return `
                    <li>
                      <ul>
                        <li>
                          <span class="spectrum-Heading spectrum-Heading--sizeXS">Attribute: </span>
                          <span class="spectrum-Body spectrum-Body--sizeXS">${b.attribute}</span>
                        </li>
                        <li>
                          <span class="spectrum-Heading spectrum-Heading--sizeXS">Value: </span>
                          <span class="spectrum-Body spectrum-Body--sizeXS">${b.value.number}${b.value.unit.localeCompare("percentage") ? "%" : ""}</span>
                        </li>
                        ${
                          b.class
                            ? `
                          <li>
                            <span class="spectrum-Heading spectrum-Heading--sizeXS">Affected Troops: </span>
                            <span class="spectrum-Body spectrum-Body--sizeXS">${b.class}</span>
                          </li>
                        `
                            : ""
                        }
                        ${
                          Array.isArray(b.condition)
                            ? `
                          <li>
                            <span class="spectrum-Heading spectrum-Heading--sizeXS">Condition(s): </span>
                            <span class="spectrum-Body spectrum-Body--sizeXS">${b.condition.map((c) => c).join(", ")}</span>
                          </li>
                        `
                            : ""
                        }
                      </ul>
                    </li>
                  `;
                  })
                  .join("\n")}
              </ul>
            </td>
          `;
          } else {
            return `
            <td>

            </td>
          `;
          }
        })
        .join("\n")}
    </tr>
  `;
};

const getSpecialities = async (general: General, depth: number) => {
  const specialitiesCollection = new SpecialitiesCollection();
  await specialitiesCollection.initialize(depth);

  const specialities = new Array<Speciality>();
  let hasUnknown: boolean = false;
  general.specialities.map((specialName) => {
    const s = specialitiesCollection.getSpeciality(specialName);
    if (s) {
      specialities.push(s);
    } else {
      hasUnknown = true;
    }
  });

  /*eslint-disable @typescript-eslint/no-unnecessary-condition */
  if (hasUnknown) {
    if (DEBUG) {
      return `
        <div class="Specialities">
          <span>Error getting information on Specialities for this general.</span>
        </div>
      `;
    } else return "";
  } else {
    return `
      <div class="Specialities">
        <h3 class="spectrum-Heading spectrum-Heading--sizeL">
          Specialities
        </h3>
        <table>
          <thead>
            ${specialities
              .map((s) => {
                return `
                <th>
                  <span class="spectrum-Heading spectrum-Heading--sizeM">${s.name}</span>
                </th>
              `;
              })
              .join("\n")}
          </thead>
          <tbody>
            ${constants.SpecialityLevelName.options
              .filter((sln) =>
                sln.localeCompare(constants.SpecialityLevelName.Enum.None)
              )
              .map((sln) => {
                return printSpecialityColor(specialities, sln);
              })
              .join("\n")}
          </tbody>
        </table>
      </div>
    `;
  }
};

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

const getAscendingDetails = async (general: General, depth: number) => {
  const ascendingAttributesCollection = new AscendingAttributesCollection();
  await ascendingAttributesCollection.initialize(depth);
  const ascendingDetails: GeneralAscending | undefined =
    ascendingAttributesCollection.getAscendingAttributes(general.id);
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
      <span class="spectrum-Body spectrum-Body--sizeS">Ascending Details for ${general.id} are not available.</span>
    `;
  }
};

const getSpecialSkill = async (general: General, depth: number) => {
  const skillBooksCollection = new SkillBooksCollection();
  await skillBooksCollection.initialize(depth);
  const skillbook: SkillBook | undefined = skillBooksCollection.getSkillBook(
    general.book
  );
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
        <span class="spectrum-Body spectrum-Body--sizeL">${general.id}'s special skill is ${skillbook.name}.</span>
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
      <span class="spectrum-Body spectrum-Body--sizeM">${general.id}'s special skill, ${general.book}, is unknown.</span>
    </div>
    `;
  }
};

const getBaseStats = (general: General) => {
  return `
  <div class="baseStats">
    <h3 class="spectrum-Heading spectrum-Heading--sizeL">
      Base Stats
    <h3>
    <ul class="baseStats">
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeS">Leadership:</span>
        <ul>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.leadership.base}</span>
          </li>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.leadership.increment}</span>
          </li>
        </ul>
      </li>
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeS">Attack:</span>
        <ul>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.attack.base}</span>
          </li>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.attack.increment}</span>
          </li>
        </ul>
      </li>
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeS">Defense:</span>
        <ul>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.defense.base}</span>
          </li>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.defense.increment}</span>
          </li>
        </ul>
      </li>
      <li>
        <span class="spectrum-Heading spectrum-Heading--sizeS">Politics:</span>
        <ul>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Base: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.politics.base}</span>
          </li>
          <li>
            <span class="spectrum-Heading spectrum-Heading--sizeXS">Increment: </span>
            <span class="spectrum-Body spectrum-Body--sizeXS">${general.basic_attributes.politics.increment}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
  `;
};

export default class GeneralDetailsPage extends HTMLElement {
  private _generalName: string = "";
  private generalsCollection = new GeneralsCollection();
  constructor(request: Request) {
    super();

    if (request.url.includes("?")) {
      const params = new URLSearchParams(
        request.url.slice(request.url.indexOf("?"))
      );
      if (DEBUG) {
        console.log(`found params ${params}`);
      }
      this._generalName = params.has("name")
        ? (params.get("name") ?? "Unnamed General")
        : "";
      if (DEBUG) {
        console.log(`generalName is ${this._generalName}`);
      }
    } else {
      if (DEBUG) {
        console.log(`_generalName has length ${this._generalName.length}`);
      }
    }
  }

  connectedCallback = async () => {
    await this.generalsCollection.initialize(0);

    if (this._generalName.length == 0) {
      const generals = this.generalsCollection.generals;
      this.innerHTML = `
        <div class="indexListing">
          <h2 class="spectrum-Heading spectrum-Heading--sizeXL">Available Generals</h2>
          <ul class="indexListing">
            ${generals
              .sort((a, b) => a.id.localeCompare(b.id))
              .map((g) => {
                return `
                  <li>
                    <a href="./?name=${g.id}" class="spectrum-Link spectrum-Link--quiet spectrum-Link--primary">${g.id}</a>
                  </li>
                `;
              })
              .join(" ")}
          </ul>
        </div>
      `;
    } else {
      const general = this.generalsCollection.getGeneral(this._generalName);
      if (general) {
        this.innerHTML = await getMainSection(general);
      } else {
        this.innerHTML = `${this._generalName} Not Found`;
      }
    }
  };
}

function getFrontmatter() {
  return {
    title: "General Details",
    author: "Luke Schierer",
    tableOfContents: false,
  };
}

export { getFrontmatter };
