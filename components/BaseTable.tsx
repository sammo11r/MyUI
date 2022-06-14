import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";

import Loader from "../components/Loader";
import TableData from "../components/TableData";
import { columnStates } from "../const/enum";

/**
 * @param {*} {
 *   hasuraProps,
 *   systemProps,
 *   name,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   hasuraHeaders,
 *   encrypt
 *   gridViewToggle, 
 *   setGridViewToggle,
 *   t,
 * }
 * @return {*}  {*}
 */

function BaseTable({
  hasuraProps,
  systemProps,
  name,
  userConfig,
  setUserConfigQueryInput,
  hasuraHeaders,
  encrypt,
  gridViewToggle, 
  setGridViewToggle,
  t,
  mode
}: any): any {
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
        <TableData
          hasuraProps={hasuraProps}
          query={`{ ${tableName} { ${columnState.columns} }}`}
          style={null}
          systemProps={systemProps}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          name={name}
          dashboardName={null}
          hasuraHeaders={hasuraHeaders}
          encrypt={encrypt}
          t={t}
          isBaseTable={true}
          tableName={name}
          gridViewToggle={gridViewToggle}
          setGridViewToggle={setGridViewToggle}
          mode={mode}
        ></TableData>
      ) : (
        <Loader />
      )}
    </>
  );
}

export default BaseTable;
