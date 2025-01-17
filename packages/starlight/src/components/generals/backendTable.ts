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
    stores.pairs,
  ],
  (currentState, currentSorting, currentUseCase, PvMPairs, DefaultPairs) => {
    if (DEBUG) {
      console.log(`computing new table`);
    }
    let columns = DefaultColumns;
    let data: GeneralPair[];
    if (!currentUseCase.localeCompare(constants.BuffActivation.Enum.PvM)) {
      if (DEBUG) {
        console.log(`table store sees use case is PvM`);
      }
      columns = PvMcolumns;
    } else {
      if (DEBUG) {
        console.log(`table store using defaults`);
      }
    }

    if (!currentUseCase.localeCompare(constants.BuffActivation.Enum.PvM)) {
      if (DEBUG) {
        console.log(
          `sending PvM row`,
          `${PvMPairs[0].primary.id}/${PvMPairs[0].secondary.id}` +
            `${PvMPairs[0].MarchSizeIncrease?.total} ${PvMPairs[0].BuffSet?.attack.total}`
        );
      }
      // Compose in the generic options to the user options
      const resolvedOptions: TableOptionsResolved<GeneralPair> = {
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
        data: PvMPairs,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        ...currentState,
      };

      return resolvedOptions;
    } else {
      const resolvedOptions: TableOptionsResolved<GeneralPair> = {
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
        data: DefaultPairs,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        ...currentState,
      };

      return resolvedOptions;
    }
  }
);

export default tableStore;
