import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import {
  getSortedRowModel,
  flexRender,
  getCoreRowModel,
  TableController,
} from "@tanstack/lit-table";
import { VirtualizerController } from "@tanstack/lit-virtual";

import { Constants, type Generals } from "@evonytkrtips/schemas";
import collection from "@evonytkrtips/assets/collections/generals";

import SpectrumCSSTokens from "@spectrum-css/tokens/dist/index.css" with { type: "css" };
import SpectrumCSSTypography from "@spectrum-css/typography/dist/index.css" with { type: "css" };
import SpectrumCSSTable from "@spectrum-css/table/dist/index.css" with { type: "css" };

import debugFunction from "../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

/**
 * A table component that displays general data with their buff summaries
 */
@customElement("generals-table")
export default class GeneralsTable extends LitElement {
  @state() private data: Generals.GeneralTableData[] = [];
  @state() private loading = true;
  @state() private error: string | null = null;
  @state() private sorting: Array<{ id: string; desc: boolean }> = [];
  @state() private loadedCount = 0;
  @state() private totalCount = 0;
  private tableContainerRef: Ref = createRef();
  private tableController = new TableController<Generals.GeneralTableData>(
    this
  );
  private rowVirtualizerController: VirtualizerController<Element, Element> =
    new VirtualizerController(this, {
      count: this.data.length,
      getScrollElement: () => this.tableContainerRef.value ?? null,
      estimateSize: () => 33,
      overscan: 5,
    });

  @property({ type: String })
  accessor generalClass: string = Constants.GeneralType.Enum.mounted_specialist;

  static override styles = [
    SpectrumCSSTokens,
    SpectrumCSSTable,
    SpectrumCSSTypography,
    css`
      :host {
        display: block;
        font-family: var(--font-family, sans-serif);
      }

      .loading,
      .error {
        padding: 1rem;
        text-align: center;
      }

      .error {
        color: red;
      }

      .class-selector {
        margin-bottom: 1rem;
      }

      .class-selector select {
        padding: 0.5rem;
        border-radius: 4px;
        border: 1px solid #ddd;
      }

      .progress-bar-container {
        width: 100%;
        height: 20px;
        background-color: #f0f0f0;
        border-radius: 10px;
        margin: 1rem 0;
        overflow: hidden;
      }

      .progress-bar {
        height: 100%;
        background-color: #4caf50;
        transition: width 0.3s ease;
      }

      .progress-text {
        text-align: center;
        font-size: 0.9rem;
        margin-top: 0.25rem;
        color: #666;
      }

      table-container {
        position: "relative";
        max-height: 50vh;
        min-height: 25vh;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        margin: 1rem 0;
      }

      .positive {
        color: var(--spectrum-green-visual-color);
      }

      .negative {
        color: var(--spectrum-red-visual-color);
      }

      .no-data {
        padding: 1rem;
        text-align: center;
        font-style: italic;
        color: #666;
      }
    `,
  ];

  override connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  override updated(changed: Map<string | number | symbol, unknown>) {
    super.updated(changed);

    if (changed.has("data") || (changed.has("loading") && !this.loading)) {
      const virt = this.rowVirtualizerController.getVirtualizer();
      virt.setOptions({
        ...virt.options,
        count: this.data.length,
        getScrollElement: () => this.tableContainerRef.value ?? null,
      });
    }
  }

  /**
   * Loads general data from the API
   */
  private loadData() {
    try {
      this.loading = true;
      this.error = null;
      this.data = [];
      this.loadedCount = 0;

      if (DEBUG) {
        console.log("Starting to load general data");
      }

      // Process each general file
      const generalNames = collection.map((file) => {
        // Remove .json extension
        return file.replace(/\.json$/, "");
      });

      this.totalCount = generalNames.length;

      // Process generals in parallel
      generalNames.forEach((name) => {
        this.loadGeneralData(name).catch((error: unknown) => {
          if (DEBUG) {
            console.error(`Error in loadGeneralData for ${name}:`, error);
          }
        });
      });
    } catch (error) {
      console.error("Error starting data load:", error);
      this.error = error instanceof Error ? error.message : "Unknown error";
      this.loading = false;
      this.requestUpdate("loading");
    }
  }

  /**
   * Loads data for a single general
   */
  private async loadGeneralData(name: string): Promise<void> {
    try {
      const response = await fetch(
        `/api/collections/generals?name=${encodeURIComponent(name)}&buffsummary=true`
      );

      if (!response.ok) {
        if (DEBUG) {
          console.error(
            `Failed to fetch data for general ${name}: ${response.statusText}`
          );
        }
        return;
      }

      const responseData = (await response.json()) as object;

      if ("error" in responseData) {
        if (DEBUG) {
          const error: Error = responseData.error as Error;
          console.error(`Error for general ${name}: ${error.message}`);
        }
        return;
      }

      // Parse the general data

      let generalData: Generals.GeneralWithBuffs | null = null;
      if ("message" in responseData) {
        generalData = responseData["message"] as Generals.GeneralWithBuffs;
      }

      if (!generalData) {
        if (DEBUG) {
          console.warn(`No buff summary available for general ${name}`);
        }
        return;
      }

      // Check if the general is of the requested class
      if (!(generalData.type as string[]).includes(this.generalClass)) {
        if (DEBUG) {
          console.log(
            `Skipping general ${name} as ${generalData.type.join(", ")} not a ${this.generalClass}`
          );
        }
        queueMicrotask(() => {
          this.totalCount = this.totalCount - 1;
        });
        return;
      }

      // Create a table data object
      const tableData: Generals.GeneralTableData = {
        name: generalData.name,
        attack: 0,
        defense: 0,
        hp: 0,
        attackDebuff: 0,
        defenseDebuff: 0,
        hpDebuff: 0,
      };

      // Process each buff in the summary
      for (const buff of generalData.buffSummary.summary) {
        // Check if this is a debuff
        let isDebuff = false;
        if (buff.condition && buff.condition.length > 0) {
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

        // Add to the appropriate category
        if (buff.attribute === "Attack") {
          if (isDebuff) {
            tableData.attackDebuff += buff.totalValue;
          } else {
            tableData.attack += buff.totalValue;
          }
        } else if (buff.attribute === "Defense") {
          if (isDebuff) {
            tableData.defenseDebuff += buff.totalValue;
          } else {
            tableData.defense += buff.totalValue;
          }
        } else if (buff.attribute === "HP") {
          if (isDebuff) {
            tableData.hpDebuff += buff.totalValue;
          } else {
            tableData.hp += buff.totalValue;
          }
        }
      }

      // Update the data array
      this.data = [...this.data, tableData];

      // Update the loaded count
      this.loadedCount++;

      // Check if all generals are loaded
      if (this.loadedCount === this.totalCount) {
        this.loading = false;
        this.requestUpdate("loading");
      }

      // Force a re-render
      this.requestUpdate();
    } catch (error) {
      if (DEBUG) {
        console.error(`Error processing general ${name}:`, error);
      }

      // Update the loaded count even if there was an error
      this.loadedCount++;

      // Check if all generals are loaded
      if (this.loadedCount === this.totalCount) {
        this.loading = false;
      }

      // Force a re-render
      this.requestUpdate();
    }
  }

  /**
   * Format a number with a + or - sign and percentage if needed
   */
  private formatValue(value: number): string {
    if (value === 0) return "0%";
    const sign = value > 0 ? "+" : "";
    return `${sign}${value}%`;
  }

  /**
   * Sort the data based on the current sorting state
   */
  private getSortedData(): Generals.GeneralTableData[] {
    if (this.sorting.length === 0) {
      return this.data;
    }

    const [{ id, desc }] = this.sorting;

    return [...this.data].sort((a, b) => {
      const aValue = a[id as keyof Generals.GeneralTableData];
      const bValue = b[id as keyof Generals.GeneralTableData];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return desc
          ? bValue.localeCompare(aValue)
          : aValue.localeCompare(bValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return desc ? bValue - aValue : aValue - bValue;
      }

      return 0;
    });
  }

  /**
   * Handle column header click for sorting
   */
  private handleHeaderClick(columnId: string) {
    if (this.sorting.length === 0 || this.sorting[0].id !== columnId) {
      this.sorting = [{ id: columnId, desc: false }];
    } else if (this.sorting[0].id === columnId && !this.sorting[0].desc) {
      this.sorting = [{ id: columnId, desc: true }];
    } else {
      this.sorting = [];
    }

    this.requestUpdate();
  }

  /**
   * Get the sort indicator for a column
   */
  private getSortIndicator(columnId: string): string {
    if (this.sorting.length === 0 || this.sorting[0].id !== columnId) {
      return "";
    }

    return this.sorting[0].desc ? " 🔽" : " 🔼";
  }

  /**
   * Handle general class selection change
   */
  private handleClassChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    this.generalClass = select.value;
    this.loadData();
  };

  override render() {
    // Define columns
    const columns: Array<{
      id: string;
      header: string;
      accessor: keyof Generals.GeneralTableData;
      isNumeric: boolean;
    }> = [
      { id: "name", header: "General", accessor: "name", isNumeric: false },
      {
        id: "attack",
        header: "Attack Buff",
        accessor: "attack",
        isNumeric: true,
      },
      {
        id: "defense",
        header: "Defense Buff",
        accessor: "defense",
        isNumeric: true,
      },
      { id: "hp", header: "HP Buff", accessor: "hp", isNumeric: true },
      {
        id: "attackDebuff",
        header: "Attack Debuff",
        accessor: "attackDebuff",
        isNumeric: true,
      },
      {
        id: "defenseDebuff",
        header: "Defense Debuff",
        accessor: "defenseDebuff",
        isNumeric: true,
      },
      {
        id: "hpDebuff",
        header: "HP Debuff",
        accessor: "hpDebuff",
        isNumeric: true,
      },
    ];

    // Class selector options
    const classOptions = [
      {
        value: Constants.GeneralType.Enum.mounted_specialist,
        label: "Mounted Specialist",
      },
      {
        value: Constants.GeneralType.Enum.ground_specialist,
        label: "Ground Specialist",
      },
      {
        value: Constants.GeneralType.Enum.ranged_specialist,
        label: "Ranged Specialist",
      },
      { value: Constants.GeneralType.Enum.political, label: "Political" },
    ];

    const table = this.tableController.table({
      columns,
      data: this.data,
      getSortedRowModel: getSortedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });

    // Class selector
    const classSelector = html`
      <div class="class-selector spectrum spectrum--medium spectrum-Typography">
        <label for="general-class">General Class: </label>
        <select
          id="general-class"
          @change=${this.handleClassChange}
          .value=${this.generalClass}
        >
          ${classOptions.map(
            (option) => html`
              <option
                value=${option.value}
                ?selected=${this.generalClass === option.value}
              >
                ${option.label}
              </option>
            `
          )}
        </select>
      </div>
    `;

    // Progress bar for loading
    const progressBar =
      this.loading && this.totalCount > 0
        ? html`
            <div class="progress-bar-container">
              <div
                class="progress-bar"
                style="width: ${(Math.min(this.loadedCount, this.totalCount) /
                  this.totalCount) *
                100}%"
              ></div>
            </div>
            <div class="progress-text">
              Loading generals: ${Math.min(this.loadedCount, this.totalCount)}
              of ${this.totalCount}
              (${Math.round((this.loadedCount / this.totalCount) * 100)}%)
            </div>
          `
        : null;

    if (this.error) {
      return html`
        ${classSelector}
        <div class="error">Error: ${this.error}</div>
      `;
    }

    const sortedData = this.getSortedData();
    const showTable = !this.loading || this.data.length > 0;
    const { rows } = table.getRowModel();
    const virtualizer = this.rowVirtualizerController.getVirtualizer();

    const tbodyStyle = {
      height: `${virtualizer.getTotalSize()}px`,
      "overflow-y": "auto",
      "overflow-x": "hidden",
      "max-height": "25vh",
      width: "100%",
    };

    // Render table
    return html`
      ${classSelector} ${progressBar}
      ${showTable
        ? html`
            ${sortedData.length > 0
              ? html`
                  <div
                    class="table-container spectrum spectrum-Typography spectrum--medium"
                  >
                    <table
                      class=" spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized "
                    >
                      <thead class="spectrum-Table-head">
                        ${repeat(
                          table.getHeaderGroups(),
                          (headerGroup) => headerGroup.id,
                          (headerGroup) =>
                            html`${repeat(
                              headerGroup.headers,
                              (header) => header.id,
                              (header) => {
                                const thClass = {
                                  "spectrum-Table-headCell": true,
                                  "is-sortable": header.column.getCanSort(),
                                  "is-sorted-desc": header.column.getCanSort()
                                    ? header.column.getIsSorted()
                                      ? header.column.getIsSorted()
                                      : false
                                    : false,
                                  "is-sorted-asc": header.column.getCanSort()
                                    ? header.column.getIsSorted()
                                      ? header.column.getIsSorted()
                                      : false
                                    : false,
                                };
                                return html`
                                  <th class="${classMap(thClass)}">
                                    ${header.isPlaceholder
                                      ? null
                                      : flexRender(
                                          header.column.columnDef.header,
                                          header.getContext()
                                        )}
                                  </th>
                                `;
                              }
                            )}`
                        )}
                      </thead>
                      <tbody
                        ${ref(this.tableContainerRef)}
                        class="scroll-container spectrum-Table-body"
                        style="${styleMap(tbodyStyle)}"
                      >
                        ${repeat(
                          this.rowVirtualizerController
                            .getVirtualizer()
                            .getVirtualItems(),
                          (item) => item.key,
                          (item, index) => {
                            const row = rows[item.index];
                            return html`
                              <tr
                                data-index=${index}
                                class="spectrum-Table-row row"
                                style=${styleMap({
                                  position: "absolute",
                                  transform: `translateY(${item.start}px)`,
                                  display: "flex",
                                })}
                                ${ref((node) => {
                                  this.rowVirtualizerController
                                    .getVirtualizer()
                                    .measureElement(node);
                                })}
                              >
                                ${repeat(
                                  row.getVisibleCells(),
                                  (cell) => cell.id,
                                  (cell) => html`
                                    <td
                                      class="spectrum-Table-cell"
                                      style=${styleMap({
                                        display: "flex",
                                        width: `${cell.column.getSize()}px`,
                                      })}
                                    >
                                      ${flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                      )}
                                    </td>
                                  `
                                )}
                              </tr>
                            `;
                          }
                        )}
                      </tbody>
                    </table>
                  </div>
                `
              : html`
                  <div class="no-data">
                    ${this.loading
                      ? "Loading generals..."
                      : `No generals found for ${classOptions.find((o) => o.value === this.generalClass)?.label || this.generalClass}.`}
                  </div>
                `}
          `
        : html` <div class="loading">Preparing to load generals data...</div> `}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "generals-table": GeneralsTable;
  }
}
