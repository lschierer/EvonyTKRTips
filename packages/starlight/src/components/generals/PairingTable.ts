import {
  type CSSResultGroup,
  html,
  LitElement,
  type PropertyValues,
  unsafeCSS,
  type TemplateResult,
} from "lit";
import { ref, type Ref, createRef } from "lit/directives/ref.js";
import { customElement, state } from "lit/decorators.js";

import {
  type ColumnDef,
  type Row,
  type SortingState,
  type Table as tanstackTable,
  TableController,
  flexRender,
} from "@tanstack/lit-table";

import { withStores } from "@nanostores/lit";

import "@spectrum-web-components/table/elements.js";
import { type Table } from "@spectrum-web-components/table";

import SpectrumTableCSS from "@spectrum-css/table/dist/index.css?inline";
import GeneralsCSS from "@styles/generals.css?inline";
import PairTableCSS from "@styles/PairTable.css?inline";

import { PvMcolumns, PvPcolumns } from "./columns";

import * as stores from "./store";
import tableStore from "./backendTable";
import { sortingStore } from "./backendTable";
import { type GeneralPair } from "@schemas/generals";

import * as constants from "@schemas/constants";

import debugFunction from "@lib/debug";
const DEBUG = debugFunction("components/generals/PairingTable.ts");

@customElement("pairing-table")
export default class PairingTable extends withStores(LitElement, [
  stores.generalUseCase,
  stores.PvMPairsWithStats,
  stores.AttackingPairsWithStats,
  stores.pairs,
  tableStore,
  sortingStore,
]) {
  @state()
  protected _columns: ColumnDef<GeneralPair>[] = new Array<
    ColumnDef<GeneralPair>
  >();

  @state()
  protected tanstackData: GeneralPair[] = new Array<GeneralPair>();

  protected tableRef: Ref<Table> = createRef<Table>();

  @state()
  private tableController = new TableController<GeneralPair>(this);

  constructor() {
    super();

    sortingStore.subscribe((v) => {
      if (DEBUG) {
        console.log(
          `Table sees sorting store change.  new value is ${JSON.stringify(v)}`
        );
      }
    });

    tableStore.subscribe((currentValue) => {
      if (DEBUG) {
        console.log(`tableStore Subscribe`);
      }
      if (this.table) {
        const options = this.table.options;
        if (DEBUG) {
          console.log(
            `tableStore change, options are: `,
            JSON.stringify(options),
            ` current value should be: `,
            JSON.stringify(currentValue)
          );
        }
        this.table.setOptions({
          ...options,
          ...currentValue,
          data: this.tanstackData,
        });
        this.spTable(this.table);
      } else {
        console.error(`tableStore subscribe has no table to update`);
      }
    });
    stores.generalUseCase.subscribe((currentValue) => {
      if (!currentValue.localeCompare(constants.BuffActivation.Enum.PvM)) {
        stores.PvMPairsWithStats.subscribe((PvMPairs) => {
          if (DEBUG) {
            console.log(
              `PvMPairsWithStats from generalUseCase from PairingTable constructor`
            );
            console.log(`${PvMPairs.length} pairs present`);
          }
          this.tanstackData.length = 0;
          this.tanstackData = [...PvMPairs];
          this._columns = PvMcolumns;
          if (DEBUG) {
            console.log(
              `first row: `,
              `${this.tanstackData[0].primary.id}/${this.tanstackData[0].secondary.id}`,
              `${this.tanstackData[0].MarchSizeIncrease?.total} ${this.tanstackData[0].BuffSet?.attack.total}`
            );
          }
        });
      } else if (
        !currentValue.localeCompare(constants.BuffActivation.Enum.Attacking)
      ) {
        stores.AttackingPairsWithStats.subscribe((PvPPairs) => {
          if (DEBUG) {
            console.log(
              `AttackingPairsWithStats from generalUseCase from PairingTable constructor`
            );
            console.log(`${PvPPairs.length} pairs present`);
          }
          this.tanstackData.length = 0;
          this.tanstackData = [...PvPPairs];
          this._columns = PvPcolumns;
        });
      }
    });
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    if (this.table) {
      this.spTable(this.table);
    } else {
      if (DEBUG) {
        console.error(`no table present in first Updated`);
      }
    }
  }

  static override get styles(): CSSResultGroup {
    return [
      unsafeCSS(SpectrumTableCSS),
      unsafeCSS(GeneralsCSS),
      unsafeCSS(PairTableCSS),
    ];
  }

  protected spTable = (table: tanstackTable<GeneralPair>) => {
    if (DEBUG) {
      console.log(`spTable callback`);
    }
    const tableElement = this.tableRef.value;
    if (tableElement) {
      if (DEBUG) {
        console.log(`spTable callback sees table`);
      }
      const rows = table.getRowModel().rows;
      if (DEBUG) {
        console.log(`spTable callback has ${rows.length} rows`);
        console.log(
          `sptable callback first row`,
          `${rows[0].original.primary.id}/${rows[0].original.secondary.id}`,
          `${rows[0].original.MarchSizeIncrease?.total}`,
          `${rows[0].original.BuffSet?.attack.total}`
        );
      }
      if (Array.isArray(rows)) {
        tableElement.items = rows.map((row) => {
          return {
            [row.id]: row,
          } as Record<string, Row<GeneralPair>>;
        });
      }

      tableElement.renderItem = (item) => {
        const row = Object.values(item)[0] as Row<GeneralPair>;
        return html`${row.getVisibleCells().map((cell) => {
          return html`
            <sp-table-cell>
              ${flexRender(cell.column.columnDef.cell, cell.getContext())}
            </sp-table-cell>
          `;
        })}`;
      };

      tableElement.addEventListener("sorted", (event) => {
        /* eslint-disable @typescript-eslint/no-unsafe-assignment */
        const { sortDirection, sortKey } = (event as CustomEvent).detail;
        console.log(`table sorted event has sortKey ${sortKey}`);
        if (this.table) {
          const sorting = this.table.getState().sorting;
          if (DEBUG) {
            console.log(
              `sorting event handler shows current state ${JSON.stringify(sorting)}`
            );
          }
          const newSorting: SortingState = [
            {
              id: sortKey,
              desc: !(sortDirection as string).localeCompare("desc"),
            },
          ];
          sortingStore.set(newSorting);
        }
      });
    }
  };

  protected table: tanstackTable<GeneralPair> | null = null;
  protected override render(): TemplateResult {
    this.table = this.tableController.table(tableStore.get());

    return html`
      <table-sorting></table-sorting>
      <sp-table scroller quiet density="compact" ${ref(this.tableRef)}>
        <sp-table-head style="">
          ${this.table
            .getLeafHeaders()
            .filter((h) => !h.id.startsWith("center_"))
            .map((header) => {
              const sortDirection =
                header.column.getNextSortingOrder() === "asc"
                  ? "asc"
                  : header.column.getNextSortingOrder() === "desc"
                    ? "desc"
                    : false;
              return html`
                <sp-table-head-cell
                  sort-direction=${sortDirection}
                  sort-key=${header.id}
                >
                  ${flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}${header.column.getCanSort()
                    ? sortDirection
                      ? !sortDirection.localeCompare("asc")
                        ? html`<iconify-icon
                            icon="ion:chevron-down"
                            width="1rem"
                            height="1rem"
                          ></iconify-icon>`
                        : html`<iconify-icon
                            icon="ion:chevron-up"
                            width="1rem"
                            height="1rem"
                          ></iconify-icon>`
                      : ""
                    : ""}
                </sp-table-head-cell>
              `;
            })}
        </sp-table-head>
      </sp-table>
    `;
  }
}
