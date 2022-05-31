import { Table } from "antd";
import React from "react";
import { useQuery } from "react-query";
import { useTranslation } from "next-i18next";
import Loader from "../components/Loader";

/**
 * @param {*} { hasuraProps, columns, tableName }
 * @return {*}
 */
function BaseTableData({ hasuraProps, systemProps, columns, tableName }: any): any {
  const mediaDisplaySetting = systemProps.mediaDisplaySetting;
  const { t } = useTranslation();
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

  const { data: table } = useQuery(["tableQuery", tableName], async () => {
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `{ ${tableName} { ${columns} }}`,
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
              render: (row: any) => {
                // Check if the row contains an image
                if (typeof row == 'string' && mediaDisplaySetting == 'MEDIA' && (row.endsWith('.png') || row.endsWith('.jpeg') || row.endsWith('.gif'))) {
                  // Row contains image, so display it as an image 
                  return (
                    <img src={row}/>
                  );
                } else if (typeof row == 'string' && mediaDisplaySetting == 'MEDIA' && (row.endsWith('.mp4') || row.endsWith('.mp3'))) {
                  // Row contains video, so display it as a video
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
          columns = undefined;
          setTableState({
            data: res,
            columns: extractedColumns,
            columnsReady: true,
            dataState: dataState.READY,
          });
        }
      });
  }, { enabled: !!tableName });

  return (
    <>
      {tableState.dataState == dataState.READY ? (
        // If data is ready, show the user
        tableState.data && columns ? (
          // If there is data, display table
          <Table
            key={`tableData-${tableName}`}
            dataSource={tableState.data}
            columns={tableState.columns}
          />
        ) : (
          // If table is empty, tell the user
          <p>{t("basetable.warning")}</p>
        )
      ) : (
        //If data is still loading, display throbber
        <Loader/>
      )}
    </>
  );
}

export default BaseTableData;
