import React from "react";
import TableData from "../components/TableData";
import { GridViewProps } from "../utils/customTypes";

/**
 * @param {GridViewProps} {
 *   gridViewToggle,
 *   setGridViewToggle,
 *   hasuraProps,
 *   query,
 *   style,
 *   systemProps,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   name,
 *   dashboardName,
 *   hasuraHeaders,
 *   mode,
 *   t,
 *   encrypt
 * }
 * @return {*}  {JSX.Element}
 */
export default function GridView({
  gridViewToggle,
  setGridViewToggle,
  hasuraProps,
  query,
  style,
  systemProps,
  userConfig,
  setUserConfigQueryInput,
  name,
  dashboardName,
  hasuraHeaders,
  mode,
  t,
  encrypt,
}: GridViewProps): JSX.Element {
  return (
    <TableData
      hasuraProps={hasuraProps}
      query={query}
      style={style}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      dashboardName={dashboardName}
      hasuraHeaders={hasuraHeaders}
      encrypt={encrypt}
      t={t}
      isBaseTable={false}
      tableName={name}
      gridViewToggle={gridViewToggle}
      setGridViewToggle={setGridViewToggle}
      mode={mode}
    ></TableData>
  );
}
