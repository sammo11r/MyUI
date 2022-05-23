import React from "react";
import { workspaceStates } from "../pages";
import BaseTable from "./BaseTable";
/**
 * @return {*}
 */
function Workspace({ workspaceState, hasuraProps }: any) {
  switch (workspaceState.displaying) {
    case workspaceStates.BASE_TABLE:
      return <BaseTable hasuraProps={hasuraProps} name={workspaceState.name} />;
    case workspaceStates.DASHBOARD:
      return <p>Coming Soon!</p>;
    case workspaceStates.EMPTY:
      console.log("workspace empty");
      return <p>Welcome to MyUI</p>;
    default:
      return <p>Something!</p>;
  }
}

export default Workspace;
