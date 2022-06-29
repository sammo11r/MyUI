import React from "react";

import { workspaceType } from "../consts/enum";
import { WorkspaceProps } from "../utils/customTypes";
import BaseTable from "./BaseTable";
import Dashboard from "./Dashboard";

/**
 * @param {WorkspaceProps} {
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
 * @return {JSX.Element} The displayed workspace
 */
export default function Workspace({
  workspaceState,
  hasuraProps,
  systemProps,
  userConfig,
  setUserConfigQueryInput,
  dashboardState,
  setDashboardState,
  setEditElementModalState,
  hasuraHeaders,
  encrypt,
  gridViewToggle,
  setGridViewToggle,
  t,
}: WorkspaceProps): JSX.Element {
  switch (workspaceState.displaying) {
    case workspaceType.BASE_TABLE:
      return (
        <BaseTable
          data-testid="workspace-base"
          hasuraProps={hasuraProps}
          systemProps={systemProps}
          name={workspaceState.name}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          hasuraHeaders={hasuraHeaders}
          encrypt={encrypt}
          gridViewToggle={gridViewToggle}
          setGridViewToggle={setGridViewToggle}
          mode={workspaceState.displaying}
          t={t}
        />
      );
    case workspaceType.DISPLAY_DASHBOARD:
    case workspaceType.EDIT_DASHBOARD:
      return (
        <Dashboard
          data-testid="workspace-dashboard"
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
          encrypt={encrypt}
          t={t}
        />
      );
    case workspaceType.EMPTY:
      return <p data-testid="workspace-empty">{t("workspace.welcome")}</p>;
    default:
      return <p data-testid="workspace-default"></p>;
  }
}
