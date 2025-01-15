import {
  createEffect,
  createSignal,
  type Component,
  type JSX,
  type useContext,
} from "solid-js";

import { createStore, type SetStoreFunction } from "solid-js/store";
import { z } from "zod";

import { General } from "@schemas/generals";
import { TableContext, type tcValue, type tc } from "./TableContext";

const DEBUG = true;

type tsp = tcValue & {
  children?: JSX.Element;
};
const TableStoreProvider: Component<tsp> = (props) => {
  let valid = z.array(General).safeParse(props.generals);
  const generals = new Array<General>();
  if (valid.success) {
    if (DEBUG) {
      createEffect(() => {
        console.log(`TableStoreProvider parsed generals: ${valid.data.length}`);
      });
    }

    valid.data.forEach((g) => generals.push(g));
  } else {
    throw new Error(
      `TableStoreProvider failed to parse generals with error ${valid.error.message}`
    );
  }
  const [state, setState] = createStore<tcValue>({
    useCase: props.useCase,
    generals: generals,
    skillbooks: props.skillbooks,
    specialities: props.specialities,
    ascending: props.ascending,
    conflictgroups: props.conflictgroups,
  });
  createEffect(() => {
    if (DEBUG) {
      console.log(`props generals is ${props.generals}`);
      console.log(`state.useCase is ${state.useCase}`);
    }
  });

  const v = { value: state };
  return (
    <TableContext.Provider x }>
      <span>{valid.success && valid.data.length}</span>
      {props.children}
    </TableContext.Provider>
  );
};

export default TableStoreProvider;
