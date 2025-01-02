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
import { type Ref, createRef, ref } from "lit/directives/ref.js";

import { flexRender, type Table } from "@tanstack/lit-table";

import { StoreController } from "@nanostores/lit";

import * as stores from "./store.ts";

export default function tableHead(): TemplateResult {
  const ts = stores.table.get();
  if (ts) {
    return html`
      <thead class="spectrum-Table-head">
        ${repeat(
          ts.getHeaderGroups(),
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
  } else {
    return html``;
  }
}
