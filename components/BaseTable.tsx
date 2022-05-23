import { Table } from "antd";
import React from "react";
import { useQuery } from "react-query";
import BaseTableData from "./BaseTableData";

function BaseTable({ hasuraProps, name }: any) {
  console.log(`rendering base table header ${name}!`);
  enum columnStates {
    LOADING,
    READY,
  }
  //Add state deciding whether to show loader or table
  const [columnState, setColumnState] = React.useState({
    columns: [{}],
    columnState: columnStates.LOADING,
  });
  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  let tableName = name;

  useQuery("columnQuery", async () => {
    setColumnState({ columns: [{}], columnState: columnStates.LOADING });
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `
query Columns {
__type(name: "${tableName}") {
fields {
name
}
}
}
`,
      }),
    })
      .then((names) => names.json())
      .then((names) => {
        //GraphQL column names are returned under key "__type"
        return Object.values(names.data.__type.fields).map(
          (value: any) => {
            return {
              title: value.name,
              dataIndex: value.name,
              key: value.name,
            };
          });
      });

    setColumnState({ columns: result, columnState: columnStates.READY });
    return result;
  });

  return (
    <div>
      {columnState.columnState == columnStates.READY ? (
        //If there is data, display table
        <BaseTableData
          key={`table-${tableName}`}
          tableName={tableName}
          columns={columnState.columns}
          hasuraProps={hasuraProps}
        />
      ) : (
        //If data is still loading, display throbber
        <p>Loading</p>
      )}
    </div>
  );
}

export default BaseTable;

export function getServerSideProps(context: any) {
  const hasuraProps = {
    hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as String,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as
      | RequestInfo
      | URL,
  };
  return {
    props: {
      hasuraProps,
    },
  };
}
