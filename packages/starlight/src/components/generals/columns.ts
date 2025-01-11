import { createColumnHelper, type ColumnDef } from "@tanstack/lit-table";

import { html } from "lit";

import { GeneralPair } from "@schemas/generals";
import * as constants from "@schemas/constants";

const columnHelper = createColumnHelper<GeneralPair>();
const columns = [
  columnHelper.accessor("primary.id", {
    id: "primary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("secondary.id", {
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Secondary</span>`,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("primary.level", {
    id: "level",
    sortingFn: "basic",
    header: () => html`<span class="generalTableHeader">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("MarchSizeIncrease.total", {
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> March Size Increase </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue() ?? 0}%</span>`,
  }),

  columnHelper.group({
    id: "BuffSet",
    header: () =>
      html`<span class="generalTableHeader">Player versus Monsters</span>`,
    columns: [
      columnHelper.accessor("BuffSet.attack.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Attack Buff Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("ScoreSet.attack", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns Attack Score </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.attack",
        columns: [
          columnHelper.accessor("BuffSet.attack.totalAttribute", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"
                >Basic Attribute Total</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${(row.getValue() * 100)
                  .toFixed(3)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.BaseSkill", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Base Skill</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.SkillBooks", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Skill Books</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality1", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 1</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality2", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 2</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality3", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 3</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality4", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 4</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Ascending", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Ascending</span>`,
            cell: (row) =>
              html` <span class="tableCell"> ${row.getValue()} </span>`,
          }),
        ],
      }),
      columnHelper.accessor("ScoreSet.defense", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns Defense Score </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("BuffSet.defense.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Defense Total </span>
        `,
        cell: (row) =>
          html`<span class="tableCell"> ${row.getValue()}% </span>`,
      }),

      columnHelper.group({
        id: "BuffSet.defense",
        columns: [
          columnHelper.accessor("BuffSet.defense.totalAttribute", {
            sortingFn: "basic",
            header: () =>
              html`<span class="generalTableHeader"
                >Basic Attribute Total</span
              >`,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() * 100).toFixed(3).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.BaseSkill", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Base Skill</span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.SkillBooks", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"> Skill Books </span> `,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.Speciality1", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"> Speciality 1 </span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.defense.Speciality3", {
            sortingFn: "basic",

            header: () => html`
              <span class="generalTableHeader"> Speciality 3 </span>
            `,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.defense.Speciality4", {
            sortingFn: "basic",
            header: () =>
              html` <span class="generalTableHeader"> Speciality 4 </span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.defense.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Ascending </span>
            `,
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

      columnHelper.accessor("BuffSet.hp.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> HP Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("ScoreSet.hp", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns HP Score </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.hp",
        columns: [
          columnHelper.accessor("BuffSet.hp.totalAttribute", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Basic Attribute Total </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() * 100).toFixed(3).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.hp.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.hp.SkillBooks", {
            sortingFn: "basic",
            header: () =>
              html`<span class="generalTableHeader">Skill Books</span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.hp.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Ascending", {
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
          }),
        ],
      }),

      columnHelper.accessor("BuffSet.doubleDrop.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Double Drop Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.doubleDrop",

        columns: [
          columnHelper.accessor("BuffSet.doubleDrop.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.SkillBooks", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.reduceAttack.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Reduce Attack Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceAttack",
        columns: [
          columnHelper.accessor("BuffSet.reduceAttack.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.reduceDefense.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Reduce Defense Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceDefense",
        columns: [
          columnHelper.accessor("BuffSet.reduceDefense.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.SkillBooks", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.reduceHP.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Reduce HP Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceHP",
        columns: [
          columnHelper.accessor("BuffSet.reduceHP.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.marchSpeed.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> March Speed Increase Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.marchSpeed",
        columns: [
          columnHelper.accessor("BuffSet.marchSpeed.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Ascending", {
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
          }),
        ],
      }),

      columnHelper.accessor("BuffSet.reduceStaminaCost.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Stamina Cost Reduction Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceStaminaCost",
        columns: [
          columnHelper.accessor("BuffSet.reduceStaminaCost.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Ascending", {
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
          }),
        ],
      }),
    ],
  }),
];

export default columns;

const PvMcolumns = [
  columnHelper.accessor("primary.id", {
    id: "primary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("secondary.id", {
    id: "secondary",
    enableSorting: true,
    invertSorting: false,
    sortDescFirst: false,
    sortingFn: "alphanumeric",
    header: () => html`<span class="generalTableHeader">Secondary</span>`,
    cell: (row) => row.getValue(),
  }),
  columnHelper.accessor("primary.level", {
    id: "level",
    sortingFn: "basic",
    header: () => html`<span class="generalTableHeader">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("MarchSizeIncrease.total", {
    sortingFn: "basic",
    header: () => html`
      <span class="generalTableHeader"> March Size Increase </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue() ?? 0}%</span>`,
  }),

  columnHelper.group({
    id: "BuffSet",
    header: () =>
      html`<span class="generalTableHeader">Player versus Monsters</span>`,
    columns: [
      columnHelper.accessor("BuffSet.attack.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Attack Buff Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("ScoreSet.attack", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns Attack Score </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.attack",
        columns: [
          columnHelper.accessor("BuffSet.attack.totalAttribute", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"
                >Basic Attribute Total</span
              >`,
            cell: (row) =>
              html`<span class="tableCell"
                >${(row.getValue() * 100)
                  .toFixed(3)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.BaseSkill", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Base Skill</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.SkillBooks", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Skill Books</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality1", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 1</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality2", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 2</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality3", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 3</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Speciality4", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Speciality 4</span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.attack.Ascending", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Ascending</span>`,
            cell: (row) =>
              html` <span class="tableCell"> ${row.getValue()} </span>`,
          }),
        ],
      }),
      columnHelper.accessor("ScoreSet.defense", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns Defense Score </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("BuffSet.defense.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Defense Total </span>
        `,
        cell: (row) =>
          html`<span class="tableCell"> ${row.getValue()}% </span>`,
      }),

      columnHelper.group({
        id: "BuffSet.defense",
        columns: [
          columnHelper.accessor("BuffSet.defense.totalAttribute", {
            sortingFn: "basic",
            header: () =>
              html`<span class="generalTableHeader"
                >Basic Attribute Total</span
              >`,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() * 100).toFixed(3).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.BaseSkill", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader">Base Skill</span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.SkillBooks", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"> Skill Books </span> `,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.Speciality1", {
            sortingFn: "basic",

            header: () =>
              html`<span class="generalTableHeader"> Speciality 1 </span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.defense.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.defense.Speciality3", {
            sortingFn: "basic",

            header: () => html`
              <span class="generalTableHeader"> Speciality 3 </span>
            `,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.defense.Speciality4", {
            sortingFn: "basic",
            header: () =>
              html` <span class="generalTableHeader"> Speciality 4 </span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("BuffSet.defense.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Ascending </span>
            `,
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

      columnHelper.accessor("BuffSet.hp.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> HP Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("ScoreSet.hp", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> EvAns HP Score </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.hp",
        columns: [
          columnHelper.accessor("BuffSet.hp.totalAttribute", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Basic Attribute Total </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() * 100).toFixed(3).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.hp.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.hp.SkillBooks", {
            sortingFn: "basic",
            header: () =>
              html`<span class="generalTableHeader">Skill Books</span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.hp.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.hp.Ascending", {
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
          }),
        ],
      }),

      columnHelper.accessor("BuffSet.doubleDrop.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Double Drop Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.doubleDrop",

        columns: [
          columnHelper.accessor("BuffSet.doubleDrop.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.SkillBooks", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.doubleDrop.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.reduceAttack.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Reduce Attack Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceAttack",
        columns: [
          columnHelper.accessor("BuffSet.reduceAttack.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceAttack.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.reduceDefense.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Reduce Defense Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceDefense",
        columns: [
          columnHelper.accessor("BuffSet.reduceDefense.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.SkillBooks", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceDefense.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.reduceHP.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Reduce HP Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceHP",
        columns: [
          columnHelper.accessor("BuffSet.reduceHP.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceHP.Ascending", {
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
          }),
        ],
      }),
      columnHelper.accessor("BuffSet.marchSpeed.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> March Speed Increase Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.marchSpeed",
        columns: [
          columnHelper.accessor("BuffSet.marchSpeed.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.marchSpeed.Ascending", {
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
          }),
        ],
      }),

      columnHelper.accessor("BuffSet.reduceStaminaCost.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="generalTableHeader"> Stamina Cost Reduction Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "BuffSet.reduceStaminaCost",
        columns: [
          columnHelper.accessor("BuffSet.reduceStaminaCost.BaseSkill", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="generalTableHeader"> Skill Books </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality1", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality2", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality3", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Speciality4", {
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
          }),
          columnHelper.accessor("BuffSet.reduceStaminaCost.Ascending", {
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
          }),
        ],
      }),
    ],
  }),
];

const PvPcolumns: ColumnDef<GeneralPair>[] = [
  {
    id: "primary",
    sortingFn: "alphanumeric",
    accessorKey: "primary.id",
    header: () => html`<span class="generalTableHeader">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  },
];
