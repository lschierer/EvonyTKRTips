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
    sortingFn: "alphanumeric",
    header: () =>
      html`<span class="tableHeader spectrum-Table-columnTitle">Primary</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
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
  columnHelper.accessor("primary.level", {
    id: "level",
    sortingFn: "basic",
    header: () =>
      html`<span class="tableHeader spectrum-Table-columnTitle">Level</span>`,
    cell: (row) => html`<span class="tableCell">${row.getValue()}</span>`,
  }),
  columnHelper.accessor("MarchSizeIncrease.total", {
    sortingFn: "basic",
    header: () => html`
      <span class="tableHeader spectrum-Table-columnTitle">
        March Size Increase
      </span>
    `,
    cell: (row) => html`<span class="tableCell">${row.getValue() ?? 0}%</span>`,
  }),

  columnHelper.group({
    id: "PvM",
    header: () =>
      html`<span class="tableHeader spectrum-Table-columnTitle"
        >Player versus Monsters</span
      >`,
    columns: [
      columnHelper.accessor("PvM.attack.total", {
        sortingFn: "basic",

        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            Attack Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.Attack",
        columns: [
          columnHelper.accessor("PvM.attack.totalAttribute", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.BaseSkill", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.SkillBooks", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.Speciality1", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.Speciality2", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.Speciality3", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.Speciality4", {
            sortingFn: "basic",

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
          columnHelper.accessor("PvM.attack.Ascending", {
            sortingFn: "basic",

            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Ascending</span
              >`,
            cell: (row) =>
              html` <span class="tableCell"> ${row.getValue()} </span>`,
          }),
        ],
      }),
      columnHelper.accessor("PvM.defense.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            Defense Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.accessor("PvM.defense.totalAttribute", {
        sortingFn: "basic",
        header: () =>
          html`<span class="tableHeader spectrum-Table-columnTitle"
            >Basic Attribute Total</span
          >`,
        cell: (row) => html`
          <span class="tableCell">
            ${(row.getValue() * 100).toFixed(3).replace(/(\d)0+$/, "$1")}%
          </span>
        `,
      }),
      columnHelper.group({
        id: "PvM.Defense",
        columns: [
          columnHelper.accessor("PvM.defense.BaseSkill", {
            sortingFn: "basic",

            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Base Skill</span
              >`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.defense.SkillBooks", {
            sortingFn: "basic",

            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle">
                Skill Books
              </span> `,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.defense.Speciality1", {
            sortingFn: "basic",

            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.defense.Speciality2", {
            sortingFn: "basic",

            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.defense.Speciality3", {
            sortingFn: "basic",

            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
            `,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("PvM.defense.Speciality4", {
            sortingFn: "basic",
            header: () =>
              html` <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>`,
            cell: (row) =>
              html`<span class="tableCell"
                >${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%</span
              >`,
          }),
          columnHelper.accessor("PvM.defense.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
      columnHelper.accessor("PvM.hp.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle"> HP Total </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.HP",
        columns: [
          columnHelper.accessor("PvM.hp.totalAttribute", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Basic Attribute Total
              </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() * 100).toFixed(3).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.hp.BaseSkill", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Base Skill
              </span>
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
          columnHelper.accessor("PvM.hp.SkillBooks", {
            sortingFn: "basic",
            header: () =>
              html`<span class="tableHeader spectrum-Table-columnTitle"
                >Skill Books</span
              >`,
            cell: (row) => html`
              <span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.hp.Speciality1", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>
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
          columnHelper.accessor("PvM.hp.Speciality2", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.hp.Speciality3", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
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
          columnHelper.accessor("PvM.hp.Speciality4", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>
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
          columnHelper.accessor("PvM.hp.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
      columnHelper.accessor("PvM.doubleDrop.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            Double Drop Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.doubleDrop",

        columns: [
          columnHelper.accessor("PvM.doubleDrop.BaseSkill", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Base Skill
              </span>
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
          columnHelper.accessor("PvM.doubleDrop.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Skill Books
              </span>
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
          columnHelper.accessor("PvM.doubleDrop.Speciality1", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>
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
          columnHelper.accessor("PvM.doubleDrop.Speciality2", {
            sortingFn: "basic",

            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.doubleDrop.Speciality3", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
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
          columnHelper.accessor("PvM.doubleDrop.Speciality4", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>
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
          columnHelper.accessor("PvM.doubleDrop.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
      columnHelper.accessor("PvM.reduceAttack.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            Reduce Attack Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.reduceAttack",
        columns: [
          columnHelper.accessor("PvM.reduceAttack.BaseSkill", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Base Skill
              </span>
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
          columnHelper.accessor("PvM.reduceAttack.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Skill Books
              </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.reduceAttack.Speciality1", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>
            `,
            cell: (row) =>
              html`<span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span> `,
          }),
          columnHelper.accessor("PvM.reduceAttack.Speciality2", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.reduceAttack.Speciality3", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
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
          columnHelper.accessor("PvM.reduceAttack.Speciality4", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>
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
          columnHelper.accessor("PvM.reduceAttack.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
      columnHelper.accessor("PvM.reduceDefense.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            Reduce Defense Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.reduceDefense",
        columns: [
          columnHelper.accessor("PvM.reduceDefense.BaseSkill", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Base Skill
              </span>
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
          columnHelper.accessor("PvM.reduceDefense.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Skill Books
              </span>
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
          columnHelper.accessor("PvM.reduceDefense.Speciality1", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>
            `,
            cell: (row) =>
              html`<span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span> `,
          }),
          columnHelper.accessor("PvM.reduceDefense.Speciality2", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.reduceDefense.Speciality3", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
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
          columnHelper.accessor("PvM.reduceDefense.Speciality4", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>
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
          columnHelper.accessor("PvM.reduceDefense.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
      columnHelper.accessor("PvM.reduceHP.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            Reduce HP Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.reduceHP",
        columns: [
          columnHelper.accessor("PvM.reduceHP.BaseSkill", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Base Skill
              </span>
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
          columnHelper.accessor("PvM.reduceHP.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Skill Books
              </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.reduceHP.Speciality1", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>
            `,
            cell: (row) =>
              html`<span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span> `,
          }),
          columnHelper.accessor("PvM.reduceHP.Speciality2", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.reduceHP.Speciality3", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
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
          columnHelper.accessor("PvM.reduceHP.Speciality4", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>
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
          columnHelper.accessor("PvM.reduceHP.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
      columnHelper.accessor("PvM.marchSpeed.total", {
        sortingFn: "basic",
        header: () => html`
          <span class="tableHeader spectrum-Table-columnTitle">
            March Speed Increase Total
          </span>
        `,
        cell: (row) => html`<span class="tableCell">${row.getValue()}%</span>`,
      }),
      columnHelper.group({
        id: "PvM.marchSpeed",
        columns: [
          columnHelper.accessor("PvM.marchSpeed.BaseSkill", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Base Skill
              </span>
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
          columnHelper.accessor("PvM.marchSpeed.SkillBooks", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Skill Books
              </span>
            `,
            cell: (row) => html`
              <span class="tableCell">
                ${(row.getValue() ?? 0).toFixed(1).replace(/(\d)0+$/, "$1")}%
              </span>
            `,
          }),
          columnHelper.accessor("PvM.marchSpeed.Speciality1", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 1
              </span>
            `,
            cell: (row) =>
              html`<span class="tableCell">
                ${row
                  .getValue()
                  .toFixed(1)
                  .replace(/(\d)0+$/, "$1")}%
              </span> `,
          }),
          columnHelper.accessor("PvM.marchSpeed.Speciality2", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 2
              </span>
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
          columnHelper.accessor("PvM.marchSpeed.Speciality3", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 3
              </span>
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
          columnHelper.accessor("PvM.marchSpeed.Speciality4", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Speciality 4
              </span>
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
          columnHelper.accessor("PvM.marchSpeed.Ascending", {
            sortingFn: "basic",
            header: () => html`
              <span class="tableHeader spectrum-Table-columnTitle">
                Ascending
              </span>
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
/*
{
  id: "marchsize",
  accessorFn: (row: GeneralPair, index: number) =>
    MountedPvMCompatiblePairMarchSize(row),
  sortingFn: "basic",

  header: () => html`<span class="tableHeader spectrum-Table-columnTitle">March Size Increase</span>`,
  cell: (info) => html`<span class="tableCell">${info.getValue()}</span>`,
},
columnHelper.accessor("MarchSizeIncrease.MountedPvMCompatiblePair", {
  id: "marchsize",
  sortingFn: "basic",

  header: () => html`<span class="tableHeader spectrum-Table-columnTitle">March Size Increase</span>`,
  cell: (row) =>
    html`<span class="tableCell"
      >${MountedPvMCompatiblePairMarchSize(row.row.original)}</span
    >`,
}),


*/

export default columns;
