import {
  LitElement,
  html,
  css,
  nothing,
  type CSSResultArray,
  type PropertyValues,
} from "lit";
import { customElement } from "lit/decorators.js";

import {
  flexRender,
  TableController,
  type ColumnDef,
  type TableOptions,
  getCoreRowModel,
  getSortedRowModel,
  createColumnHelper,
} from "@tanstack/lit-table";

import { SignalWatcher } from "@lit-labs/signals";

import SpectrumCSSTable from "@spectrum-css/table/index.css" with { type: "css" };

import { type General } from "../../../schemas/generals.ts";

import { generalsCollection } from "../../../lib/state/toolsState.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction(new URL(import.meta.url).pathname);

@customElement("general-stats")
export default class GeneralStats extends SignalWatcher(LitElement) {
  private tableController = new TableController<General>(this);

  static columnHelper = createColumnHelper<General>();
  private columns: ColumnDef<General, number | string>[] = [
    GeneralStats.columnHelper.group({
      header: "March Size Increase",
      columns: [],
    }),
  ];

  static override get styles() {
    return [SpectrumCSSTable, css``] as CSSResultArray;
  }

  /* eslint-disable  @typescript-eslint/no-misused-promises */
  protected override async firstUpdated(
    _changedProperties: PropertyValues
  ): Promise<void> {
    super.firstUpdated(_changedProperties);
    if (!generalsCollection.generals.length) {
      await generalsCollection.initialize();
    }
  }

  protected override render() {
    if (DEBUG) {
      console.log(`GeneralStats render start`);
    }
    const options: TableOptions<General> = {
      data: [],
      columns: this.columns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
    };
    const table = this.tableController.table(options);
    return html`
      <tbody>
        ${table
          .getRowModel()
          .rows.slice(0, 10)
          .map(
            (row) => html`
              <tr>
                ${row
                  .getVisibleCells()
                  .map(
                    (cell) => html`
                      <td>
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
}
