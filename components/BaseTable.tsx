import React, { useState } from "react";
import { useQuery } from "react-query";

import Loader from "../components/Loader";
import TableData from "../components/TableData";
import { loadingState } from "../consts/enum";
import { BaseTableProps } from "../utils/customTypes";

/**
 * @param {BaseTableProps} {
 *   hasuraProps,
 *   systemProps,
 *   name,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   hasuraHeaders,
 *   encrypt,
 *   gridViewToggle,
 *   setGridViewToggle,
 *   t,
 *   mode
 * }
 * @return {*}  {JSX.Element}
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
  mode,
}: BaseTableProps): JSX.Element {
  // Add state deciding whether to show loader or table
  const [columnState, setColumnState] = useState({
    columns: [{}],
    columnState: loadingState.LOADING,
  });

  // Get the columns of the base table
  useQuery(["columnQuery", name], async () => {
    setColumnState({ columns: [{}], columnState: loadingState.LOADING });
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `query Columns { __type(name: "${name}") { fields { name }}}`,
      }),
    })
      .then((names) => names.json())
      .then((names) => {
        // GraphQL column names are returned under key "__type"
        return Object.values(names.data.__type.fields).map(
          (value: any) => value.name
        );
      });

    setColumnState({ columns: result, columnState: loadingState.READY });
    setGridViewToggle(!gridViewToggle);
  });

  return (
    <>
      {columnState.columnState == loadingState.READY ? (
        <TableData
          hasuraProps={hasuraProps}
          query={`{ ${name} { ${columnState.columns} }}`}
          style={undefined}
          systemProps={systemProps}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          dashboardName={""}
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
        <Loader testid="baseTable-loader"/>
      )}
    </>
  );
}

export default BaseTable;
