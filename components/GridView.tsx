import React from "react";
import { Table } from "antd";
import { useQuery } from "react-query";
import Loader from "../components/Loader";


function GridView({ hasuraProps, query, style, rowsPerPage }: any) {
  enum dataState {
    LOADING,
    READY,
  }
  // Add state deciding whether to show loader or table
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
  useQuery(["tableQuery", query], async () => {
    await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        // Succesful GraphQL query results have a 'data' field
        if (!res || !res.data) return null;
        let tableName = Object.keys(res.data)[0]; // TODO: how do we handle multiple tables?
        return res.data[tableName];
      })
      .then((res) => {
        if (res) {
          let extractedColumns = Object.keys(res[0]).map((columnName) => {
            return {
              title: columnName,
              dataIndex: columnName,
              key: columnName,
              render: (row: any) => {
                // Check if the row contains an image
                if (typeof row == 'string' && (row.endsWith('.png') || row.endsWith('.jpeg') || row.endsWith('.gif'))) {
                  // Row contains image, so display it as an image 
                  return (
                    <img src={row}/>
                  );
                } else if (typeof row == 'string' && (row.endsWith('.mp4') || row.endsWith('.mp3'))) {
                  return (
                    <video width="320" height="240" controls>
                      <source src={row} type="video/mp4"/>
                    </video>
                  );
                } else {
                  return (
                    row
                  );
                }
             }
            };
          });
          //columns = undefined;
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
    <div style={style} >
      {tableState.dataState == dataState.READY ? (
        // If data is ready, show the user
        tableState.data ? (
          // If there is data, display table
          <Table
            pagination={{ pageSize: rowsPerPage }}
            size="small" // TODO: Make this customizable by user
            key={`tableData`} // TODO: make key unique
            dataSource={tableState.data}
            columns={tableState.columns}
          />
        ) : (
          // If table is empty, tell the user
          <p>No data</p>
        )
      ) : (
        //If data is still loading, display throbber
        <Loader/>
      )}
    </div>
  );
}

export default GridView;

/**
 * @export
 * @param {*} context
 * @return {*} 
 */
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
