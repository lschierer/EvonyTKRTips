import { useContext, type Component } from "solid-js";

import * as stores from "./store";
import { TableContext, type tcValue } from "./TableContext";

const TableElement: Component = () => {
  const { state, setState }: any = useContext(TableContext);
  return <div>generals: {JSON.stringify(state.generals)}</div>;
};

export default TableElement;
