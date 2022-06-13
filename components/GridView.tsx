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
  t,
}: any): any {
  return (
    <TableData
      hasuraProps={hasuraProps}
      query={query}
      style={style}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      name={name}
      dashboardName={dashboardName}
      hasuraHeaders={hasuraHeaders}
      t={t}
      isBaseTable={false}
      tableName={name}
      gridViewToggle={gridViewToggle}
      setGridViewToggle={setGridViewToggle}
    ></TableData>
  );
}

export default GridView;
