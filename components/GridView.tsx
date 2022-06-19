import React from "react";
import TableData from "../components/TableData";

/**
 * @param {*} {
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
 * }
 * @return {*}  {*}
 */
function GridView({
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
  encrypt
}: any): any {
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

export default GridView;
