import { Table } from "antd";
import React from "react";
import { useQuery } from "react-query";

function BaseTableData({ hasuraProps, columns, tableName }: any) {
  console.log(`rendering base table data ${tableName}!`);
  enum dataState {
    LOADING,
    READY,
  }
  //Add state deciding whether to show loader or table
  const [tableState, setTableState] = React.useState({
    data: undefined,
    columns: [{}],
    columnsReady: false,
    dataState: dataState.LOADING,
  });
  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  const { data: table } = useQuery("tableQuery", async () => {
    console.log("started query 2");
    console.log(tableName, columns);
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `
        {
          ${tableName} {
            ${columns}
          }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (!res || !res.data) return null;
        return res.data[tableName];
      })
      .then((res) => {
        if (res) {
          let extractedColumns = Object.keys(res[0]).map((columnName) => {
            return {
              title: columnName,
              dataIndex: columnName,
              key: columnName,
            };
          });
          columns = undefined;
          setTableState({
            data: res,
            columns: extractedColumns,
            columnsReady: true,
            dataState: dataState.READY,
          });
        }
      });
  });

  return (
    <div>
      {tableState.dataState == dataState.READY ? (
        //If data is ready, show the user
        tableState.data && columns ? (
          //If there is data, display table
          <Table
            key={`tableData-${tableName}`}
            dataSource={tableState.data}
            columns={tableState.columns}
          />
        ) : (
          //If table is empty, tell the user
          <p>No data</p>
        )
      ) : (
        //If data is still loading, display throbber
        <p>Loading</p>
      )}
    </div>
  );
}

export default BaseTableData;

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
