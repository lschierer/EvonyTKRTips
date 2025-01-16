import {
  css,
  type CSSResultGroup,
  html,
  LitElement,
  nothing,
  type PropertyValues,
  unsafeCSS,
  type TemplateResult,
} from "lit";
import { ref, type Ref, createRef } from "lit/directives/ref.js";
import { customElement, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";

import { StoreController, withStores } from "@nanostores/lit";
import { atom } from "nanostores";

import {
  virtualize,
  virtualizerRef,
} from "@lit-labs/virtualizer/virtualize.js";
import { LitVirtualizer } from "@lit-labs/virtualizer";

import "@spectrum-web-components/table/elements.js";
import { Table } from "@spectrum-web-components/table/src/Table.js";

import SpectrumTableCSS from "@spectrum-css/table/dist/index.css?inline";
import GeneralsCSS from "@styles/generals.css?inline";
import PairTableCSS from "@styles/PairTable.css?inline";

import * as constants from "@schemas/constants";
import { GeneralPair } from "@schemas/generals";
import * as stores from "./store";

import {
  type ColumnDef,
  DefaultColumns,
  PvMcolumns,
  //PvPcolumns,
} from "./columns";

import attackingVisibility from "./visibility/attacking";
import defaultVisibility from "./visibility/default";
import pvmVisibility from "./visibility/pvm";
import { ifDefined } from "lit/directives/if-defined.js";

const DEBUG = true;

@customElement("table-element")
export default class TableElement extends withStores(LitElement, [
  stores.generalUseCase,
  stores.PvMPairsWithStats,
  stores.AttackingPairsWithStats,
  stores.pairs,
]) {
  private useCaseController = new StoreController(this, stores.generalUseCase);

  @state()
  protected data: GeneralPair[] = new Array<GeneralPair>();

  private _columns: ColumnDef[];

  private columnVisibility: Record<string, boolean>;

  protected _number_of_columns: number = 0;

  protected headerRows: TemplateResult[] = new Array<TemplateResult>();

  protected tableRef: Ref<Table> = createRef<Table>();

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
          if (DEBUG) {
            console.log(
              `PvMPairsWithStats subscribe from TableElement constructor`
            );
          }
          this.data.length = 0;
          this.data = [...v];
          if (this.tableRef.value) {
            this.initTable();
          }
        });
    } else {
      if (DEBUG) {
        console.warn(`use case at default: ${this.useCaseController.value}`);
      }
      this.columnVisibility = defaultVisibility;
      this._columns = DefaultColumns;
    }
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.initTable();
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("data")) {
      if (DEBUG) {
        console.log(`change to data detected by willUpdate`);
      }
      if (this.tableRef.value) {
        this.initTable();
      } else {
        if (DEBUG) {
          console.log(`willupdate sees invalid tableref value`);
        }
      }
    }
  }

  static override styles?: CSSResultGroup = [
    unsafeCSS(SpectrumTableCSS),
    unsafeCSS(GeneralsCSS),
    unsafeCSS(PairTableCSS),
    css``,
  ];

  protected cellRender = (colDef: ColumnDef, row: GeneralPair) => {
    if (Object.keys(colDef).includes("cell")) {
      const key = "cell";
      //@ts-expect-error
      return colDef[key as keyof typeof colDef](row);
    } else if (Object.keys(colDef).includes("accessorKey")) {
      const key = "accessorKey";
      const keys = colDef[key as keyof typeof colDef].split(".");
      let value: any = null;
      for (const k of keys) {
        if (Object.keys(row).includes(k)) {
          value = row[k as keyof typeof row];
        } else {
          console.warn(`key ${k} is not a valid key.`);
        }
      }
      return value;
    } else {
      const keys = colDef.id.split(".");
      let value: any = null;
      for (const k of keys) {
        if (Object.keys(row).includes(k)) {
          value = row[k as keyof typeof row];
        } else {
          console.warn(`key ${k} is not a valid key.`);
        }
      }
      return value;
    }
  };

  protected headerRender = (
    columns: ColumnDef[],
    iteration = 0,
    colstart = 0
  ) => {
    let header = html``;
    let nextRow = html``;

    columns.map((c, index) => {
      if (colstart == 0) {
        colstart++;
      }
      if (Object.keys(c).includes("columns")) {
        const headerStyle = {
          "grid-column": `${colstart} / ${c["columns" as keyof typeof c].length + colstart}`,
        };
        if (Object.keys(c).includes("header")) {
          header = html`${header}
            <sp-table-head-cell>
              ${
                //@ts-expect-error
                c["header" as keyof typeof c]()
              }
            </sp-table-head-cell> `;
        } else {
          header = html`${header}
            <sp-table-head-cell> ${c.id} </sp-table-head-cell> `;
        }

        //@ts-expect-error
        const columns = c["columns" as keyof typeof c] as ColumnDef[];
        this.headerRender(columns, iteration + 1, colstart);
        colstart += c["columns" as keyof typeof c].length;
      } else {
        this._number_of_columns++;

        if (DEBUG) {
          console.log(
            `after incrementing, I have ${this._number_of_columns} columns`
          );
        }
        const headerStyle = {
          "grid-column": `${colstart} / ${++colstart}`,
        };
        if (Object.keys(c).includes("header")) {
          header = html`${header}
            <sp-table-head-cell>
              ${
                //@ts-expect-error
                c["header" as keyof typeof c]()
              }
            </sp-table-head-cell> `;
        } else {
          header = html`${header}
            <sp-table-head-cell> ${c.id} </sp-table-head-cell> `;
        }
      }
    });
    this.headerRows[iteration] = html`
      ${this.headerRows[iteration]} ${header}
    `;
  };

  private index = 0;
  protected override render() {
    if (DEBUG) {
      console.log(`TableElement render start ${this.index++}`);

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
      this._number_of_columns = 0;
      this.headerRender(this._columns);
      const tableStyle = {
        "grid-template-columns": `10rem 10rem repeat(${this._number_of_columns - 2}, 5rem)`,
      };

      return html`
        <div
          id="tableContainer"
          class="not-content tableContainer spectrum-Table--sizeM spectrum-Table--empasized"
        >
          <sp-table scroller?="true" ${ref(this.tableRef)}>
            <sp-table-head>
              ${this.headerRows.map((hr) => html` ${hr}`)}
            </sp-table-head>
          </sp-table>
        </div>
      `;
    }
  }

  protected initTable = () => {
    if (DEBUG) {
      console.log(`initTable fired`);
    }
    const table = this.tableRef.value;
    if (table) {
      table.items = this.data.map((datum) => {
        const key = `${datum.primary.id}/${datum.secondary.id}`;
        const i: TableItem = {
          [key]: datum,
        };
        return i;
      });

      table.renderItem = (item, index) => {
        const gp = Object.values(item)[0] as GeneralPair;
        const cells = new Array<TemplateResult>();
        for (const column of this._columns) {
          const v = this.cellRender(column, gp);
          cells.push(html` <sp-table-cell> ${v} </sp-table-cell> `);
        }
        return html` ${cells} `;
      };
    }
  };
}

type TableItem = Record<string, GeneralPair>;
