import React from "react";
import { useTranslation } from "next-i18next";
import { workspaceStates } from "../pages";
import BaseTable from "./BaseTable";

/**
 * @return {*}
 */
function Workspace({ workspaceState, hasuraProps, systemProps }: any) {
  const { t } = useTranslation();

  switch (workspaceState.displaying) {
    case workspaceStates.BASE_TABLE:
      return <BaseTable hasuraProps={hasuraProps} systemProps={systemProps} name={workspaceState.name} />;
    case workspaceStates.DASHBOARD:
      return <p>Coming Soon!</p>;
    case workspaceStates.EMPTY:
      return <p>{t("workspace.welcome")}</p>;
    default:
      return <p>Something!</p>;
  }
}

export default Workspace;
