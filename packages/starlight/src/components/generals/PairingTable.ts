import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  unsafeCSS,
  type TemplateResult,
  type CSSResultArray,
} from "lit";
import { ref, type Ref, createRef } from "lit/directives/ref.js";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import {
  type ColumnDef,
  createTable,
  type Header,
  type Row,
  type RowData,
  type RowModel,
  type Table as tanstackTable,
  type TableOptions,
  type TableOptionsResolved,
  type TableState,
} from "@tanstack/table-core";

import { StoreController, withStores } from "@nanostores/lit";
import { atom, computed } from "nanostores";

import "@spectrum-web-components/table/elements.js";
import { SpectrumElement } from "@spectrum-web-components/base";
import { Table } from "@spectrum-web-components/table";

import SpectrumTableCSS from "@spectrum-css/table/dist/index.css?inline";
import GeneralsCSS from "@styles/generals.css?inline";
import PairTableCSS from "@styles/PairTable.css?inline";

import { DefaultColumns, PvMcolumns, PvPcolumns } from "./columns";
import attackingVisibility from "./visibility/attacking";
import defaultVisibility from "./visibility/default";
import pvmVisibility from "./visibility/pvm";

import * as stores from "./store";
import tableStore from "./backendTable";
import { GeneralPair } from "@schemas/generals";

import * as constants from "@schemas/constants";

const DEBUG = true;

@customElement("pairing-table")
export default class PairingTable extends withStores(LitElement, [
  stores.generalUseCase,
  stores.PvMPairsWithStats,
  stores.AttackingPairsWithStats,
  stores.pairs,
  tableStore,
]) {
  @state()
  protected _columns: ColumnDef<GeneralPair>[] = new Array<
    ColumnDef<GeneralPair>
  >();

  @state()
  protected tanstackData: GeneralPair[] = new Array<GeneralPair>();

  protected tableRef: Ref<Table> = createRef<Table>();
  constructor() {
    super();

    tableStore.subscribe((currentValue) => {
      if (DEBUG) {
        console.log(`tableStore Subscribe`);
      }
      if (this.table) {
        this.spTable(this.table);
        this.requestUpdate();
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

  protected flexRender = <TProps extends object>(comp: any, props: TProps) => {
    if (typeof comp === "function") {
      return comp(props);
    }
    return comp;
  };

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
      if (Array.isArray(rows)) {
        (tableElement as Table).items = rows.map((row) => {
          return {
            [row.id]: row,
          } as Record<string, Row<GeneralPair>>;
        });
      }

      (tableElement as Table).renderItem = (item, index) => {
        const row = Object.values(item)[0] as Row<GeneralPair>;
        return html`${row.getVisibleCells().map((cell) => {
          return html`
            <sp-table-cell>
              ${this.flexRender(cell.column.columnDef.cell, cell.getContext())}
            </sp-table-cell>
          `;
        })}`;
      };
    }
  };

  protected table: tanstackTable<GeneralPair> | null = null;
  protected override render(): TemplateResult {
    if (this.table == undefined || this.table == null) {
      this.table = useTable<GeneralPair>(tableStore.get());
    }
    if (this.table == null) {
      console.error(`table is still null even after useTable`);
      return html``;
    } else {
      const headStyle = {
        "grid-template-columns": `repeat(${
          this.table.getLeafHeaders().filter((h) => h.id.startsWith("center_"))
            .length
        }, 1fr)`,
      };

      return html`
        <sp-table
          scroller
          quiet
          emphasized
          density="compact"
          ${ref(this.tableRef)}
        >
          <sp-table-head style="">
            ${this.table
              .getLeafHeaders()
              .filter((h) => !h.id.startsWith("center_"))
              .map((header) => {
                return html`
                  <sp-table-head-cell>
                    ${this.flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </sp-table-head-cell>
                `;
              })}
          </sp-table-head>
        </sp-table>
      `;
    }
  }
}
/*
${tableStore
  .get()
  .getLeafHeaders()
  .filter((h) => !h.id.startsWith("center_"))
  .map((header) => {
    return html`
      <sp-table-head-cell>
        ${this.flexRender(
          header.column.columnDef.header,
          header.getContext()
        )}
      </sp-table-head-cell>
    `;
  })}
*/

const useTable = <TData extends RowData>(options: TableOptions<TData>) => {
  // Compose in the generic options to the user options
  const resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    renderFallbackValue: null,
    ...options,
  };

  // Create a new table
  const table = createTable<TData>(resolvedOptions);

  // By default, manage table state here using the table's initial state
  const state = atom(table.initialState);

  // Subscribe to state changes
  state.subscribe((currentState) => {
    table.setOptions((prev) => ({
      ...prev,
      ...options,
      state: {
        ...currentState,
        ...options.state,
      },
      // Similarly, we'll maintain both our internal state and any user-provided state
      onStateChange: (updater) => {
        if (typeof updater === "function") {
          const newState = updater(currentState);
          state.set(newState);
        } else {
          state.set(updater);
        }
        options.onStateChange?.(updater);
      },
    }));
  });

  return table;
};
