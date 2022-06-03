import React from "react";
import { useTranslation } from "next-i18next";
import { workspaceStates } from "../pages";
import BaseTable from "./BaseTable";
import Dashboard from "./Dashboard";

/**
 * @return {*}
 */
function Workspace({
  workspaceState,
  hasuraProps,
  systemProps,
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput,
  dashboardState,
  setDashboardState,
  setEditElementModalState
}: any) {
  const { t } = useTranslation();
  switch (workspaceState.displaying) {
    case workspaceStates.BASE_TABLE:
      return <BaseTable 
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        name={workspaceState.name}
        userConfig={userConfig}
        setUserConfig={setUserConfig}
        userConfigQueryInput={userConfigQueryInput}
        setUserConfigQueryInput={setUserConfigQueryInput}
        />;
    case workspaceStates.DISPLAY_DASHBOARD:
    case workspaceStates.EDIT_DASHBOARD:
      return <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        name={workspaceState.name} // TODO: Might not be neede anymore
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        setUserConfig={setUserConfig}
        setEditElementModalState={setEditElementModalState}
        userConfigQueryInput={userConfigQueryInput}
        setUserConfigQueryInput={setUserConfigQueryInput}
      />;
    case workspaceStates.EMPTY:
      return <p>{t("workspace.welcome")}</p>;
    default:
      return <p>Something!</p>;
  }
}

export default Workspace;
