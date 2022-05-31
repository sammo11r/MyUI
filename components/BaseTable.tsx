import React from "react";
import { useQuery } from "react-query";
import BaseTableData from "./BaseTableData";
import Loader from "../components/Loader"

/**
 * @param {*} { hasuraProps, name }
 * @return {*} 
 */
function BaseTable({ hasuraProps, systemProps, name }: any) {
  enum columnStates {
    LOADING,
    READY,
  }

  // Add state deciding whether to show loader or table
  const [columnState, setColumnState] = React.useState({
    columns: [{}],
    columnState: columnStates.LOADING,
  });

  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
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
          systemProps={systemProps}
        />
      ) : (
        <Loader />
      )}
    </>
  );
}

export default BaseTable;
