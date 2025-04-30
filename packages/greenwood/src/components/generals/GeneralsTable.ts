import { LitElement, html, css, nothing } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";

import {
  type ColumnDef,
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
import SpectrumCSSProgressBar from "@spectrum-css/progressbar/dist/index.css" with { type: "css" };
import SpectrumCSSFieldLabel from "@spectrum-css/fieldlabel/dist/index.css" with { type: "css" };

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

  private columns: Array<ColumnDef<Generals.GeneralTableData>> = [
    {
      id: "name",
      header: "General",
      accessorKey: "name",
      cell: (props) =>
        html` <span spectrum-Heading spectrum-Heading--sizeS>
          <strong class=" spectrum-Heading-strong ">
            ${props.getValue()}
          </strong>
        </span>`,
    },
  ];

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
    SpectrumCSSTypography,
    SpectrumCSSTable,
    SpectrumCSSProgressBar,
    SpectrumCSSFieldLabel,
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

      container {
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
   * Handle general class selection change
   */
  private handleClassChange = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    this.generalClass = select.value;
    this.loadData();
  };

  override render() {
    // Define columns

    const table = this.tableController.table({
      columns: this.columns,
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
          ${Constants.GeneralType.options.map(
            (option) => html`
              <option
                value=${option.value}
                ?selected=${this.generalClass === option}
              >
                ${option.replaceAll("_", " ")}
              </option>
            `
          )}
        </select>
      </div>
    `;

    // Progress bar for loading
    const pbwidth =
      (Math.min(this.loadedCount, this.totalCount) / this.totalCount) * 100;

    const progressBar =
      this.loading && this.totalCount > 0
        ? html`
            <div
              role="progressbar"
              aria-valuemin="0"
              aria-valuemax="100"
              class=" spectrum-ProgressBar spectrum-ProgressBar--sizeM spectrum-ProgressBar--topLabel "
              value="${pbwidth}%"
              aria-valuenow="${pbwidth}%"
            >
              <label
                class=" spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-ProgressBar-label "
              >
                Loading generals: ${Math.min(this.loadedCount, this.totalCount)}
                of ${this.totalCount}
              </label>
              <label
                class=" spectrum-FieldLabel spectrum-FieldLabel--sizeM spectrum-ProgressBar-percentage "
              >
                ${pbwidth}%
              </label>
              <div class="spectrum-ProgressBar-track">
                <div
                  class="spectrum-ProgressBar-fill"
                  style="inline-size:${pbwidth}%;"
                ></div>
              </div>
            </div>
          `
        : null;

    if (this.error) {
      return html`
        ${classSelector}
        <div class="error">Error: ${this.error}</div>
      `;
    }

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
      <div class="container spectrum spectrum-Typography spectrum--medium">
        <table
          class="spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized "
        >
          <thead class="spectrum-Table-head">
            ${repeat(
              table.getHeaderGroups(),
              (headerGroup) => headerGroup.id,
              (headerGroup) => html`
                <tr style="${styleMap({ display: "flex", width: "100%" })}">
                  ${repeat(
                    headerGroup.headers,
                    (header) => header.id,
                    (header) => {
                      const ariaSort = header.column.getIsSorted();
                      const ariaSortString =
                        ariaSort === "asc"
                          ? "ascending"
                          : ariaSort === "desc"
                            ? "descending"
                            : "none";
                      const thClass = {
                        "spectrum-Table-headCell": true,
                        "is-sortable": header.column.getCanSort(),
                        "is-sorted-desc":
                          header.column.getIsSorted() === "desc",
                        "is-sorted-asc": header.column.getIsSorted() === "asc",
                      };
                      return html`
                        <th
                          aria-sort="${ariaSortString.length
                            ? ariaSortString
                            : "none"}"
                          class="${classMap(thClass)}"
                          style="${styleMap({
                            display: "flex",
                            width: `${header.getSize()}px`,
                          })}"
                          @click="${header.column.getToggleSortingHandler()}"
                        >
                          ${flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          ${{ asc: " 🔼", desc: " 🔽" }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </th>
                      `;
                    }
                  )}
                </tr>
              `
            )}
          </thead>
          <tbody class="spectrum-Table-body" style=${styleMap(tbodyStyle)}>
            ${repeat(
              this.rowVirtualizerController.getVirtualizer().getVirtualItems(),
              (item) => item.key,
              (item) => {
                const row = rows[item.index];
                return html`
                  <tr
                    style=${styleMap({
                      display: "flex",
                      position: "absolute",
                      transform: `translateY(${item.start}px)`,
                      width: "100%",
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
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "generals-table": GeneralsTable;
  }
}
