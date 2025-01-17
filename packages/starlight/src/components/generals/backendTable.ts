import {
  createTable,
  type TableState,
  type TableOptions,
  type TableOptionsResolved,
  getCoreRowModel,
} from "@tanstack/table-core";

import { atom, batched, computed, map, deepMap } from "nanostores";

import * as stores from "./store";

import * as constants from "@schemas/constants";
import { GeneralPair } from "@schemas/generals";

import { DefaultColumns, PvMcolumns, PvPcolumns } from "./columns";

const DEBUG = true;

const stateStore = atom<TableState | null>(null);

const tableStore = computed(
  [stateStore, stores.generalUseCase, stores.PvMPairsWithStats, stores.pairs],
  (currentState, currentUseCase, PvMPairs, DefaultPairs) => {
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
        state: {}, // Dummy state
        onStateChange: () => {}, // noop
        renderFallbackValue: null,
        columns,
        data: PvMPairs,
        getCoreRowModel: getCoreRowModel(),
        ...currentState,
      };

      return resolvedOptions;
    } else {
      const resolvedOptions: TableOptionsResolved<GeneralPair> = {
        state: {}, // Dummy state
        onStateChange: () => {}, // noop
        renderFallbackValue: null,
        columns,
        data: DefaultPairs,
        getCoreRowModel: getCoreRowModel(),
        ...currentState,
      };

      return resolvedOptions;
    }
  }
);

export default tableStore;
