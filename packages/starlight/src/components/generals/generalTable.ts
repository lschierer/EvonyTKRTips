import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingFn,
  type SortingState,
  TableController,
  type TableOptions,
  createColumnHelper,
  type Row,
  type RowData,
} from "@tanstack/lit-table";

import {
  LitElement,
  html,
  css,
  type PropertyValues,
  type TemplateResult,
  render,
} from "lit";
import { repeat } from "lit/directives/repeat.js";
import { customElement, property, state } from "lit/decorators.js";
import { ref, createRef, type Ref } from "lit/directives/ref.js";
import { ifDefined } from "lit/directives/if-defined.js";

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
import { General, GeneralType, GeneralPair } from "@schemas/generals";
import { Buff } from "@schemas/buff";
import * as constants from "@schemas/constants";

import { type StoreValue, subscribeKeys } from "nanostores";

import * as stores from "./store";

import * as d3 from "d3";
import type { SkillBook } from "@schemas/skillBooks";

import { MountedPvMCompatiblePairMarchSize } from "./MarchSize";

const DEBUG = true;

const columnHelper = createColumnHelper<GeneralPair>();
const columns = [
  columnHelper.accessor("primary.id", {
    id: "primary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    header: () => html`<span class="tableHeader">Primary</span>`,
    cell: (props) => html`<span class="tableCell">${props.getValue()}</span>`,
  }),
  columnHelper.accessor("secondary.id", {
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    header: () => html`<span class="tableHeader">Secondary</span>`,
    cell: (info) => info.getValue(),
  }),
  {
    id: "marchsize",
    header: () => html`<span class="tableHeader">March Size Increase</span>`,
    accessorFn: (row: GeneralPair) => MountedPvMCompatiblePairMarchSize(row),
  },

  columnHelper.group({
    id: "mountedpvm",
    header: () => html`<span class="tableHeader">Mounted PVM</span>`,
    columns: [
      columnHelper.group({
        id: "mountedpvm.totals",
        columns: [
          {
            id: "mountedpvm.totals.attack",
            header: () => html`<span class="tableHeader">Attack Total</span>`,
          },
        ],
      }),
      columnHelper.group({
        id: "mountedpvm.details",
        columns: [
          columnHelper.group({
            id: "mountedpvm.attack",
            header: () => html`<span class="tableHeader">Attack Details</span>`,
            columns: [
              columnHelper.accessor("MountedPVM.attack.attributeTotal", {
                id: "mountedpvm.attack.attributeTotal",
                enableSorting: true,
                invertSorting: false,
                sortDescFirst: false,
                header: () =>
                  html`<span class="tableHeader">Attribute Total</span>`,
                cell: (info) =>
                  MountedPvMAttackAttributeTotalMutator(0, info.row.original) ??
                  0,
              }),
              columnHelper.accessor("MountedPVM.attack.baseSkill", {
                id: "mountedpvm.attack.baseSkill",
                enableSorting: true,
                invertSorting: false,
                sortDescFirst: false,
                header: () => html`<span class="tableHeader">Base Skill</span>`,
                cell: (info) =>
                  MountedPvMBaseSkillMutator(0, info.row.original) ?? 0,
              }),
            ],
          }),
        ],
      }),
    ],
  }),
];

@customElement("table-element")
export class TableElement extends LitElement {
  @property({ type: Array })
  public data: GeneralPair[] = new Array<GeneralPair>();

  @state()
  private _sorting: SortingState = [];

  private tableController = new TableController<GeneralPair>(this);
  private sortKey: string = "primary";
  private sortDirection: string = "asc";
  private tableRef: Ref = createRef();

  constructor() {
    super();
    stores.generals.subscribe((value, oldValue) => {
      this.data = definePairs();
      if (DEBUG) {
        console.log(
          `TableElement general stores listener oldValue: ${oldValue ? oldValue.length : 0}; value: ${value.length}`
        );
        console.log(
          `TableElement general stores listener data has ${this.data.length} pairs`
        );
      }
      this.requestUpdate("data");
    });
  }

  protected override willUpdate(_changedProperties: PropertyValues): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("data")) {
      if (DEBUG) {
        console.log(`sort: ${this.sortKey}, ${this.sortDirection}`);
      }

      if (DEBUG) {
        console.log(
          `TableElement willUpdate detects data: ${this.data.length} pairs `
        );
      }
    }
  }

  protected override firstUpdated(_changedProperties: PropertyValues): void {
    const table = this.tableRef.value;
    if (table) {
      if (DEBUG) {
        console.log(`TableElement firstUpdated has a table`);
      }
    }
  }

  private index = 0;
  protected override render() {
    if (DEBUG) {
      console.log(`TableElement render start ${this.index++}`);
    }
    const table = this.tableController.table({
      columns: columns,
      data: this.data,
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
    });
    if (DEBUG) {
      console.log(`table has ${table.getRowModel().rows.length} rows`);
    }
    return html`
      <table
        ${ref(this.tableRef)}
        class="spectrum-Table spectrum-Table--sizeM spectrum-Table--emphasized"
      >
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
                                  : header.column.getNextSortingOrder() ===
                                      "desc"
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
        <tbody class="spectrum-Table-body">
          ${table.getRowModel().rows.map(
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
      ${DEBUG ? html`<pre>${JSON.stringify(this._sorting, null, 2)}</pre>` : ""}
    `;
  }
}

export const definePairs = () => {
  const generals = stores.generals.get();
  const pairs = new Array<GeneralPair>();

  if (generals.length == 0) {
    return new Array<GeneralPair>();
  } else {
    const filtered = generals.filter((g) => {
      let match = false;
      const types = stores.selectedValues.get().type;
      g.type.forEach((t) => {
        if (types.includes(t)) {
          if (DEBUG) {
            console.log(`matched ${t} to ${types.join(" ")}`);
          }
          match = true;
        }
      });
      return match;
    });
    const permutations = d3.cross(filtered, filtered).filter((pair) => {
      return pair[0].id.localeCompare(pair[1].id);
    });
    if (DEBUG) {
      console.log(
        `identified ${permutations.length} pairs, some of which conflict.`
      );
    }
    permutations.map((pair) => {
      const td: GeneralPair = {
        primary: pair[0],
        secondary: pair[1],
      };
      const conflicts = new Set<string>();
      stores.conflictGroups.get().map((cg) => {
        if (cg.members.includes(td.primary.id)) {
          cg.members.map((m) => conflicts.add(m));
          cg.others &&
            cg.others.map((o) => {
              stores.conflictGroups.get().map((cg2) => {
                if (!o.localeCompare(cg2.name)) {
                  cg2.members.map((m) => conflicts.add(m));
                }
              });
            });
        }
      });
      if (DEBUG) {
        console.log(
          `${td.primary.id} conflicts with ${[...conflicts].join(" ")}`
        );
      }
      if (!conflicts.has(td.secondary.id)) {
        pairs.push(td);
      }
    });
  }
  pairs.sort((a, b) => {
    const ap = a.primary.id;
    const as = a.secondary.id;
    const bp = b.primary.id;
    const bs = b.secondary.id;
    if (!ap.localeCompare(bp)) {
      return as.localeCompare(bs);
    } else {
      return ap.localeCompare(bp);
    }
  });
  if (DEBUG) {
    /*const limiter = pairs[0].primary.id;
    return pairs.filter((predicate) => {
      return !predicate.primary.id.localeCompare(limiter);
    });*/
    return pairs.slice(0, 50);
  } else {
    return pairs;
  }
};

const overallToughness = "Overall Toughness";
const overallAttack = "Overall Attack";

let subscribed = false;

export const defineTable = () => {};

const getIncreaseFromBook = (
  attribute: constants.Attrbute,
  book: SkillBook,
  buffConditions: constants.BuffCondition[] = new Array<constants.BuffCondition>(),
  debuffConditions: constants.DebuffCondition[] = new Array<constants.DebuffCondition>()
) => {
  let increase = 0;
  if (Array.isArray(book.buff)) {
    if (DEBUG) {
      console.log(`buff for ${book.name} is an array`);
    }
    book.buff.map((buff: Buff) => {
      if (!buff.attribute.localeCompare(attribute)) {
        if (!buff.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
          if (buffConditions.length > 0 || debuffConditions.length > 0) {
            if (buff.condition) {
              let assumeTrue = true;
              buff.condition.map((bc) => {
                const valid = constants.BuffCondition.safeParse(bc);
                if (valid.success && !buffConditions.includes(valid.data)) {
                  assumeTrue = false;
                } else {
                  const v2 = constants.DebuffCondition.safeParse(bc);
                  if (
                    v2.success &&
                    debuffConditions.length > 0 &&
                    !debuffConditions.includes(v2.data)
                  ) {
                    assumeTrue = false;
                  }
                }
              });
              if (assumeTrue) {
                increase += buff.value.number;
              }
            } else {
              increase += buff.value.number;
            }
          } else {
            increase += buff.value.number;
          }
        }
      }
    });
  } else if (!book.buff.attribute.localeCompare(attribute)) {
    if (DEBUG) {
      console.log(`book ${book.name} has non-array buff`);
    }
    const buff = book.buff;
    if (!buff.value.unit.localeCompare(constants.Unit.Enum.percentage)) {
      if (buffConditions.length > 0 || debuffConditions.length > 0) {
        if (buff.condition) {
          let assumeTrue = true;
          buff.condition.map((bc) => {
            const valid = constants.BuffCondition.safeParse(bc);
            if (valid.success && !buffConditions.includes(valid.data)) {
              assumeTrue = false;
            } else {
              const v2 = constants.DebuffCondition.safeParse(bc);
              if (
                v2.success &&
                debuffConditions.length > 0 &&
                !debuffConditions.includes(v2.data)
              ) {
                assumeTrue = false;
              }
            }
          });
          if (assumeTrue) {
            increase += buff.value.number;
          }
        } else {
          increase += buff.value.number;
        }
      } else {
        increase += buff.value.number;
      }
    }
  }
  return increase;
};
