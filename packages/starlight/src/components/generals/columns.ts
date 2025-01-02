import { createColumnHelper } from "@tanstack/lit-table";

import { html } from "lit";

import { GeneralPair } from "@schemas/generals";

import { MountedPvMCompatiblePairMarchSize } from "./MarchSize";

const columnHelper = createColumnHelper<GeneralPair>();
const columns = [
  columnHelper.accessor("primary.id", {
    id: "primary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="tableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("secondary.id", {
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="tableHeader">Secondary</span>`,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("primary.level", {
    id: "level",
    sortingFn: "basic",
    header: () => html`<span class="tableHeader">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("MarchSizeIncrease.MountedPvMCompatiblePair", {
    id: "marchsize",
    sortingFn: "basic",
    sortUndefined: "last",
    header: () => html`<span class="tableHeader">March Size Increase</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
];
/*
{
  id: "marchsize",
  accessorFn: (row: GeneralPair, index: number) =>
    MountedPvMCompatiblePairMarchSize(row),
  sortingFn: "basic",
  sortUndefined: "last",
  header: () => html`<span class="tableHeader">March Size Increase</span>`,
  cell: (info) => html`<span class="tableCell">${info.getValue()}</span>`,
},
columnHelper.accessor("MarchSizeIncrease.MountedPvMCompatiblePair", {
  id: "marchsize",
  sortingFn: "basic",
  sortUndefined: "last",
  header: () => html`<span class="tableHeader">March Size Increase</span>`,
  cell: (row) =>
    html`<span class="tableCell"
      >${MountedPvMCompatiblePairMarchSize(row.row.original)}</span
    >`,
}),


*/

export default columns;
