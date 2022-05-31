import React from "react";
import { useTranslation } from "next-i18next";
import { workspaceStates } from "../pages";
import BaseTable from "./BaseTable";
import Dashboard from "./Dashboard";
import { useSWRConfig } from "swr";

/**
 * @return {*}
 */
function Workspace({ workspaceState, hasuraProps, systemProps, userConfig, setUserConfig }: any) {
  const { t } = useTranslation();

  switch (workspaceState.displaying) {
    case workspaceStates.BASE_TABLE:
      return <BaseTable hasuraProps={hasuraProps} systemProps={systemProps} name={workspaceState.name} />;
    case workspaceStates.DISPLAY_DASHBOARD:
    case workspaceStates.EDIT_DASHBOARD:
      return <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        name={workspaceState.name}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        setUserConfig={setUserConfig}
      />;
    case workspaceStates.EMPTY:
      return <p>{t("workspace.welcome")}</p>;
    default:
      return <p>Something!</p>;
  }
}

export default Workspace;
