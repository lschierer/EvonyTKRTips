import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingFn,
  type SortingState,
  TableController,
  createColumnHelper,
  type Table,
} from "@tanstack/lit-table";

import {
  LitElement,
  html,
  css,
  type PropertyValues,
  type CSSResultGroup,
  unsafeCSS,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { type Ref, createRef, ref } from "lit/directives/ref.js";

import { StoreController } from "@nanostores/lit";

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

import { General, GeneralPair } from "@schemas/generals";
import * as stores from "./store";

import { MountedPvMCompatiblePairMarchSize } from "./MarchSize";
import { SkillBook } from "@schemas/skillBooks";

import tableHead from "./tableHead";
import tableBody from "./tableBody";

const DEBUG = true;

const columnHelper = createColumnHelper<GeneralPair>();
const columns = [
  columnHelper.accessor("primary.id", {
    id: "primary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    header: () => html`<span class="tableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("secondary.id", {
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    header: () => html`<span class="tableHeader">Secondary</span>`,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("primary.level", {
    id: "level",
    header: () => html`<span class="tableHeader">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
];
/*
columnHelper.accessor("primary.level", {
  id: "level",
  header: () => html`<span class="tableHeader">Level</span>`,
  cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
}),
{
  id: "marchsize",
  header: () => html`<span class="tableHeader">March Size Increase</span>`,
  accessorFn: (row: GeneralPair) => MountedPvMCompatiblePairMarchSize(row),
},
*/
@customElement("table-element")
export default class TableElement extends LitElement {
  @property({ type: Array })
  public generals = new Array<General>();

  @property({ type: Array })
  public skillbooks = new Array<SkillBook>();

  private pairsController = new StoreController(this, stores.pairs);

  private generalsController = new StoreController(this, stores.generals);

  private tableStoreController = new StoreController(this, stores.table);

  @state()
  private _sorting: SortingState = [];

  @state()
  private table: Table<GeneralPair> | null = null;

  private tableController = new TableController<GeneralPair>(this);
  private sortKey: string = "primary";
  private sortDirection: string = "asc";

  constructor() {
    super();
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
    if (_changedProperties.has("skillbooks")) {
      if (Array.isArray(this.skillbooks)) {
        stores.skillBooks.set(this.skillbooks);
      } else {
        if (DEBUG) {
          console.warn(
            `this.skillBooks was not an array, it is '${this.skillBooks}'`
          );
        }
      }
    }
  }

  static override styles?: CSSResultGroup | undefined = [
    unsafeCSS(SpectrumTableCSS),
    unsafeCSS(GeneralsCSS),
  ];

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

      stores.table.set(
        this.tableController.table({
          columns,
          data: DEBUG
            ? this.pairsController.value.slice(0, 50)
            : this.pairsController.value,
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
          getSortedRowModel: getSortedRowModel<GeneralPair>(),
          getCoreRowModel: getCoreRowModel<GeneralPair>(),
        })
      );
      if (DEBUG && this.tableStoreController.value) {
        console.log(
          `table has ${this.tableStoreController.value.getRowModel().rows.length} rows in render`
        );
      }
      if (this.tableStoreController.value) {
        return html`
          <table
            class="spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized"
          >
            ${tableHead()} ${tableBody()}
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
