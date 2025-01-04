import { createColumnHelper } from "@tanstack/lit-table";

import { html } from "lit";

import { GeneralPair } from "@schemas/generals";

import { MountedPvMCompatiblePairMarchSize } from "./MarchSize";

const columnHelper = createColumnHelper<GeneralPair>();
const columns = [
  {
    id: "PairNameTopRow",
    columns: [
      {
        id: "PairNameSecondRow",
        columns: [
          columnHelper.accessor("primary.id", {
            id: "primary",
            enableSorting: true,
            invertSorting: false,
            sortDescFirst: false,
            sortingFn: "alphanumeric",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Primary</span
              >`,
            cell: (row) =>
              html`<span class="tableCell">${row.getValue()}</span>`,
          }),
          columnHelper.accessor("secondary.id", {
            id: "secondary",
            enableSorting: true,
            invertSorting: false,
            sortDescFirst: false,
            sortingFn: "alphanumeric",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Secondary</span
              >`,
            cell: (row) => row.getValue(),
          }),
        ],
      },
    ],
  },
  {
    id: "Level1stRow",
    columns: [
      {
        id: "Level2ndRow",
        columns: [
          columnHelper.accessor("primary.level", {
            id: "level",
            sortingFn: "basic",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Level</span
              >`,
            cell: (row) =>
              html`<span class="tableCell">${row.getValue()}</span>`,
          }),
        ],
      },
    ],
  },
  {
    id: "MarchSize1stRow",
    columns: [
      {
        id: "MarchSize2ndRow",
        columns: [
          columnHelper.accessor("MarchSizeIncrease.MountedPvMCompatiblePair", {
            id: "marchsize",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >March Size Increase</span
              >`,
            cell: (row) =>
              html`<span class="tableCell">${row.getValue()}</span>`,
          }),
        ],
      },
    ],
  },

  columnHelper.group({
    id: "MountedPvM",
    header: () =>
      html`<span class="tableHeader spectrum-Table-columnTitle"
        >Mounted PvM</span
      >`,
    columns: [
      columnHelper.group({
        id: "MountedPvM.Attack",
        header: () =>
          html`<span class="tableHeader spectrum-Table-columnTitle"
            >Attack</span
          >`,
        columns: [
          columnHelper.accessor("MountedPVM.attack.totalAttribute", {
            id: "MountedPvM.Attack.attributeTotal",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Basic Attribute Total</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${(row.getValue() * 100)
                  .toFixed(3)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("MountedPVM.attack.BaseSkill", {
            id: "MountedPVM.attack.BaseSkill",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Base Skill</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("MountedPVM.attack.SkillBooks", {
            id: "MountedPVM.attack.SkillBooks",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Skill Books</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("MountedPVM.attack.Speciality1", {
            id: "MountedPVM.attack.Speciality1",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Speciality 1</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("MountedPVM.attack.Speciality2", {
            id: "MountedPVM.attack.Speciality2",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Speciality 2</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("MountedPVM.attack.Speciality3", {
            id: "MountedPVM.attack.Speciality3",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Speciality 3</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("MountedPVM.attack.Speciality4", {
            id: "MountedPVM.attack.Speciality4",
            sortingFn: "basic",
            sortUndefined: "last",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Speciality 4</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
        ],
      }),
    ],
  }),
];
/*
{
  id: "marchsize",
  accessorFn: (row: GeneralPair, index: number) =>
    MountedPvMCompatiblePairMarchSize(row),
  sortingFn: "basic",
  sortUndefined: "last",
  header: () => html`<span class="tableHeader spectrum-Table-columnTitle">March Size Increase</span>`,
  cell: (info) => html`<span class="tableCell">${info.getValue()}</span>`,
},
columnHelper.accessor("MarchSizeIncrease.MountedPvMCompatiblePair", {
  id: "marchsize",
  sortingFn: "basic",
  sortUndefined: "last",
  header: () => html`<span class="tableHeader spectrum-Table-columnTitle">March Size Increase</span>`,
  cell: (row) =>
    html`<span class="tableCell"
      >${MountedPvMCompatiblePairMarchSize(row.row.original)}</span
    >`,
}),


*/

export default columns;
