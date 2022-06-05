import React, { useState } from "react";
import { useQuery } from "react-query";
import BaseTableData from "./BaseTableData";
import Loader from "../components/Loader"
import { useSession } from "next-auth/react";

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
  setUserConfigQueryInput
}: any) {
  enum columnStates { LOADING, READY }

  // Add state deciding whether to show loader or table
  const [columnState, setColumnState] = useState({
    columns: [{}],
    columnState: columnStates.LOADING,
  });

  // Fetching session token from the current session
  const { data: session } = useSession();
  const jwt = session!.token;

  const hasuraHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${jwt}`, // Adding auth header instead of using the admin secret
  } as HeadersInit;

  let tableName = name;

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
