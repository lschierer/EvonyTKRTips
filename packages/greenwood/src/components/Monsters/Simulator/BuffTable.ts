import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  TableController,
} from "@tanstack/lit-table";

import { LitElement, html, css, type CSSResultGroup, nothing } from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

import { SignalWatcher } from "@lit-labs/signals";

import { z } from "zod";

import { Constants } from "@evonytkrtips/schemas";

import SpectrumCSSTable from "@spectrum-css/table/index.css" with { type: "css" };
import SpectrumCSStextfield from "@spectrum-css/textfield/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/index.css" with { type: "css" };
import SpectrumCSSinfieldbutton from "@spectrum-css/infieldbutton/index.css" with { type: "css" };

import "iconify-icon";

import simulatorState from "./state.ts";

import { type BuffTableRow } from "./state.ts";

import debugFunction from "../../../lib/debug.ts";
const DEBUG = debugFunction("components/Monsters/Simulator/BuffTable.ts");

@customElement("buff-table")
export default class BuffTable extends SignalWatcher(LitElement) {
  private BuffController = new TableController<BuffTableRow>(this);

  @state()
  private _data;

  private BuffColumns: ColumnDef<BuffTableRow>[] = [
    {
      id: "pivot",
      columns: [
        {
          id: "one",

          cell: (props) => {
            return props.row.index == 0
              ? html`Buff`
              : props.row.index == 6
                ? html`Debuff`
                : props.row.index == 7
                  ? html`Total March`
                  : props.row.index == 8
                    ? html`Total Rally`
                    : nothing;
          },
        },
        {
          id: "two",
          cell: (props) => {
            return this.getRowTwoValue(props.row.index);
          },
        },
        {
          id: "three",
          cell: (props) => {
            return props.row.index == 5 ? "#" : "%";
          },
        },
      ],
    },
    {
      id: "Ground",
      header: "Ground",
      columns: [
        {
          accessorKey: "ground.attack",
          header: "Attack",

          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "ground.defense",
          header: "Defense",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "ground.hp",
          header: "HP",
          cell: (props) => this.renderBuffTableCell(props),
        },
      ],
    },
    {
      id: "Archer",
      header: "Archer",
      accessorKey: "archer",
      columns: [
        {
          accessorKey: "archer.attack",
          header: "Attack",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "archer.defense",
          header: "Defense",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "archer.hp",
          header: "HP",
          cell: (props) => this.renderBuffTableCell(props),
        },
      ],
    },
    {
      id: "Mounted",
      header: "Mounted",
      accessorKey: "mounted",
      columns: [
        {
          accessorKey: "mounted.attack",
          header: "Attack",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "mounted.defense",
          header: "Defense",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "mounted.hp",
          header: "HP",
          cell: (props) => this.renderBuffTableCell(props),
        },
      ],
    },
    {
      id: "Siege",
      header: "Siege",
      accessorKey: "siege",
      columns: [
        {
          header: "Attack",
          accessorKey: "siege.attack",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "siege.defense",
          header: "Defense",
          cell: (props) => this.renderBuffTableCell(props),
        },
        {
          accessorKey: "siege.hp",
          header: "HP",
          cell: (props) => this.renderBuffTableCell(props),
        },
      ],
    },
  ];

  private getRowTwoValue = (index: number) => {
    if (index == 0) {
      return "Basic";
    } else if (index == 1) {
      return "March";
    } else if (index == 2) {
      return "Monster";
    } else if (index == 3) {
      return "Misc";
    } else if (index == 4) {
      return "Rally";
    } else if (index == 5) {
      return "Flat";
    } else if (index == 6) {
      return "Troop";
    } else {
      return nothing;
    }
  };

  constructor() {
    super();
    this._data = simulatorState.getAsTableData.get();
  }

  private renderBuffTableCell = (props: CellContext<BuffTableRow, unknown>) => {
    if (props.row.index <= 6) {
      const cellValue = props.getValue() as number;

      return html`
        <div
          class=" spectrum-Stepper spectrum-Stepper--sizeM "
          id="stepper-vpbqf"
          style="--mod-actionbutton-icon-size:10px;"
        >
          <div
            class="spectrum-Textfield spectrum-Textfield--sizeM spectrum-Stepper-textfield"
            style=""
            id="stepper-vpbqf-input"
          >
            <input
              type="number"
              id="${props.column.id}-${props.row.id}"
              class=" spectrum-Textfield-input spectrum-Stepper-input "
              min="0"
              @change="${(e: Event) => {
                const target = (e as CustomEvent)
                  .target as HTMLInputElement | null;
                if (target) {
                  const valid = z.number().min(0).safeParse(+target.value);
                  if (valid.success) {
                    const key1 = props.column.id.split("_").shift() ?? "";
                    const key2 = props.column.id.split("_").pop();
                    const key3 = key1.localeCompare("ground")
                      ? key1.localeCompare("mounted")
                        ? key1.localeCompare("archer")
                          ? key1.localeCompare("siege")
                            ? Constants.ClassEnum.Enum.All
                            : Constants.ClassEnum.Enum["Siege Machines"]
                          : Constants.ClassEnum.Enum["Ranged Troops"]
                        : Constants.ClassEnum.Enum["Mounted Troops"]
                      : Constants.ClassEnum.Enum["Ground Troops"];
                    if (
                      key3.localeCompare(Constants.ClassEnum.Enum.All) &&
                      key2 != undefined
                    ) {
                      if (DEBUG) {
                        console.log(
                          `key1 is ${key1}`,
                          `key2 is ${key2}`,
                          `index is ${props.row.index}`
                        );
                      }

                      if (!key2.toLowerCase().localeCompare("attack")) {
                        simulatorState.setAttackBuff(
                          key3,
                          props.row.index,
                          valid.data
                        );
                      }
                      if (!key2.toLowerCase().localeCompare("defense")) {
                        simulatorState.setDefenseBuff(
                          key3,
                          props.row.index,
                          valid.data
                        );
                      }
                      if (!key2.toLowerCase().localeCompare("hp")) {
                        simulatorState.setHPBuff(
                          key3,
                          props.row.index,
                          valid.data
                        );
                      }
                      this.requestUpdate("BuffData");
                    }
                  } else {
                    console.error(`error parsing, ${valid.error.message}`);
                  }
                }
              }}"
              ?disabled=${props.row.index >= 7 ||
              (props.row.index == 6 &&
                props.column.id.toLowerCase().endsWith("hp"))}
              value="${props.row.index == 6 &&
              props.column.id.toLowerCase().endsWith("hp")
                ? ""
                : cellValue}"
            />
          </div>
          <span class="spectrum-Stepper-buttons">
            <button
              aria-haspopup="listbox"
              type="button"
              class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--top spectrum-Stepper-button "
              tabindex="-1"
              ?disabled=${props.row.index >= 7 ||
              (props.row.index == 6 &&
                props.column.id.toLowerCase().endsWith("hp"))}
            >
              <div class="spectrum-InfieldButton-fill">
                <iconify-icon
                  icon="ion:chevron-up"
                  width="1rem"
                  focusable="false"
                  aria-hidden="true"
                  role="img"
                  class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                ></iconify-icon>
              </div>
            </button>
            <button
              aria-haspopup="listbox"
              type="button"
              class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--bottom spectrum-Stepper-button "
              tabindex="-1"
              ?disabled=${props.row.index >= 7 ||
              (props.row.index == 6 &&
                props.column.id.toLowerCase().endsWith("hp"))}
            >
              <div class="spectrum-InfieldButton-fill">
                <iconify-icon
                  icon="ion:chevron-down"
                  width="1rem"
                  focusable="false"
                  aria-hidden="true"
                  role="img"
                  class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                ></iconify-icon>
              </div>
            </button>
          </span>
        </div>
      `;
    } else {
      let sum = 0;
      if (props.row.index == 7) {
        sum = props.table.getRowModel().rows.reduce((a: number, c) => {
          if (c.index <= 3) {
            if (props.column.accessorFn) {
              const v = props.column.accessorFn(c.original, c.index) as number;
              a = a + v;
            } else {
              a = a;
            }
          } else {
            a = a;
          }
          return a;
        }, 0);
      } else if (props.row.index == 8) {
        sum = props.table.getRowModel().rows.reduce((a: number, c) => {
          if (c.index <= 4) {
            if (props.column.accessorFn) {
              const v = props.column.accessorFn(c.original, c.index) as number;
              a = a + v;
            } else {
              a = a;
            }
          } else {
            a = a;
          }
          return a;
        }, 0);
      }

      return html`
        <div class="aggregate">
          <span>${sum}</span>
        </div>
      `;
    }
  };

  private printResults = () => {
    return html`
      <div class="PlayerBuffResults">
        <table
          id="PlayerBuffResults"
          class=" spectrum-Table spectrum-Table--sizeM spectrum-Table--compact spectrum-Table--quiet spectrum-Table--emphasized "
        >
          <thead class="spectrum-Table-head">
            <th class="spectrum-Table-headCell">Player</th>
            <th class="spectrum-Table-headCell">Buffs %</th>
            <th class="spectrum-Table-headCell">BuffS Flat</th>
            <th class="spectrum-Table-headCell">Final</th>
          </thead>
          <tbody class="spectrum-Table-body">
            <tr class="spectrum-Table-row">
              <th class="spectrum-Table-headCell">
                <span>Attack</span>
              </th>
              <td class="spectrum-Table-cell">
                <span> ${simulatorState.TotalAtack.get()} </span>
              </td>
              <td class="spectrum-Table-cell">
                <span> ${simulatorState.FlatAttack.get()} </span>
              </td>
            </tr>
            <tr class="spectrum-Table-row">
              <th class="spectrum-Table-headCell">
                <span>Defense</span>
              </th>
              <td class="spectrum-Table-cell">
                <span> ${simulatorState.TotalDefense.get()} </span>
              </td>
              <td class="spectrum-Table-cell">
                <span> ${simulatorState.FlatDefense.get()} </span>
              </td>
            </tr>
            <tr class="spectrum-Table-row">
              <th class="spectrum-Table-headCell">
                <span>HP</span>
              </th>
              <td class="spectrum-Table-cell">
                <span> ${simulatorState.TotalHP.get()} </span>
              </td>
              <td class="spectrum-Table-cell">
                <span> ${simulatorState.FlatHP.get()} </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  static override styles: CSSResultGroup = [
    SpectrumCSSTable,
    SpectrumCSStextfield,
    SpectrumCSSstepper,
    SpectrumCSSinfieldbutton,
    css`
      table#BuffTable {
        display: grid;
        grid-template-columns: repeat(15, 1fr);
        grid-template-rows: auto;

        & thead {
          grid-column: 1 / -1;
          grid-row: 1;
          display: grid;
          grid-template-columns: subgrid;
        }

        & tbody {
          grid-column: 1 / -1;
          grid-row-start: 2;
          grid-row-end: -1;
          display: grid;
          grid-template-columns: subgrid;
        }

        & tr {
          grid-column: 1/ -1;
          grid-row-end: span 1;
          display: grid;
          grid-template-columns: subgrid;
          grid-template-rows: subgrid;
        }

        & td {
          height: 100%;
          width: 100%;
        }
      }

      div.spectrum-Textfield.spectrum-Textfield--sizeM {
        width: 4.5rem;
      }

      input.spectrum-Textfield-input.spectrum-Stepper-input {
        width: 4rem;
        height: 2rem;
      }

      div.secondaryTables {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
      }
    `,
  ];

  protected renderDebuffTable = () => {
    return html`
      <div class="debuffTable">
        <table id="DebuffTable"
          class=" spectrum-Table spectrum-Table--sizeM spectrum-Table--compact spectrum-Table--quiet spectrum-Table--emphasized "
        >
          <thead
            class="spectrum-Table-head)"
          >
            <th colspan="3"> &nbsp; </th>
            <th class="spectrum-Table-headCell">
              Attack
            </th>
            <th class="spectrum-Table-headCell">
              Defense
            </th>
          </thead>
          <tbody class="spectrum-Table-body" ">
            <tr class="spectrum-Table-row">
              <td class="spectrum-Table-cell">
                <span class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Debuff</span>
              </td>
              <td class="spectrum-Table-cell">
                <span class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">Monster</span>
              </td>
              <td class="spectrum-Table-cell">
                <span class="spectrum-FieldLabel spectrum-FieldLabel--sizeM">%</span>
              </td>
              <td class="spectrum-Table-cell">
                <div
                  class=" spectrum-Stepper spectrum-Stepper--sizeM "
                  id="stepper-vpbqf"
                  style="--mod-actionbutton-icon-size:10px;"
                >
                  <div
                    class="spectrum-Textfield spectrum-Textfield--sizeM spectrum-Stepper-textfield"
                    style=""
                    id="stepper-vpbqf-input"
                  >
                    <input
                      type="number"
                      id="MonsterDebuffAttack"
                      class=" spectrum-Textfield-input spectrum-Stepper-input "
                      min="0"
                      @change="${(e: Event) => {
                        const target = (e as CustomEvent)
                          .target as HTMLInputElement | null;
                        if (target) {
                          const valid = z
                            .number()
                            .min(0)
                            .safeParse(+target.value);
                          if (valid.success) {
                            simulatorState.setAttackDebuff(
                              simulatorState.troopType.get(),
                              valid.data
                            );
                            this.requestUpdate("DebuffData");
                          } else {
                            console.error(
                              `error parsing, ${valid.error.message}`
                            );
                          }
                        }
                      }}"
                      value="${simulatorState.getAttackDebuff(simulatorState.troopType.get())}"
                    />
                  </div>
                  <span class="spectrum-Stepper-buttons">
                    <button
                      aria-haspopup="listbox"
                      type="button"
                      class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--top spectrum-Stepper-button "
                      tabindex="-1"

                    >
                      <div class="spectrum-InfieldButton-fill">
                        <iconify-icon
                          icon="ion:chevron-up"
                          width="1rem"
                          focusable="false"
                          aria-hidden="true"
                          role="img"
                          class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                        ></iconify-icon>
                      </div>
                    </button>
                    <button
                      aria-haspopup="listbox"
                      type="button"
                      class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--bottom spectrum-Stepper-button "
                      tabindex="-1"

                    >
                      <div class="spectrum-InfieldButton-fill">
                        <iconify-icon
                          icon="ion:chevron-down"
                          width="1rem"
                          focusable="false"
                          aria-hidden="true"
                          role="img"
                          class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                        ></iconify-icon>
                      </div>
                    </button>
                  </span>
                </div>

              </td>
              <td class="spectrum-Table-cell">
                <div
                  class=" spectrum-Stepper spectrum-Stepper--sizeM "
                  id="stepper-vpbqf"
                  style="--mod-actionbutton-icon-size:10px;"
                >
                  <div
                    class="spectrum-Textfield spectrum-Textfield--sizeM spectrum-Stepper-textfield"
                    style=""
                    id="stepper-vpbqf-input"
                  >
                    <input
                      type="number"
                      id="MonsterDebuffDefense"
                      class=" spectrum-Textfield-input spectrum-Stepper-input "
                      min="0"
                      @change="${(e: Event) => {
                        const target = (e as CustomEvent)
                          .target as HTMLInputElement | null;
                        if (target) {
                          const valid = z
                            .number()
                            .min(0)
                            .safeParse(+target.value);
                          if (valid.success) {
                            simulatorState.setDefenseDebuff(
                              simulatorState.troopType.get(),
                              valid.data
                            );
                            this.requestUpdate("DebuffData");
                          } else {
                            console.error(
                              `error parsing, ${valid.error.message}`
                            );
                          }
                        }
                      }}"

                      value="${simulatorState.getDefenseDebuff(simulatorState.troopType.get())}"
                    />
                  </div>
                  <span class="spectrum-Stepper-buttons">
                    <button
                      aria-haspopup="listbox"
                      type="button"
                      class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--top spectrum-Stepper-button "
                      tabindex="-1"

                    >
                      <div class="spectrum-InfieldButton-fill">
                        <iconify-icon
                          icon="ion:chevron-up"
                          width="1rem"
                          focusable="false"
                          aria-hidden="true"
                          role="img"
                          class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                        ></iconify-icon>
                      </div>
                    </button>
                    <button
                      aria-haspopup="listbox"
                      type="button"
                      class=" spectrum-InfieldButton spectrum-InfieldButton--sizeM spectrum-InfieldButton--bottom spectrum-Stepper-button "
                      tabindex="-1"

                    >
                      <div class="spectrum-InfieldButton-fill">
                        <iconify-icon
                          icon="ion:chevron-down"
                          width="1rem"
                          focusable="false"
                          aria-hidden="true"
                          role="img"
                          class=" spectrum-Icon spectrum-Icon--medium spectrum-InfieldButton-icon"
                        ></iconify-icon>
                      </div>
                    </button>
                  </span>
                </div>

              </td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };

  protected override render() {
    const buffTable = this.BuffController.table({
      columns: this.BuffColumns,

      data: simulatorState.getAsTableData.get(),

      getGroupedRowModel: getGroupedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });
    const tableHeaderRowCount = buffTable.getHeaderGroups().length + 1;
    const tableStyle = {};
    const tableHeaderStyle = {
      "grid-template-rows": `repeat(${tableHeaderRowCount - 1}, 1.5rem)`,
    };
    const tableBodyStyle = {
      "grid-template-rows": `repeat(${buffTable.getRowModel().rows.length}, 2.5rem)`,
    };
    return html`
      <table
        id="BuffTable"
        class=" spectrum-Table spectrum-Table--sizeM spectrum-Table--compact spectrum-Table--quiet spectrum-Table--emphasized "
        style="${styleMap(tableStyle)}"
      >
        <thead
          class="spectrum-Table-head)"
          style="${styleMap(tableHeaderStyle)}"
        >
          ${repeat(
            buffTable.getHeaderGroups(),
            (headerGroup) => headerGroup.id,
            (headerGroup) => {
              let GroupOffset = 1;
              return html`
                <tr>
                  ${repeat(
                    headerGroup.headers,
                    (header) => header.id,
                    (header) => {
                      const tableHeadCellStyle = {
                        "grid-column-start": GroupOffset,
                        "grid-column-end": `span ${header.column.columns.length}`,
                      };
                      GroupOffset += header.column.columns.length
                        ? header.column.columns.length
                        : 1;
                      return html`
                        <th
                          class="spectrum-Table-headCell"
                          style="${styleMap(tableHeadCellStyle)}"
                        >
                          ${header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </th>
                      `;
                    }
                  )}
                </tr>
              `;
            }
          )}
        </thead>
        <tbody class="spectrum-Table-body" style="${styleMap(tableBodyStyle)}">
          ${repeat(
            buffTable.getRowModel().rows,
            (row) => row.id,
            (row) => {
              const rowStyle = {
                "grid-row-start": row.index + 1,
              };
              return html`
                <tr class="spectrum-Table-row" style="${styleMap(rowStyle)}">
                  ${repeat(
                    row.getVisibleCells(),
                    (cell) => cell.id,
                    (cell) => {
                      const cellStyle = {
                        "grid-column-end":
                          row.index >= 7
                            ? cell.column.getIndex() == 0
                              ? "span 2"
                              : "span 1"
                            : "span 1",
                      };
                      if (row.index >= 7 && cell.column.getIndex() == 1) {
                        return nothing;
                      }
                      return html`
                        <td
                          id="${cell.column.id}-${cell.row.index}"
                          role="gridcell"
                          class="spectrum-Table-cell"
                          style="${styleMap(cellStyle)}"
                        >
                          ${cell.getIsPlaceholder()
                            ? null
                            : flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                        </td>
                      `;
                    }
                  )}
                </tr>
              `;
            }
          )}
        </tbody>
      </table>
      <div class="secondaryTables">
        ${this.renderDebuffTable()} ${this.printResults()}
      </div>
    `;
  }
}
