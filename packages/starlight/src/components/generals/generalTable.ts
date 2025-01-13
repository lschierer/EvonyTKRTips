import {
  type Column,
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

import { StoreController, withStores } from "@nanostores/lit";
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
import * as constants from "@schemas/constants";
import { ConfictGroup } from "@schemas/generalConflictGroups";
import { General, GeneralPair } from "@schemas/generals";
import { SkillBook } from "@schemas/skillBooks";
import * as stores from "./store";

import columns from "./columns";
import { GeneralAscending } from "@schemas/ascending";

import { PaginationController } from "./generalTablePagination";
import { data } from "autoprefixer";
import defaultVisibility from "./visibility/default";
import pvmVisibility from "./visibility/pvm";

const DEBUG = true;

@customElement("table-element")
export default class TableElement extends withStores(LitElement, [
  stores.generalUseCase,
  stores.pairs,
]) {
  private pairsController = new StoreController(this, stores.pairs);

  private tableController = new TableController<GeneralPair>(this);
  private tableContainerRef: Ref = createRef();

  private table: Table<GeneralPair> | null = null;

  constructor() {
    super();
    stores.pairs.subscribe((pairs) => {});
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
  }

  override connectedCallback(): void {
    stores.pairs.listen((v, o) => {
      if (DEBUG) {
        console.log(`connectedCallback sees a change to pairs`);
      }
    });
    stores.generalUseCase.listen((v, o) => {
      if (DEBUG) {
        console.log(`connectedCallback sees a change to generalUseCase Store`);
      }
      if (this.table) {
        this.requestUpdate();
      } else {
        if (DEBUG) {
          console.log(`however the table is not present`);
        }
      }
    });
    super.connectedCallback();
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
      if (DEBUG) {
        console.warn(`no pairs: ${this.pairsController.value.length} pairs`);
      }
      return fallback;
    } else {
      if (DEBUG) {
        console.log(
          `in render level for 0th pair is ${this.pairsController.value[0].primary.level}`
        );
        console.log(
          `in render generalUseCase is ${stores.generalUseCase.get()}`
        );
      }

      if (stores.pairs.value) {
        this.table = this.tableController.table({
          columns: columns(),
          data: stores.pairs.value,
          manualSorting: false, //tanstack will handle sorting.
          enableSortingRemoval:
            false /*Set enableSortingRemoval to false if you want to ensure that at least one column is always sorted. */,
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
            columnVisibility: !stores.generalUseCase
              .get()
              .localeCompare(constants.BuffActivation.Enum.PvM)
              ? pvmVisibility
              : defaultVisibility,
          },
        });

        const { rows } = this.table.getRowModel();

        if (DEBUG) {
          console.log(
            `I have ${this.table.getAllFlatColumns().length} flat columns`
          );
        }

        return html`
          <div
            id="tableContainer"
            class="not-content tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
            ${ref(this.tableContainerRef)}
          >
            <table
              class="spectrum-Table spectrum-Table-main spectrum-Table--sizeM spectrum-Table--emphasized"
            >
              <thead class="not-content spectrum-Table-head">
                ${this.table.getHeaderGroups().map((headerGroup) => {
                  let currentstart = 0;
                  return html`
                    <tr key=${headerGroup.id}>
                      ${headerGroup.headers.map((header) => {
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
                          "is-sortable": header.column.getCanSort()
                            ? true
                            : false,
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
                        const thStyle = {
                          "grid-row": `${currentstart + 1} / ${header.colSpan}`,
                        };
                        currentstart += header.colSpan;
                        const ariaSort = header.column.getCanSort()
                          ? header.column.getNextSortingOrder() === "asc"
                            ? "other"
                            : header.column.getNextSortingOrder() === "desc"
                              ? "ascending"
                              : "descending"
                          : "none";
                        if (header.column.getIsVisible()) {
                          return html`
                            <th
                              key=${header.id}
                              colspan=${header.colSpan}
                              style="${styleMap(thStyle)}"
                              class="not-content spectrum-Table-headCell ${classMap(
                                thclasses
                              )}"
                              aria-sort=${ariaSort}
                              @click="${header.column.getToggleSortingHandler()}"
                            >
                              ${header.isPlaceholder
                                ? nothing
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
                        } else {
                          return html``;
                        }
                      })}
                    </tr>
                  `;
                })}
              </thead>
              <tbody class="spectrum-Table-body">
                ${repeat(
                  this.table.getRowModel().rows,
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
            .hasNextPage=${this.table.getCanNextPage()}
            .hasPreviousPage=${this.table.getCanPreviousPage()}
            .nextPage=${this.table.nextPage}
            .pageCount=${this.table.getPageCount()}
            .pageIndex=${this.table.getState().pagination.pageIndex}
            .pageSize=${this.table.getState().pagination.pageSize}
            .setPageSize="${this.table.setPageSize}"
            .previousPage=${this.table.previousPage}
            .firstPage=${this.table.firstPage}
            .lastPage=${this.table.lastPage}
          ></pagination-controller>
        `;
      } else {
        if (DEBUG) {
          console.log(`stores.pairs.value not valid, rendering fallback`);
        }
        return fallback;
      }
    }
  }
}
