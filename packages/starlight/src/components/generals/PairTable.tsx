import { useContext, type Component } from "solid-js";

import * as stores from "./store";
import { TableContext, type tc } from "./TableContext";

const TableElement: Component = () => {
  const _TableContext = useContext(TableContext);
  return <div>generals: {JSON.stringify(_TableContext.generals)}</div>;
};

export default TableElement;
