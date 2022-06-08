import React, { useState } from "react";

import TableData from "../components/TableData";

/**
 * @param {*} {
 *   hasuraProps,
 *   query,
 *   style,
 *   systemProps,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   name,
 *   dashboardName,
 *   hasuraHeaders,
 *   t
 * }
 * @return {*}  {*}
 */
function GridView({
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
    ></TableData>
  );
}

export default GridView;
