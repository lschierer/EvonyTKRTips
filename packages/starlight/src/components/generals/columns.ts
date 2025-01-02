import { createColumnHelper } from "@tanstack/lit-table";

import { html } from "lit";

import { GeneralPair } from "@schemas/generals";

const columnHelper = createColumnHelper<GeneralPair>();
const columns = [
  columnHelper.accessor("primary.id", {
    id: "primary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    header: () => html`<span class="tableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("secondary.id", {
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    header: () => html`<span class="tableHeader">Secondary</span>`,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("primary.level", {
    id: "level",
    header: () => html`<span class="tableHeader">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
];
/*
columnHelper.accessor("primary.level", {
  id: "level",
  header: () => html`<span class="tableHeader">Level</span>`,
  cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
}),
{
  id: "marchsize",
  header: () => html`<span class="tableHeader">March Size Increase</span>`,
  accessorFn: (row: GeneralPair) => MountedPvMCompatiblePairMarchSize(row),
},
*/

export default columns;
