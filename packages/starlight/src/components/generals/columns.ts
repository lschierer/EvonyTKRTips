import { type ColumnDef } from "@tanstack/table-core";

import { html } from "lit";

import { GeneralPair } from "@schemas/generals";

export const DefaultColumns: ColumnDef<GeneralPair>[] = [
  {
    id: "primary",
    sortDescFirst: false,
    accessorKey: "primary.id",
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  },
  {
    accessorKey: "secondary.id",
    id: "secondary",
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Secondary</span>`,
    cell: (row) => row.getValue(),
  },
  {
    accessorKey: "MarchSizeIncrease.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> March Size Increase </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue() ?? 0}%</span>`,
  },
];

export const PvMcolumns: ColumnDef<GeneralPair>[] = [
  ...DefaultColumns,
  {
    accessorKey: "BuffSet.attack.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Attack Buff Total </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },
  {
    accessorKey: "ScoreSet.attack",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> EvAns Attack Score </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    accessorKey: "BuffSet.defense.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Defense Total </span>
    `,
    cell: (row) => html`<span class="tableCell"> ${row.getValue()}% </span>`,
  },
  {
    accessorKey: "ScoreSet.defense",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> EvAns Defense Score </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    accessorKey: "BuffSet.hp.total",
    sortingFn: "basic",
    header: () => html` <span class="generalTableHeader"> HP Total </span> `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },
  {
    accessorKey: "ScoreSet.hp",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> EvAns HP Score </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    accessorKey: "BuffSet.doubleDrop.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Double Drop Total </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
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
    accessorKey: "BuffSet.reduceDefense.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Reduce Defense Total </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
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
    accessorKey: "BuffSet.marchSpeed.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> March Speed Increase Total </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    accessorKey: "BuffSet.reduceStaminaCost.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Stamina Cost Reduction Total </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },
];

export const PvPcolumns: ColumnDef<GeneralPair>[] = [
  ...DefaultColumns,
  {
    accessorKey: "BuffSet.attack.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Attack Buff Total </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    id: "ScoreSet.attack",
    accessorKey: "ScoreSet.attack",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> EvAns Attack Score </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    accessorKey: "BuffSet.defense.total",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> Defense Total </span>
    `,
    cell: (row) => html`<span class="tableCell"> ${row.getValue()}% </span>`,
  },
  {
    accessorKey: "ScoreSet.defense",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> EvAns Defense Score </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },

  {
    accessorKey: "BuffSet.hp.total",
    sortingFn: "basic",
    header: () => html` <span class="generalTableHeader"> HP Total </span> `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },
  {
    accessorKey: "ScoreSet.hp",
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> EvAns HP Score </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
  },
];
