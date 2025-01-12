import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
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
import PairTableCSS from "@styles/PairTable.css?inline";

import { Speciality } from "@schemas/specialities";
import { ConfictGroup } from "@schemas/generalConflictGroups";
import { General, GeneralPair } from "@schemas/generals";
import { SkillBook } from "@schemas/skillBooks";
import * as stores from "./store";

import columns from "./columns";
import { GeneralAscending } from "@schemas/ascending";

import { PaginationController } from "./generalTablePagination";

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
    });
    super.connectedCallback();
  }

  protected tableHead(table: Table<GeneralPair>): TemplateResult {
    const theadStyles = {
      "grid-row": `1 / ${table.getHeaderGroups().length + 1}`,
    };
    return html`
      <thead class="not-content spectrum-Table-head">
        ${table.getHeaderGroups().map((headerGroup, index) => {
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
                  return html`
                    <th
                      key=${header.id}
                      colspan=${header.colSpan}
                      class="not-content spectrum-Table-headCell ${classMap(
                        thclasses
                      )}"
                      ,
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

  static override styles?: CSSResultGroup = [
    unsafeCSS(SpectrumTableCSS),
    unsafeCSS(GeneralsCSS),
    unsafeCSS(PairTableCSS),
    css``,
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
          getPaginationRowModel: getPaginationRowModel(),
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
        return html`
          <div
            id="tableContainer"
            class="not-content tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
            ${ref(this.tableContainerRef)}
          >
            <table
              class="spectrum-Table spectrum-Table-main spectrum-Table--sizeM spectrum-Table--emphasized"
            >
              ${this.tableHead(table)}
              <tbody class="spectrum-Table-body">
                ${repeat(
                  table.getRowModel().rows,
                  (row) => row.id,
                  (row) => html`
                    <tr class="spectrum-Table-row">
                      ${row
                        .getVisibleCells()
                        .map(
                          (cell) => html`
                            <td class="spectrum-Table-cell">
                              ${flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          `
                        )}
                    </tr>
                  `
                )}
              </tbody>
            </table>
          </div>
          <pagination-controller
            .hasNextPage=${table.getCanNextPage()}
            .hasPreviousPage=${table.getCanPreviousPage()}
            .nextPage=${table.nextPage}
            .pageCount=${table.getPageCount()}
            .pageIndex=${table.getState().pagination.pageIndex}
            .pageSize=${table.getState().pagination.pageSize}
            .setPageSize="${table.setPageSize}"
            .previousPage=${table.previousPage}
            .firstPage=${table.firstPage}
            .lastPage=${table.lastPage}
          ></pagination-controller>
        `;
      } else {
        return fallback;
      }
    }
  }
}
