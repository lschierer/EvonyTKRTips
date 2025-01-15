import { html, type TemplateResult } from "lit";

import { GeneralPair } from "@schemas/generals";
import * as constants from "@schemas/constants";

import * as stores from "./store";

export type ColumnDef =
  | {
      id: string;
      enableSorting?: boolean;
      invertSorting?: boolean;
      accessorKey: string;
      sortingFn: "alphanumeric" | "basic";
      header?: () => string | TemplateResult;
      cell?: (row: GeneralPair) => string | TemplateResult;
    }
  | {
      id: string;
      enableSorting?: boolean;
      invertSorting?: boolean;
      accessorKey: string;
      sortingFn: "alphanumeric" | "basic";
    }
  | {
      id: string;
      enableSorting?: boolean;
      invertSorting?: boolean;
      sortingFn: "alphanumeric" | "basic";
      header: () => string | TemplateResult;
      cell: (row: GeneralPair) => string | TemplateResult;
    }
  | {
      id: string;
      columns: ColumnDef[];
      header?: () => string | TemplateResult;
    };

export const DefaultColumns: ColumnDef[] = [
  {
    id: "primary",
    enableSorting: true,
    accessorKey: "primary.id",
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.primary.id}</span>`,
  },
  {
    accessorKey: "secondary.id",
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Secondary</span>`,
    cell: (row) => row.secondary.id,
  },
  {
    accessorKey: "primary.level",
    id: "level",
    sortingFn: "basic",
    header: () => html`<span class="generalTableHeader">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.primary.level}</span>`,
  },
  {
    id: "MarchSizeIncrease.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> March Size Increase </span>
    `,
    cell: (row) =>
      html`<span class="tableCell"
        >${row.MarchSizeIncrease?.total ?? 0}%</span
      >`,
  },
];

export const PvMcolumns: ColumnDef[] = [
  ...DefaultColumns,
  {
    id: "PvM",
    header: () => html`
      <span class="generalTableHeader"> Player Versus Monster Statistics </span>
    `,
    columns: [
      {
        id: "BuffSet.attack.total",
        accessorKey: "BuffSet.attack.total",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Attack Buff Total </span>
        `,
        cell: (row) =>
          html`<span class="tableCell">${row.BuffSet?.attack.total}%</span>`,
      },
      {
        id: "ScoreSet.attack",
        accessorKey: "ScoreSet.attack",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns Attack Score </span>
        `,
        cell: (row) =>
          html`<span class="tableCell">${row.ScoreSet?.attack}%</span>`,
      },
      {
        id: "PvM.attack",
        columns: [
          {
            id: "BuffSet.attack.totalAttribute",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"
                >Basic Attribute Total</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${(row.BuffSet?.attack.totalAttribute ?? 0 * 100)
                  .toFixed(3)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          },
          {
            id: "BuffSet.attack.BaseSkill",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Base Skill</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.attack.BaseSkill.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
          {
            id: "BuffSet.attack.SkillBooks",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Skill Books</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.attack.SkillBooks.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
          {
            id: "BuffSet.attack.Speciality1",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 1</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.attack.Speciality1.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
          {
            id: "BuffSet.attack.Speciality2",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 2</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.attack.Speciality2.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
          {
            id: "PvM.attack",
            columns: [
              {
                id: "BuffSet.attack.Speciality3",
                sortingFn: "basic",
                header: () =>
                  html`<span class="generalTableHeader">Speciality 3</span>`,
                cell: (row) =>
                  html`<span class="tableCell"
                    >${row.BuffSet?.attack.Speciality3.toFixed(1).replace(
                      /(\d)0+$/,
                      "$1"
                    )}%</span
                  >`,
              },
              {
                id: "BuffSet.attack.Speciality4",
                sortingFn: "basic",

                header: () =>
                  html`<span class="generalTableHeader">Speciality 4</span>`,
                cell: (row) =>
                  html`<span class="tableCell"
                    >${row.BuffSet?.attack.Speciality4.toFixed(1).replace(
                      /(\d)0+$/,
                      "$1"
                    )}%</span
                  >`,
              },
              {
                id: "BuffSet.attack.Ascending",
                sortingFn: "basic",

                header: () =>
                  html`<span class="generalTableHeader">Ascending</span>`,
                cell: (row) =>
                  html` <span class="tableCell">
                    ${row.BuffSet?.attack.Ascending}
                  </span>`,
              },
            ],
          },
        ],
      },

      {
        id: "ScoreSet.defense",
        accessorKey: "ScoreSet.defense",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns Defense Score </span>
        `,
        cell: (row) =>
          html`<span class="tableCell">${row.ScoreSet?.defense}%</span>`,
      },
      {
        id: "BuffSet.defense.total",
        accessorKey: "BuffSet.defense.total",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Defense Total </span>
        `,
        cell: (row) =>
          html`<span class="tableCell"> ${row.BuffSet?.defense.total}% </span>`,
      },
      {
        id: "PvM.defense",
        columns: [
          {
            id: "BuffSet.defense.totalAttribute",
            sortingFn: "basic",
            header: () =>
              html`<span class="generalTableHeader"
                >Basic Attribute Total</span
              >`,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.BuffSet?.defense.totalAttribute ?? 0 * 100)
                  .toFixed(3)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          },
          {
            id: "BuffSet.defense.BaseSkill",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Base Skill</span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.defense.BaseSkill.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.defense.SkillBooks",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"> Skill Books </span> `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.defense.SkillBooks.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.defense.Speciality1",
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"> Speciality 1 </span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.defense.Speciality1.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.defense.Speciality2",
            sortingFn: "basic",

            header: () => html`
              <span class="generalTableHeader"> Speciality 2 </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.defense.Speciality2.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.defense.Speciality3",
            sortingFn: "basic",

            header: () => html`
              <span class="generalTableHeader"> Speciality 3 </span>
            `,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.defense.Speciality3.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
          {
            id: "BuffSet.defense.Speciality4",
            sortingFn: "basic",
            header: () =>
              html` <span class="generalTableHeader"> Speciality 4 </span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.defense.Speciality4.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
          {
            id: "BuffSet.defense.Ascending",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Ascending </span>
            `,
            cell: (row) =>
              html`<span class="tableCell"
                >${row.BuffSet?.defense.Ascending.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%</span
              >`,
          },
        ],
      },

      {
        id: "BuffSet.hp.total",
        accessorKey: "BuffSet.hp.total",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> HP Total </span>
        `,
        cell: (row) =>
          html`<span class="tableCell">${row.BuffSet?.hp.total}%</span>`,
      },
      {
        id: "ScoreSet.hp",
        accessorKey: "ScoreSet.hp",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns HP Score </span>
        `,
        cell: (row) =>
          html`<span class="tableCell">${row.ScoreSet?.hp}%</span>`,
      },
      {
        id: "PvM.hp",
        columns: [
          {
            id: "BuffSet.hp.totalAttribute",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Basic Attribute Total </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.BuffSet?.hp.totalAttribute ?? 0 * 100)
                  .toFixed(3)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.BaseSkill",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Base Skill </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.BaseSkill.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.SkillBooks",
            sortingFn: "basic",
            header: () =>
              html`<span class="generalTableHeader">Skill Books</span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.SkillBooks.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.Speciality1",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Speciality 1 </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.Speciality1.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.Speciality2",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Speciality 2 </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.Speciality2.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.Speciality3",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Speciality 3 </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.Speciality3.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.Speciality4",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Speciality 4 </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.Speciality4.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
          {
            id: "BuffSet.hp.Ascending",
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Ascending </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${row.BuffSet?.hp.Ascending.toFixed(1).replace(
                  /(\d)0+$/,
                  "$1"
                )}%
              </span>
            `,
          },
        ],
      },

      {
        id: "BuffSet.doubleDrop.total",
        accessorKey: "BuffSet.doubleDrop.total",
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Double Drop Total </span>
        `,
        cell: (row) =>
          html`<span class="tableCell"
            >${row.BuffSet?.doubleDrop?.total}%</span
          >`,
      },
    ],
  },
];
/*{
  id: "PvM",

  columns: [










    {
      id: "PvM.doubleDrop",

      columns: [
        {id: "BuffSet.doubleDrop.BaseSkill",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Base Skill </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row.getValue() ?? (0).toFixed(1).replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.doubleDrop.SkillBooks",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Skill Books </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.doubleDrop.Speciality1",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 1 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.doubleDrop.Speciality2",
          sortingFn: "basic",

          header: () => html`
            <span class="generalTableHeader"> Speciality 2 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.doubleDrop.Speciality3",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 3 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.doubleDrop.Speciality4",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 4 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.doubleDrop.Ascending",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Ascending </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
      ],
    },

    {
      accessorKey: "BuffSet.reduceAttack.total",
      sortingFn: "basic",
      header: () => html`
        <span class="generalTableHeader"> Reduce Attack Total </span>
      `,
      cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
    },
    {
      id: "PvM.reduceAttack",
      columns: [
        {id: "BuffSet.reduceAttack.BaseSkill",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Base Skill </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceAttack.SkillBooks",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Skill Books </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceAttack.Speciality1",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 1 </span>
          `,
          cell: (row) =>
            html`<span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span> `,
        },
        {id: "BuffSet.reduceAttack.Speciality2",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 2 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceAttack.Speciality3",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 3 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceAttack.Speciality4",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 4 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceAttack.Ascending",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Ascending </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
      ],
    },

    {
      accessorKey: "BuffSet.reduceDefense.total",
      sortingFn: "basic",
      header: () => html`
        <span class="generalTableHeader"> Reduce Defense Total </span>
      `,
      cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
    },
    {
      id: "PvM.reduceDefense",
      columns: [
        {id: "BuffSet.reduceDefense.BaseSkill",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Base Skill </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceDefense.SkillBooks",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Skill Books </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceDefense.Speciality1",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 1 </span>
          `,
          cell: (row) =>
            html`<span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span> `,
        },
        {id: "BuffSet.reduceDefense.Speciality2",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 2 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceDefense.Speciality3",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 3 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceDefense.Speciality4",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 4 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceDefense.Ascending",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Ascending </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
      ],
    },
    {
      accessorKey: "BuffSet.reduceHP.total",
      sortingFn: "basic",
      header: () => html`
        <span class="generalTableHeader"> Reduce HP Total </span>
      `,
      cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
    },
    {
      id: "PvM.reduceHP",
      columns: [
        {id: "BuffSet.reduceHP.BaseSkill",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Base Skill </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceHP.SkillBooks",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Skill Books </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceHP.Speciality1",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 1 </span>
          `,
          cell: (row) =>
            html`<span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span> `,
        },
        {id: "BuffSet.reduceHP.Speciality2",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 2 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceHP.Speciality3",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 3 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceHP.Speciality4",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 4 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceHP.Ascending",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Ascending </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
      ],
    },

    {id: "BuffSet.marchSpeed.total"
      accessorKey: "BuffSet.marchSpeed.total",
      sortingFn: "basic",
      header: () => html`
        <span class="generalTableHeader"> March Speed Increase Total </span>
      `,
      cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
    },
    {
      id: "PvM.marchSpeed",
      columns: [
        {id: "BuffSet.marchSpeed.BaseSkill",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Base Skill </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.marchSpeed.SkillBooks",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Skill Books </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.marchSpeed.Speciality1",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 1 </span>
          `,
          cell: (row) =>
            html`<span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span> `,
        },
        {id: "BuffSet.marchSpeed.Speciality2",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 2 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.marchSpeed.Speciality3",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 3 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.marchSpeed.Speciality4",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 4 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.marchSpeed.Ascending",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Ascending </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
      ],
    },

    {
      accessorKey: "BuffSet.reduceStaminaCost.total",
      sortingFn: "basic",
      header: () => html`
        <span class="generalTableHeader"> Stamina Cost Reduction Total </span>
      `,
      cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
    },
    {
      id: "PvM.reduceStaminaCost",
      columns: [
        {id: "BuffSet.reduceStaminaCost.BaseSkill",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Base Skill </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceStaminaCost.SkillBooks",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Skill Books </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceStaminaCost.Speciality1",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 1 </span>
          `,
          cell: (row) =>
            html`<span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span> `,
        },
        {id: "BuffSet.reduceStaminaCost.Speciality2",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 2 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceStaminaCost.Speciality3",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 3 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        {id: "BuffSet.reduceStaminaCost.Speciality4",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Speciality 4 </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
        { id: "BuffSet.reduceStaminaCost.Ascending",
          sortingFn: "basic",
          header: () => html`
            <span class="generalTableHeader"> Ascending </span>
          `,
          cell: (row) => html`
            <span class="tableCell">
              ${row
                .getValue()
                .toFixed(1)
                .replace(/(\d)0+$/, "$1")}%
            </span>
          `,
        },
      ],
    },
  ],
},
export const PvPcolumns: ColumnDef<GeneralPair>[] = [];
*/
