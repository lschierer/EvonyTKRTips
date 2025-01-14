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
  type RowData,
  type TableOptionsResolved,
  createTable,
} from "@tanstack/table-core";

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
import { atom, subscribeKeys } from "nanostores";

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

import { DefaultColumns, PvPcolumns, PvMcolumns } from "./columns";
import { GeneralAscending } from "@schemas/ascending";

import { PaginationController } from "./generalTablePagination";
import { data } from "autoprefixer";
import defaultVisibility from "./visibility/default";
import pvmVisibility from "./visibility/pvm";
import attackingVisibility from "./visibility/attacking";

const DEBUG = true;

@customElement("table-element")
export default class TableElement extends withStores(LitElement, [
  stores.generalUseCase,
  stores.PvMPairsWithStats,
  stores.AttackingPairsWithStats,
  stores.pairs,
]) {
  private useCaseController = new StoreController(this, stores.generalUseCase);

  private tableController = new TableController<GeneralPair>(this);

  @state()
  private data: GeneralPair[] = new Array<GeneralPair>();

  @state()
  private _columns: ColumnDef<GeneralPair>[];

  private columnVisibility: Record<string, boolean>;

  @state()
  private _sorting: SortingState = [];

  constructor() {
    super();
    if (
      !this.useCaseController.value.localeCompare(
        constants.BuffActivation.Enum.PvM
      )
    ) {
      this.columnVisibility = pvmVisibility;
      (this._columns = PvMcolumns),
        stores.PvMPairsWithStats.subscribe((v, o) => {
          this.data = [...v];
          this.requestUpdate("data");
        });
    } else if (
      !this.useCaseController.value.localeCompare(
        constants.BuffActivation.Enum.Attacking
      )
    ) {
      this.columnVisibility = attackingVisibility;
      this._columns = PvPcolumns;
      stores.AttackingPairsWithStats.subscribe((v, o) => {
        this.data = [...v];
        this.requestUpdate();
      });
    } else {
      if (DEBUG) {
        console.warn(`use case at default: ${this.useCaseController.value}`);
      }
      this.columnVisibility = defaultVisibility;
      this._columns = DefaultColumns;
    }
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (DEBUG) {
      console.log(
        `_changedProperties has ${JSON.stringify(_changedProperties)}`
      );
    }
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
      console.log(
        `stores.pairs has ${stores.pairs.value ? stores.pairs.value.length : 0} pairs `
      );
      if (this.data.length > 0) {
        console.log(
          `data[0] has EvAns Attack of ${this.data[0].primary.id}/${this.data[0].secondary.id}: ${this.data[0].ScoreSet?.attack}`
        );
      }
    }

    if (!this.data || this.data.length == 0) {
      return html`
        <div
          id="tableContainer"
          class="not-content tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
        ></div>
      `;
    } else {
      const sortUndefined: "first" | "last" | false | -1 | 1 = "last";
      const options = {
        onStateChange: () => this.requestUpdate(),
        getSortedRowModel: getSortedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        renderFallbackValue: "pending data",
        defaultColumn: {
          enableHiding: true,
          enableSorting: true,
          invertSorting: false,
          sortDescFirst: false,
          sortUndefined,
        },
      };
      const resolvedOptions: TableOptionsResolved<GeneralPair> = {
        data: this.data,
        columns: this._columns,
        manualSorting: false, //tanstack will handle sorting.
        enableSortingRemoval:
          false /*Set enableSortingRemoval to false if you want to ensure that at least one column is always sorted. */,
        /* state has to be here or I get a typescript type error */
        /* the lit example from https://tanstack.com/table/latest/docs/framework/lit/examples/sorting suggests setting sorting here */
        state: {
          sorting: this._sorting,
        },
        initialState: {
          columnVisibility: this.columnVisibility,
        },
        ...options,
      };

      const table = this.tableController.table({
        data: this.data,
        columns: this._columns,
        manualSorting: false, //tanstack will handle sorting.
        enableSortingRemoval:
          false /*Set enableSortingRemoval to false if you want to ensure that at least one column is always sorted. */,

        initialState: {
          columnVisibility: this.columnVisibility,
        },
        ...options,
      });
      /*const table = createTable<GeneralPair>({
        ...resolvedOptions,
      });
      const state = atom(table.initialState);

      state.subscribe((currentState) => {
        table.setOptions((prev) => ({
          ...prev,
          ...options,
          state: {
            ...currentState,
            columnVisibility: this.columnVisibility,
          },
          // Similarly, we'll maintain both our internal state and any user-provided state
          onStateChange: (updater) => {
            if (typeof updater === "function") {
              const newState = updater(currentState);
              this._sorting = newState.sorting;
              state.set(newState);
            } else {
              state.set(updater);
            }
            options.onStateChange?.();
          },
        }));
      });*/
      /*const table = this.tableController.table({
        columns: getColumns(),
        data: this.data,

      });*/

      return html`
        <div
          id="tableContainer"
          class="not-content tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
        >
          <table
            class="spectrum-Table spectrum-Table-main spectrum-Table--sizeM spectrum-Table--emphasized"
          >
            <thead class="not-content spectrum-Table-head">
              ${table.getHeaderGroups().map((headerGroup) => {
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
              ${table.getRowModel().rows.map((row) => {
                return html`
                  <tr class="spectrum-Table-row">
                    ${row.getVisibleCells().map((cell) => {
                      return html`
                        <td class="spectrum-Table-cell">
                          ${flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      `;
                    })}
                  </tr>
                `;
              })}
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
    }
  }
}
