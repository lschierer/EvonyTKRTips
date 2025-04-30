import type { GetFrontmatter } from "@greenwood/cli";
import { Constants, Generals, type Buff } from "@evonytkrtips/schemas";
import collection from "@evonytkrtips/assets/collections/generals";

import {
  getAscendingSummary,
  getSpecialitySummary,
  getSkillbookSummary,
  mergeBuffSummaries,
} from "../../lib/BuffSummaryService.ts";
import debugFunction from "../../lib/debug.ts";

const DEBUG = debugFunction(new URL(import.meta.url).pathname);

const getFrontmatter: GetFrontmatter = async () => {
  return Promise.resolve({
    title: "General Comparison",
    layout: "standard",
  });
};

export { getFrontmatter };

// This class will be pre-rendered by Greenwood
export default class GeneralComparisonPage extends HTMLElement {
  private data: Generals.GeneralTableData[] = [];
  private error: string | null = null;
  private loading = true;
  private loadedCount = 0;
  private totalCount = 0;
  private buffFilter: Constants.BuffActivation[] = [
    Constants.BuffActivation.Enum.Overall,
  ];
  private generalType: Constants.GeneralType | null = null;

  constructor() {
    super();
    if (DEBUG) {
      console.log(`GeneralComparisonPage being constructed`);
    }
  }
  // This method will be called during SSR
  async connectedCallback() {
    if (DEBUG) {
      console.log("GeneralComparisonPage connected, loading data");
    }

    // Then load data and update
    await this.loadData();

    if (DEBUG) {
      console.log(`Data loaded: ${this.data.length} generals, rendering...`);
    }
    this.loading = false;
    this.render();
  }

  private async loadData() {
    if (collection.length) {
      this.totalCount = collection.length;
      this.loading = true;

      for (const entry of collection) {
        try {
          const importName = `@evonytkrtips/assets/collections/generals/${entry}`;
          if (DEBUG) {
            console.log(`attempting import of ${importName}`);
          }

          let generalData = (await import(importName, {
            with: { type: "json" },
          })) as object;

          // Handle different import formats
          if ("default" in generalData) {
            generalData = generalData.default as object;
          }

          const valid = Generals.General.safeParse(generalData);
          if (valid.success) {
            if (DEBUG) {
              console.log(`successful parse of ${valid.data.name}`);
            }
            if (this.generalType) {
              if (valid.data.type.length) {
                if (!valid.data.type.includes(this.generalType)) {
                  this.totalCount--;
                  continue;
                }
              } else {
                this.totalCount--;
                continue;
              }
            } else if (DEBUG) {
              console.log(`no filter for type, accepting ${valid.data.name}`);
            }
            const summaries = new Array<Buff.BuffSummaryResponse>();

            // Process specialities
            if (valid.data.specialities.length) {
              for (const speciality of valid.data.specialities) {
                const summary = await getSpecialitySummary(speciality);
                if (!summary.error) {
                  summaries.push(summary);
                }
              }
            }

            // Process ascending
            if (valid.data.ascending) {
              const summary = await getAscendingSummary(valid.data.name);
              if (!summary.error) {
                summaries.push(summary);
              }
            }

            // Process skillbook
            if (valid.data.book) {
              const summary = await getSkillbookSummary(valid.data.book);
              if (!summary.error) {
                summaries.push(summary);
              }
            }

            // Merge all buff summaries
            const mergedSummary = mergeBuffSummaries(summaries);

            // Create table data object
            const tableData: Generals.GeneralTableData = {
              name: valid.data.name,
              attack: 0,
              defense: 0,
              hp: 0,
              attackDebuff: 0,
              defenseDebuff: 0,
              hpDebuff: 0,
            };

            // Process each buff
            for (const buff of mergedSummary.summary) {
              const wanted = this.filterBuffs(buff, valid.data.type);
              if (wanted) {
                let isDebuff = false;
                if (buff.condition && buff.condition.length) {
                  for (const condition of buff.condition) {
                    if (
                      (Constants.DebuffCondition.options as string[]).includes(
                        condition
                      )
                    ) {
                      isDebuff = true;
                      break;
                    }
                  }
                }

                // Add values to the appropriate fields
                if (buff.attribute === "Attack") {
                  if (!isDebuff) {
                    tableData.attack += buff.totalValue;
                  } else {
                    tableData.attackDebuff += buff.totalValue;
                  }
                } else if (buff.attribute === "Defense") {
                  if (!isDebuff) {
                    tableData.defense += buff.totalValue;
                  } else {
                    tableData.defenseDebuff += buff.totalValue;
                  }
                } else if (buff.attribute === "HP") {
                  if (!isDebuff) {
                    tableData.hp += buff.totalValue;
                  } else {
                    tableData.hpDebuff += buff.totalValue;
                  }
                }
              }
            }

            this.data.push(tableData);
            this.loadedCount++;
          }
        } catch (error) {
          console.error(`Error processing general entry:`, error);
        }
      }

      // Sort data by attack value for demonstration
      this.data.sort((a, b) => b.attack - a.attack);
    }
  }

  protected filterBuffs(
    buff: Buff.SummarizedBuff,
    generalTypes: Constants.GeneralType[]
  ): number {
    const filter = new Set<Constants.Condition>();
    if (this.buffFilter.length) {
      for (const bf of this.buffFilter) {
        const f = Constants.AllowedBuffConditions.get(bf);
        if (f) {
          f.map((fi) => filter.add(fi));
        }
      }
    }

    let isDebuff = false;

    if (buff.condition && buff.condition.length) {
      for (const condition of buff.condition) {
        if (
          (Constants.DebuffCondition.options as string[]).includes(condition)
        ) {
          isDebuff = true;
          continue;
        } else if (filter.size) {
          if (![...filter].includes(condition)) {
            return 0;
          }
        }
      }
    }

    if (buff.class) {
      if (
        this.buffFilter.length &&
        !this.buffFilter.includes(Constants.BuffActivation.Enum.Wall)
      ) {
        if (!isDebuff) {
          if (buff.class == Constants.TroopClass.Enum["Ground Troops"]) {
            if (
              !generalTypes.includes(
                Constants.GeneralType.Enum.ground_specialist
              )
            ) {
              return 0;
            }
          }
          if (buff.class == Constants.TroopClass.Enum["Ranged Troops"]) {
            if (
              !generalTypes.includes(
                Constants.GeneralType.Enum.ranged_specialist
              )
            ) {
              return 0;
            }
          }
          if (buff.class == Constants.TroopClass.Enum["Mounted Troops"]) {
            if (
              !generalTypes.includes(
                Constants.GeneralType.Enum.mounted_specialist
              )
            ) {
              return 0;
            }
          }
          if (buff.class == Constants.TroopClass.Enum["Siege Machines"]) {
            if (
              !generalTypes.includes(
                Constants.GeneralType.Enum.siege_specialist
              )
            ) {
              return 0;
            }
          }
        }
      }
    }

    return buff.totalValue;
  }

  private buffFilterChanged(e: Event) {
    const target = e.target as HTMLSelectElement | null;
    if (target) {
      const bf = target.value;
      if (bf === "overall") {
        this.buffFilter = [Constants.BuffActivation.Enum.Overall];
      } else if (bf === "attack") {
        this.buffFilter = [
          Constants.BuffActivation.Enum.Overall,
          Constants.BuffActivation.Enum.Attacking,
        ];
      } else if (bf === "rein") {
        this.buffFilter = [
          Constants.BuffActivation.Enum.Overall,
          Constants.BuffActivation.Enum.Defense,
          Constants.BuffActivation.Enum["In City"],
          Constants.BuffActivation.Enum.Reinforcing,
        ];
      } else if (bf === "wall") {
        this.buffFilter = [
          Constants.BuffActivation.Enum.Overall,
          Constants.BuffActivation.Enum.Defense,
          Constants.BuffActivation.Enum.Wall,
        ];
      } else if (bf === "monster") {
        this.buffFilter = [
          Constants.BuffActivation.Enum.Overall,
          Constants.BuffActivation.Enum.Attacking,
          Constants.BuffActivation.Enum.PvM,
        ];
      }

      if (DEBUG) {
        console.log(`buffFilter is now ${this.buffFilter.join(", ")}`);
      }

      // Reload data with new filter
      this.data = [];
      this.loadedCount = 0;
      this.loading = true;
      this.loadData()
        .then(() => {
          this.render();
        })
        .catch((error: unknown) => {
          console.error(JSON.stringify(error));
        });
    }
  }

  private render() {
    if (DEBUG) {
      console.log(`GeneralComparisonPage render function start`);
    }
    // Create HTML content
    let content = "";

    // Add header and description
    content += `
      <div class="spectrum spectrum-Typography spectrum--medium">
        <h1 class="spectrum-Heading spectrum-Heading--sizeL">General Comparison</h1>

        <p class="spectrum-Body spectrum-Body--sizeM">
          This allows you to compare the relative buffs of the Mounted Generals.
        </p>

        <div class="filter-controls">
          <label for="buff-filter" class="spectrum-FieldLabel">Selection type:</label>
          <select id="buff-filter" class="spectrum-Picker">
            <option value="overall">Overall</option>
            <option value="attack">PvP Attack</option>
            <option value="rein">PvP Reinforcement</option>
            <option value="wall">Wall General</option>
            <option value="monster">Monster Hunting</option>
          </select>
        </div>
    `;

    // Add loading indicator or error message
    if (this.loading) {
      if (DEBUG) {
        console.log(`I am still loading`);
      }
      const progressPercent =
        (this.loadedCount / Math.max(this.totalCount, 1)) * 100;
      content += `
        <div class="loading">
          <div class="progress-bar-container">
            <div class="progress-bar" style="width: ${progressPercent}%"></div>
          </div>
          <div class="progress-text">
            Loading generals: ${this.loadedCount} of ${this.totalCount}
          </div>
        </div>
      `;
    } else if (this.error) {
      if (DEBUG) {
        console.error(`Render found an error`);
      }
      content += `<div class="error">Error: ${this.error}</div>`;
    } else {
      if (DEBUG) {
        console.log(`adding the table now`);
      }
      // Add table
      content += `
        <table class="spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized">
          <thead class="spectrum-Table-head">
            <tr>
              <th class="spectrum-Table-headCell">General</th>
              <th class="spectrum-Table-headCell">Attack</th>
              <th class="spectrum-Table-headCell">Defense</th>
              <th class="spectrum-Table-headCell">HP</th>
              <th class="spectrum-Table-headCell">Attack Debuff</th>
              <th class="spectrum-Table-headCell">Defense Debuff</th>
              <th class="spectrum-Table-headCell">HP Debuff</th>
            </tr>
          </thead>
          <tbody class="spectrum-Table-body">
      `;

      if (this.data.length === 0) {
        content += `
          <tr>
            <td colspan="7" class="no-data">No data available</td>
          </tr>
        `;
      } else {
        for (const general of this.data) {
          content += `
            <tr class="spectrum-Table-row">
              <td class="spectrum-Table-cell">
                <span class="spectrum-Heading spectrum-Heading--sizeS">
                  <strong>${general.name}</strong>
                </span>
              </td>
              <td class="spectrum-Table-cell">${general.attack}%</td>
              <td class="spectrum-Table-cell">${general.defense}%</td>
              <td class="spectrum-Table-cell">${general.hp}%</td>
              <td class="spectrum-Table-cell">${general.attackDebuff}%</td>
              <td class="spectrum-Table-cell">${general.defenseDebuff}%</td>
              <td class="spectrum-Table-cell">${general.hpDebuff}%</td>
            </tr>
          `;
        }
      }

      content += `
          </tbody>
        </table>
      `;
    }

    content += `</div>`;

    // Add styles
    content += `
      <link rel="stylesheet" href="/node_modules/@evonytkrtips/assets/dist/styles/ComparisionTablePage.css" />
    `;

    // Add client-side script for event handling
    content += `
      <script>
        document.addEventListener('DOMContentLoaded', function() {
          const filterSelect = document.getElementById('buff-filter');
          if (filterSelect) {
            filterSelect.addEventListener('change', function() {
              // For now, just reload the page with the new filter
              window.location.href = window.location.pathname + '?filter=' + this.value;
            });
          }
        });
      </script>
    `;

    // Set the innerHTML of the element
    this.innerHTML = content;
  }
}
