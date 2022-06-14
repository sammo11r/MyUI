import React from "react";

import { workspaceStates } from "../const/enum";
import BaseTable from "./BaseTable";
import Dashboard from "./Dashboard";

/**
 * @param {*} {
 *   workspaceState,
 *   hasuraProps,
 *   systemProps,
 *   userConfig,
 *   setUserConfig,
 *   setUserConfigQueryInput,
 *   dashboardState,
 *   setDashboardState,
 *   setEditElementModalState,
 *   hasuraHeaders,
 *   encrypt,
 *   gridViewToggle, 
 *   setGridViewToggle,
 *   t,
 * }
 * @return {*}  {*}
 */
function Workspace({
  workspaceState,
  hasuraProps,
  systemProps,
  userConfig,
  setUserConfig,
  setUserConfigQueryInput,
  dashboardState,
  setDashboardState,
  setEditElementModalState,
  hasuraHeaders,
  encrypt,
  gridViewToggle, 
  setGridViewToggle,
  t,
}: any): any {
  switch (workspaceState.displaying) {
    case workspaceStates.BASE_TABLE:
      return (
        <BaseTable
          hasuraProps={hasuraProps}
          systemProps={systemProps}
          name={workspaceState.name}
          userConfig={userConfig}
          setUserConfig={setUserConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          hasuraHeaders={hasuraHeaders}
          encrypt={encrypt}
          gridViewToggle={gridViewToggle}
          setGridViewToggle={setGridViewToggle}
          mode={workspaceState.displaying}
          t={t}
        />
      );
    case workspaceStates.DISPLAY_DASHBOARD:
    case workspaceStates.EDIT_DASHBOARD:
      return (
        <Dashboard
          hasuraProps={hasuraProps}
          systemProps={systemProps}
          dashboardState={dashboardState}
          setDashboardState={setDashboardState}
          mode={workspaceState.displaying}
          userConfig={userConfig}
          setEditElementModalState={setEditElementModalState}
          setUserConfigQueryInput={setUserConfigQueryInput}
          hasuraHeaders={hasuraHeaders}
          gridViewToggle={gridViewToggle}
          setGridViewToggle={setGridViewToggle}
          t={t}
        />
      );
    case workspaceStates.EMPTY:
      return <p>{t("workspace.welcome")}</p>;
    default:
      return <p>Something!</p>;
  }
}

export default Workspace;
