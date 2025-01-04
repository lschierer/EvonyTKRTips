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
} from "@tanstack/lit-table";

import {
  LitElement,
  html,
  css,
  type PropertyValues,
  type CSSResultGroup,
  unsafeCSS,
  type TemplateResult,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

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
import * as stores from "./store";

import { MountedPvMCompatiblePairMarchSize } from "./MarchSize";
import { SkillBook } from "@schemas/skillBooks";

import columns from "./columns";
import { GeneralAscending } from "@schemas/ascending";

const DEBUG = false;

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

  @state()
  private table: Table<GeneralPair> | null = null;

  private tableController = new TableController<GeneralPair>(this);
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

  static override styles?: CSSResultGroup | undefined = [
    unsafeCSS(SpectrumTableCSS),
    unsafeCSS(GeneralsCSS),
  ];

  protected tableHead(table: Table<GeneralPair>): TemplateResult {
    return html`
      <thead class="spectrum-Table-head">
        ${repeat(
          table.getHeaderGroups(),
          (headerGroup) => headerGroup.id,
          (headerGroup) => html`
            <tr>
              ${headerGroup.headers.map(
                (header) => html`
                  <th
                    colspan="${header.colSpan}"
                    class="spectrum-Table-headCell is-sortable"
                  >
                    ${header.isPlaceholder
                      ? null
                      : html` <div
                          title=${ifDefined(
                            header.column.getCanSort()
                              ? header.column.getNextSortingOrder() === "asc"
                                ? "Sort ascending"
                                : header.column.getNextSortingOrder() === "desc"
                                  ? "Sort descending"
                                  : "Clear sort"
                              : undefined
                          )}
                          @click="${header.column.getToggleSortingHandler()}"
                          style="cursor: ${header.column.getCanSort()
                            ? "pointer"
                            : "not-allowed"}"
                        >
                          ${flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          ${{ asc: " 🔼", desc: " 🔽" }[
                            header.column.getIsSorted() as string
                          ] ?? null}
                        </div>`}
                  </th>
                `
              )}
            </tr>
          `
        )}
      </thead>
    `;
  }

  protected tableBody(table: Table<GeneralPair>): TemplateResult {
    return html`
      <tbody class="spectrum-Table-body">
        ${table.getSortedRowModel().rows.map(
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
    `;
  }

  private index = 0;
  protected override render() {
    if (DEBUG) {
      console.log(`TableElement render start ${this.index++}`);
    }
    if (
      !Array.isArray(this.pairsController.value) ||
      this.pairsController.value.length == 0
    ) {
      return html`pending data`;
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
        });
        const state = { ...table.initialState, ...this._tableState };
        const oldOptions = table.options;
        const newOptions: TableOptions<GeneralPair> = {
          columns,
          data: stores.pairs.value,
          manualSorting: false,
          onSortingChange: oldOptions.onSortingChange,
          state: oldOptions.state,
          onStateChange: oldOptions.onStateChange,
          getSortedRowModel: oldOptions.getSortedRowModel,
          getCoreRowModel: oldOptions.getCoreRowModel,
        };
        //@ts-expect-error
        table.setOptions(newOptions);

        if (DEBUG) {
          console.log(
            `table has ${table.getRowModel().rows.length} rows in render`
          );
        }
        return html`
          <table
            class="spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized"
          >
            ${this.tableHead(table)} ${this.tableBody(table)}
          </table>
          ${DEBUG
            ? html`<pre>${JSON.stringify(this._sorting, null, 2)}</pre>`
            : ""}
        `;
      } else {
        return html`pending data`;
      }
    }
  }
}
