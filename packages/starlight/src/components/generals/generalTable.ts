import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingFn,
  type SortingState,
  TableController,
  createColumnHelper,
  type Table,
  type TableState,
  type TableOptions,
  type Header,
  type Row,
} from "@tanstack/lit-table";
import { VirtualizerController } from "@tanstack/lit-virtual";

import {
  LitElement,
  html,
  css,
  type PropertyValues,
  type CSSResultGroup,
  unsafeCSS,
  type TemplateResult,
  nothing,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { createRef, ref, type Ref } from "lit/directives/ref.js";
import { styleMap } from "lit/directives/style-map.js";
import { classMap } from "lit/directives/class-map.js";

import { StoreController } from "@nanostores/lit";
import { subscribeKeys } from "nanostores";

import {
  Tabulator,
  AccessorModule,
  ColumnCalcsModule,
  DataTreeModule,
  EditModule,
  FilterModule,
  FormatModule,
  MutatorModule,
  ReactiveDataModule,
  ResponsiveLayoutModule,
  ResizeColumnsModule,
  SortModule,
  PageModule,
} from "tabulator-tables";
Tabulator.registerModule([
  AccessorModule,
  ColumnCalcsModule,
  DataTreeModule,
  EditModule,
  FilterModule,
  FormatModule,
  MutatorModule,
  ReactiveDataModule,
  ResponsiveLayoutModule,
  ResizeColumnsModule,
  SortModule,
]);

import SpectrumTableCSS from "@spectrum-css/table/dist/index.css?inline";
import GeneralsCSS from "@styles/generals.css?inline";

import { Speciality } from "@schemas/specialities";
import { ConfictGroup } from "@schemas/generalConflictGroups";
import { General, GeneralPair } from "@schemas/generals";
import { SkillBook } from "@schemas/skillBooks";
import * as stores from "./store";

import columns from "./columns";
import { GeneralAscending } from "@schemas/ascending";

const DEBUG = true;

@customElement("table-element")
export default class TableElement extends LitElement {
  @property({ type: Array })
  public generals = new Array<General>();

  @property({ type: Array })
  public ascending = new Array<GeneralAscending>();

  @property({ type: Array })
  public skillbooks = new Array<SkillBook>();

  @property({ type: Array })
  public conflictGroups = new Array<ConfictGroup>();

  @property({ type: Array })
  public specialities = new Array<Speciality>();

  @state()
  private _tableState: TableState | null = null;

  private pairsController = new StoreController(this, stores.pairs);

  private ascendingController = new StoreController(
    this,
    stores.ascendingAttributes
  );

  private generalsController = new StoreController(this, stores.generals);

  private skillbooksController = new StoreController(this, stores.skillBooks);

  private confictGroupController = new StoreController(
    this,
    stores.conflictGroups
  );

  private specialitiesController = new StoreController(
    this,
    stores.specialities
  );

  @state()
  private _sorting: SortingState = [];

  private tableController = new TableController<GeneralPair>(this);
  private rowVirtualizerController: VirtualizerController<
    Element,
    Element
  > | null = null;
  private tableContainerRef: Ref = createRef();

  private sortKey: string = "primary";
  private sortDirection: string = "asc";

  constructor() {
    super();
    stores.pairs.subscribe((pairs) => {});
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("generals")) {
      if (Array.isArray(this.generals)) {
        stores.generals.set(this.generals);
        if (DEBUG) {
          console.log(
            `I now have ${this.generalsController.value.length} generals`
          );
        }
      } else {
        if (DEBUG) {
          console.warn(
            `this.generals is not an array, it is '${this.generals}'`
          );
        }
      }
    }
    if (_changedProperties.has("ascending")) {
      if (Array.isArray(this.ascending)) {
        stores.ascendingAttributes.set(this.ascending);
        if (DEBUG) {
          console.log(
            `I now have ${this.ascendingController.value.length} ascending attributes`
          );
        }
      } else {
        if (DEBUG) {
          console.log(
            `this.ascending was not an array, it is '${this.ascending}'`
          );
        }
      }
    }
    if (_changedProperties.has("skillbooks")) {
      if (Array.isArray(this.skillbooks)) {
        stores.skillBooks.set(this.skillbooks);
        if (DEBUG) {
          console.log(
            `I now have ${this.skillbooksController.value.length} skillbooks`
          );
        }
      } else {
        if (DEBUG) {
          console.warn(
            `this.skillBooks was not an array, it is '${this.skillbooks}'`
          );
        }
      }
    }
    if (_changedProperties.has("conflictGroups")) {
      if (Array.isArray(this.conflictGroups)) {
        stores.conflictGroups.set(this.conflictGroups);
        if (DEBUG) {
          console.log(
            `I now have ${this.confictGroupController.value.length} conflictGroups`
          );
        }
      } else {
        if (DEBUG) {
          console.warn(
            `this.conflictGroups was not an array, it is '${this.conflictGroups}'`
          );
        }
      }
    }
    if (_changedProperties.has("specialities")) {
      if (Array.isArray(this.specialities)) {
        stores.specialities.set(this.specialities);
        if (DEBUG) {
          console.log(
            `I now have ${this.specialitiesController.value.length} specialities`
          );
        }
      } else {
        if (DEBUG) {
          console.warn(
            `this.specialities was not an array, it is '${this.specialities}'`
          );
        }
      }
    }
  }

  override connectedCallback(): void {
    stores.pairs.listen((v, o) => {
      if (DEBUG) {
        console.log(`connectedCallback sees a change to pairs`);
        console.log(
          `this.tableContainerRef.value is ${this.tableContainerRef.value ? "present" : "not present"}`
        );
      }
      this.rowVirtualizerController = new VirtualizerController(this, {
        count: v.length,
        getScrollElement: () => this.tableContainerRef.value!,
        estimateSize: () => 33,
        overscan: 5,
      });
      if (DEBUG) {
        console.log(
          `connectedCallback rowVirtualizerController shows ${this.rowVirtualizerController.getVirtualizer().getVirtualItems().length} virtual items`
        );
      }
    });
    super.connectedCallback();
  }

  protected tableHead(table: Table<GeneralPair>): TemplateResult {
    const theadStyles = {
      "grid-row": `1 / ${table.getHeaderGroups().length + 1}`,
    };
    return html`
      <thead
        class="not-content spectrum-Table-head"
        style=${styleMap(theadStyles)}
      >
        ${table.getHeaderGroups().map((headerGroup, index) => {
          const trStyle = {
            "grid-column": `${index + 1} / ${index + 1 + headerGroup.headers.length}`,
          };
          return html`
            <tr key=${headerGroup.id}>
              ${headerGroup.headers.map(
                (header: Header<GeneralPair, unknown>) => {
                  /*
                   * there doesn't seem to be an API for the *current* just the *next*
                   * the state machine goes ascending -> decending -> other -> acending (loop)
                   * if can sort, test further.
                   * if next is ascending, I am currently on "other"
                   * If next is not ascending it could be decending or "other".
                   * if next is decending, I am currently on ascending.
                   * if next is niether ascending nor decending, I am currently on decending.
                   * else I could not sort, so return false
                   */
                  const thclasses = {
                    "is-sortable": header.column.getCanSort() ? true : false,
                    "is-sorted-asc": header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === "asc"
                        ? false
                        : header.column.getNextSortingOrder() === "desc"
                          ? true
                          : false
                      : false,
                    "is-sorted-desc": header.column.getCanSort()
                      ? header.column.getNextSortingOrder() === "asc"
                        ? false
                        : header.column.getNextSortingOrder() === "desc"
                          ? false
                          : true
                      : false,
                  };
                  const thStyles = {
                    "grid-column": `${header.index + 1} / ${header.index + 1 + header.colSpan}`,
                  };
                  return html`
                    <th
                      key=${header.id}
                      colspan=${header.colSpan}
                      class="not-content spectrum-Table-headCell ${classMap(
                        thclasses
                      )}"
                      ,
                      style=${styleMap(thStyles)}
                      aria-sort="${header.column.getCanSort()
                        ? header.column.getNextSortingOrder() === "asc"
                          ? "other"
                          : header.column.getNextSortingOrder() === "desc"
                            ? "ascending"
                            : "descending"
                        : "none"}"
                      @click="${header.column.getToggleSortingHandler()}"
                    >
                      ${header.isPlaceholder
                        ? null
                        : html`
                            <span
                              class="tableHeader spectrum-Table-columnTitle"
                            >
                              ${flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              ${{ asc: " 🔼", desc: " 🔽" }[
                                header.column.getIsSorted() as string
                              ] ?? null}
                            </span>
                          `}
                    </th>
                  `;
                }
              )}
            </tr>
          `;
        })}
      </thead>
    `;
  }

  protected tableBody(
    table: Table<GeneralPair>,
    rows: Row<GeneralPair>[]
  ): TemplateResult {
    if (DEBUG) {
      console.log(`tableBody called with ${rows.length} rows`);
    }
    if (this.rowVirtualizerController) {
      if (DEBUG) {
        console.log(`tableBody has a rowVirtualizerController`);
      }
      const virtualizer = this.rowVirtualizerController.getVirtualizer();
      const bodyStyles = {
        "grid-row": `${table.getHeaderGroups().length + 1} / -1`,
      };
      return html`
        <tbody class="spectrum-Table-body" style=${styleMap(bodyStyles)}>
          ${repeat(
            this.rowVirtualizerController.getVirtualizer().getVirtualItems(),
            (item) => item.key,
            (item) => {
              const row = rows[item.index];
              return html`
                <tr class="spectrum-Table-row" style=${styleMap({})}>
                  ${repeat(
                    row.getVisibleCells(),
                    (cell) => cell.id,
                    (cell) => {
                      return html`
                        <td class="spectrum-Table-cell" style=${styleMap({})}>
                          ${flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      `;
                    }
                  )}
                </tr>
              `;
            }
          )}
        </tbody>
      `;
    }
    return html`
      <tbody>
        fallback
      </tbody>
    `;
  }

  static override styles?: CSSResultGroup = [
    unsafeCSS(SpectrumTableCSS),
    unsafeCSS(GeneralsCSS),
    css`
      div#tableContainer.tableContainer {
        display: grid;
        overflow-x: scroll;
        overflow: scroll;
        margin-top: 1rem;
        width: minmax(max-content, 50vw);
        height: 50vh;
        position: "relative";
      }

      div#tableContainer.tableContainer
        table.spectrum-Table.spectrum-Table-main {
        grid-column: 1/-1;
        grid-row: 1/-1;
        display: grid;
        grid-auto-flow: row;
        grid-template-columns: subgrid;
        grid-template-rows: subgrid;
      }

      thead.spectrum-Table-head {
        grid-column: 1/-1;
        display: table;
        height: fit-content;
        background-color: var(--spectrum-table-header-background-color);
        z-index:;
      }

      thead.spectrum-Table-head tr {
        border-bottom-width: var(--spectrum-table-border-width);
        border-bottom-style: solid;
        border-bottom-color: var(--spectrum-table-border-color);
      }

      thead.spectrum-Table-head tr th.spectrum-Table-headCell {
        text-align: center;
        border-top: 0px;
        border-bottom: 0px;
        height: 100%;
      }

      th div {
        height: max-content;
        overflow: visible;
        word-wrap: normal;
      }

      tbody.spectrum-Table-body tr.spectrum-Table-row {
        grid-column: 1/-1;
        display: table;
        width: 100%;
        height: max-content;
      }

      tbody.spectrum-Table-body tr.spectrum-Table-row td.spectrum-Table-cell {
        height: fit-content;
      }
    `,
  ];

  private index = 0;
  protected override render() {
    if (DEBUG) {
      console.log(`TableElement render start ${this.index++}`);
    }

    const fallback = html`
      <div
        class="tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
        ${ref(this.tableContainerRef)}
      >
        pending data
      </div>
    `;

    if (
      !Array.isArray(this.pairsController.value) ||
      this.pairsController.value.length == 0
    ) {
      return fallback;
    } else {
      if (DEBUG) {
        console.log(
          `in render level for 0th pair is ${this.pairsController.value[0].primary.level}`
        );
      }

      if (stores.pairs.value) {
        const table = this.tableController.table({
          columns,
          data: stores.pairs.value,
          manualSorting: false,
          state: {
            sorting: this._sorting,
          },

          onSortingChange: (updaterOrValue) => {
            if (typeof updaterOrValue === "function") {
              this._sorting = updaterOrValue(this._sorting);
            } else {
              this._sorting = updaterOrValue;
            }
          },
          getSortedRowModel: getSortedRowModel(),
          getCoreRowModel: getCoreRowModel(),
          renderFallbackValue: "pending data",
          defaultColumn: {
            enableHiding: true,
            enableSorting: true,
            invertSorting: false,
            sortDescFirst: false,
            sortUndefined: "last",
          },
          initialState: {
            columnVisibility: stores.columnVisibility.get(),
          },
        });

        const { rows } = table.getRowModel();
        if (this.rowVirtualizerController) {
          const virtualizer = this.rowVirtualizerController.getVirtualizer();
          const tableStyle = {
            "grid-template-columns": `repeat(${rows[0].getVisibleCells().length}, 1fr)`,
            "grid-template-rows": `repeat(${table.getHeaderGroups().length + rows.length}, minmax(max-content,5rem)
            )`,
          };
          return html`
            <div
              id="tableContainer"
              class="not-content tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
              style="${styleMap(tableStyle)}"
              ${ref(this.tableContainerRef)}
            >
              <table
                class="spectrum-Table spectrum-Table-main spectrum-Table--sizeM spectrum-Table--emphasized"
              >
                ${this.tableHead(table)} ${this.tableBody(table, rows)}
              </table>
            </div>
          `;
        } else {
          return fallback;
        }
      } else {
        return fallback;
      }
    }
  }
}
