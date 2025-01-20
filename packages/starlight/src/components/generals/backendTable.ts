import {
  type SortingState,
  type TableState,
  type TableOptions,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";

import { z } from "zod";

import { atom, computed } from "nanostores";

import * as stores from "./store";

import * as constants from "@schemas/constants";
import { GeneralPair } from "@schemas/generals";

import { DefaultColumns, PvMcolumns, PvPcolumns } from "./columns";

import debugFunction from "@lib/debug";
const DEBUG = debugFunction("components/generals/backendTable.ts");

export const stateStore = atom<TableState | null>(null);

export const sortByPrimarySecondary: SortingState = [
  {
    id: "primary",
    desc: false,
  },
  {
    id: "secondary",
    desc: false,
  },
];

export const sortByMarchSizeAttackScore: SortingState = [
  {
    id: "MarchSizeIncrease_total",
    desc: true,
  },
  {
    id: "ScoreSet.attack",
    desc: true,
  },
  {
    id: "primary",
    desc: false,
  },
  {
    id: "secondary",
    desc: false,
  },
];

export const sortByAttackScoreMarchSize: SortingState = [
  {
    id: "ScoreSet.attack",
    desc: true,
  },
  {
    id: "MarchSizeIncrease_total",
    desc: true,
  },
  {
    id: "primary",
    desc: false,
  },
  {
    id: "secondary",
    desc: false,
  },
];

export const SortingPresets = z.enum([
  "sortByPrimarySecondary",
  "sortByMarchSizeAttackScore",
  "sortByAttackScoreMarchSize",
]);
export type SortingPresets = z.infer<typeof SortingPresets>;

export const sortingStore = atom<SortingState>(sortByPrimarySecondary);

if (DEBUG) {
  sortingStore.subscribe((v) => {
    console.log(`sorting state change, `, JSON.stringify(v));
  });
}

const tableStore = computed(
  [
    stateStore,
    sortingStore,
    stores.generalUseCase,
    stores.PvMPairsWithStats,
    stores.AttackingPairsWithStats,
    stores.pairs,
  ],
  (
    currentState,
    currentSorting,
    currentUseCase,
    PvMPairs,
    PvPPairs,
    DefaultPairs
  ) => {
    if (DEBUG) {
      console.log(`computing new table`);
    }
    let PvM = false;
    let Attacking = false;
    let columns = DefaultColumns;
    if (!currentUseCase.localeCompare(constants.BuffActivation.Enum.PvM)) {
      if (DEBUG) {
        console.log(`table store sees use case is PvM`);
      }
      columns = PvMcolumns;
      PvM = true;
    } else if (
      !currentUseCase.localeCompare(constants.BuffActivation.Enum.Attacking)
    ) {
      columns = PvPcolumns;
      Attacking = true;
    } else {
      if (DEBUG) {
        console.log(`table store using defaults`);
      }
    }

    if (DEBUG) {
      console.log(
        `resolving options, sortingState is ${JSON.stringify(currentSorting)}`
      );
    }
    // Compose in the generic options to the user options
    const resolvedOptions: TableOptions<GeneralPair> = {
      state: {
        ...currentState,
        sorting: currentSorting,
      },
      onStateChange: () => {}, // noop
      renderFallbackValue: null,
      columns,
      enableSorting: true,
      enableSortingRemoval: false,
      enableMultiSort: true,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      defaultColumn: {
        enableSorting: true,
        invertSorting: false,
        sortDescFirst: true,
      },
      data: PvM ? PvMPairs : Attacking ? PvPPairs : DefaultPairs,
      ...currentState,
    };

    return resolvedOptions;
  }
);

export default tableStore;
