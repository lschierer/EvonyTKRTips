import {
  createTable,
  type SortingState,
  type TableState,
  type TableOptions,
  type TableOptionsResolved,
  getCoreRowModel,
  getSortedRowModel,
} from "@tanstack/table-core";

import { atom, batched, computed, map, deepMap } from "nanostores";

import * as stores from "./store";

import * as constants from "@schemas/constants";
import { GeneralPair } from "@schemas/generals";

import { DefaultColumns, PvMcolumns, PvPcolumns } from "./columns";

const DEBUG = true;

export const stateStore = atom<TableState | null>(null);

export const sortingStore = atom<SortingState>([
  {
    id: "primary",
    desc: false,
  },
  {
    id: "secondary",
    desc: false,
  },
]);

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
    let data: GeneralPair[];
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
      enableMultiSort: false,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      data: PvM ? PvMPairs : Attacking ? PvPPairs : DefaultPairs,
      ...currentState,
    };

    return resolvedOptions;
  }
);

export default tableStore;
