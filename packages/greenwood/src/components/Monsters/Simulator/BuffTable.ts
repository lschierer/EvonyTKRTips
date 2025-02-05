import {
  type CellContext,
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getGroupedRowModel,
  TableController,
} from "@tanstack/lit-table";

import {
  LitElement,
  html,
  unsafeCSS,
  css,
  type CSSResultGroup,
  nothing,
} from "lit";
import { customElement, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { styleMap } from "lit/directives/style-map.js";

import { z } from "zod";

import SpectrumCSSTable from "@spectrum-css/table/dist/index.css" with { type: "css" };
import SpectrumCSStextfield from "@spectrum-css/textfield/dist/index.css" with { type: "css" };
import SpectrumCSSstepper from "@spectrum-css/stepper/dist/index.css" with { type: "css" };

export const SimulatorBuff = z.object({
  attack: z.number().min(0).default(0),
  defense: z.number().min(0).default(0),
  hp: z.number().min(0).default(0),
});
export type SimulatorBuff = z.infer<typeof SimulatorBuff>;

export const SimulatorBuffGroup = z.object({
  ground: SimulatorBuff,
  archer: SimulatorBuff,
  mounted: SimulatorBuff,
  siege: SimulatorBuff,
});
export type SimulatorBuffGroup = z.infer<typeof SimulatorBuffGroup>;

export const SimulatorDebuff = SimulatorBuff.pick({
  attack: true,
  defense: true,
});
export type SimulatorDebuff = z.infer<typeof SimulatorDebuff>;

@customElement("buff-table")
export default class BuffTable extends LitElement {
  private BuffController = new TableController<SimulatorBuffGroup>(this);

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

  private renderCell = (props: CellContext<SimulatorBuffGroup, unknown>) => {
    if (props.row.index <= 6) {
      const cellValue = props.getValue() as number;

      return html`
        <div
          id="${props.column.id}-${props.row.index}"
          class="spectrum-Textfield spectrumText-field--sizeM spectrum-Stepper-textfield"
        >
          <input
            id="${props.column.id}-${props.row.id}"
            class="spectrum-Textfield-input spectrum-Stepper-input"
            type="number"
            min="0"
            @change="${(e: Event) => {
              const target = (e as CustomEvent)
                .target as HTMLInputElement | null;
              if (target) {
                const valid = z.number().min(0).safeParse(+target.value);
                if (valid.success) {
                  const key1 = props.column.id.split("_").shift();
                  const key2 = props.column.id.split("_").pop();
                  if (key1 != undefined && key2 != undefined) {
                    this.BuffData[props.row.index][key1][key2] = valid.data;
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
      const key1 = props.column.id.split("_").shift();
      const key2 = props.column.id.split("_").pop();
      if (key1 != undefined && key2 != undefined) {
        this.BuffData[props.row.index][key1][key2] = sum;
      }

      return html`
        <div class="aggregate">
          <span>${sum}</span>
        </div>
      `;
    }
  };

  private BuffColumns: ColumnDef<SimulatorBuffGroup>[] = [
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
            return props.row.index == 6 ? "#" : "%";
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

          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "ground.defense",
          header: "Defense",
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "ground.hp",
          header: "HP",
          cell: (props) => this.renderCell(props),
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
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "archer.defense",
          header: "Defense",
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "archer.hp",
          header: "HP",
          cell: (props) => this.renderCell(props),
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
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "mounted.defense",
          header: "Defense",
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "mounted.hp",
          header: "HP",
          cell: (props) => this.renderCell(props),
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
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "siege.defense",
          header: "Defense",
          cell: (props) => this.renderCell(props),
        },
        {
          accessorKey: "siege.hp",
          header: "HP",
          cell: (props) => this.renderCell(props),
        },
      ],
    },
  ];

  @state()
  private BuffData: SimulatorBuffGroup[] = new Array<SimulatorBuffGroup>();

  constructor() {
    super();
    this.BuffData = createData();
  }

  static override styles: CSSResultGroup = [
    unsafeCSS(SpectrumCSSTable),
    unsafeCSS(SpectrumCSStextfield),
    unsafeCSS(SpectrumCSSstepper),
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
      }
      tr {
        grid-column: 1/ -1;
        grid-row-end: span 1;
        display: grid;
        grid-template-columns: subgrid;
      }
      input.spectrum-Textfield-input.spectrum-Stepper-input {
        width: 4rem;
      }
    `,
  ];

  protected override render() {
    const buffTable = this.BuffController.table({
      columns: this.BuffColumns,

      data: this.BuffData,

      getGroupedRowModel: getGroupedRowModel(),
      getCoreRowModel: getCoreRowModel(),
    });
    const tableHeaderRowCount = buffTable.getHeaderGroups().length + 1;
    const tableStyle = {};
    const tableHeaderStyle = {
      "grid-template-rows": `repeat(${tableHeaderRowCount}, 1.5rem)`,
    };
    const tableBodyStyle = {
      "grid-template-rows": `repeat(${buffTable.getRowModel().rows.length + 1}, 1.5rem)`,
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
                    (cell) => html`
                      <td
                        id="${cell.column.id}-${cell.row.index}"
                        role="gridcell"
                        class="spectrum-Table-cell"
                      >
                        ${cell.getIsPlaceholder()
                          ? null
                          : flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                      </td>
                    `
                  )}
                </tr>
              `;
            }
          )}
        </tbody>
      </table>
    `;
  }
}

const createData = () => {
  const data = new Array<SimulatorBuffGroup>();
  for (let i = 0; i < 4; i++) {
    data.push({
      ground: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
      archer: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
      mounted: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
      siege: {
        attack: 0,
        defense: 0,
        hp: 0,
      },
    });
  }
  data.push({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  });
  data.push({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  });
  data.push({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  });
  data.push({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  });
  data.push({
    ground: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    archer: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    mounted: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
    siege: {
      attack: 0,
      defense: 0,
      hp: 0,
    },
  });
  return data;
};
