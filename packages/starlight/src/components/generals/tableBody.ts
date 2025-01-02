import { flexRender, type Table } from "@tanstack/lit-table";

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
import { ifDefined } from "lit/directives/if-defined.js";
import { type Ref, createRef, ref } from "lit/directives/ref.js";

import * as stores from "./store.ts";

export default function tableBody(t: LitElement): TemplateResult {
  const ts = stores.table.get();

  if (ts) {
    return html`
      <tbody class="spectrum-Table-body">
        ${ts.getSortedRowModel().rows.map(
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
  } else {
    return html`pending data`;
  }
}
