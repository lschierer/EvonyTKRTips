import {
  createSignal,
  type Component,
  type JSX,
  type useContext,
} from "solid-js";

import { createStore, type SetStoreFunction } from "solid-js/store";

import { TableContext, type tc } from "./TableContext";

type tsp = tc & {
  children?: JSX.Element;
};
const TableStoreProvider: Component<tsp> = (props) => {
  const [state, setState] = createSignal<tc>({
    useCase: props.useCase,
    generals: props.generals,
    skillbooks: props.skillbooks,
    specialities: props.specialities,
    ascending: props.ascending,
    conflictgroups: props.conflictgroups,
  });
  const instance: tc = state();
  return (
    <TableContext.Provider value={{ ...instance }}>
      <span>test</span>
      {props.children}
    </TableContext.Provider>
  );
};

export default TableStoreProvider;
