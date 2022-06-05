import React, { useState } from "react";
import { useQuery } from "react-query";

import BaseTableData from "./BaseTableData";
import Loader from "../components/Loader"

/**
 * @param {*} {
 *   hasuraProps,
 *   systemProps,
 *   name,
 *   userConfig,
 *   setUserConfig,
 *   userConfigQueryInput,
 *   setUserConfigQueryInput
 * }
 * @return {*} 
 */
function BaseTable({
  hasuraProps,
  systemProps,
  name,
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput,
  hasuraHeaders
}: any): any {
  enum columnStates { LOADING, READY }

  // Add state deciding whether to show loader or table
  const [columnState, setColumnState] = useState({
    columns: [{}],
    columnState: columnStates.LOADING,
  });

  let tableName = name;

  // Get the columns of the base table
  useQuery(["columnQuery", name], async () => {
    setColumnState({ columns: [{}], columnState: columnStates.LOADING });
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `query Columns { __type(name: "${tableName}") { fields { name }}}`,
      }),
    })
      .then((names) => names.json())
      .then((names) => {
        // GraphQL column names are returned under key "__type"
        return Object.values(names.data.__type.fields).map(
          (value: any) => value.name
        );
      });

    setColumnState({ columns: result, columnState: columnStates.READY });
    return result;
  });

  return (
    <>
      {columnState.columnState == columnStates.READY ? (
        // If there is data, display table
        <BaseTableData
          key={`table-${tableName}`}
          tableName={tableName}
          columns={columnState.columns}
          hasuraProps={hasuraProps}
          hasuraHeaders={hasuraHeaders}
          systemProps={systemProps}
          userConfig={userConfig}
          setUserConfig={setUserConfig}
          userConfigQueryInput={userConfigQueryInput}
          setUserConfigQueryInput={setUserConfigQueryInput}
        />
      ) : (
        <Loader />
      )}
    </>
  );
}

export default BaseTable;
