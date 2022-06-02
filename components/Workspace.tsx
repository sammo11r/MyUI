import React from "react";
import { useTranslation } from "next-i18next";
import { workspaceStates } from "../pages";
import BaseTable from "./BaseTable";

/**
 * @param {*} { 
 *   workspaceState,
 *   hasuraProps,
 *   systemProps,
 *   userConfig,
 *   setUserConfig,
 *   userConfigQueryInput,
 *   setUserConfigQueryInput
 * }
 * @return {*} 
 */
function Workspace({ 
  workspaceState,
  hasuraProps,
  systemProps,
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput
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
    case workspaceStates.DASHBOARD:
      return <p>Coming Soon!</p>;
    case workspaceStates.EMPTY:
      return <p>{t("workspace.welcome")}</p>;
    default:
      return <p>Something!</p>;
  }
}

export default Workspace;
