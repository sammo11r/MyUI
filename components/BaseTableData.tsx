import React, { useState } from "react";
import { Table } from "antd";
import { SorterResult } from "antd/lib/table/interface";
import { useQuery } from "react-query";
import moment from "moment";
import { useTranslation } from "next-i18next";
import Loader from "../components/Loader";

/**
 * Replace null by a replacement string
 *
 * @param {string} columnA
 * @param {string} columnB
 * @param {string} replacement
 * @return {*} 
 */
function replaceNull(columnA: any, columnB: any, replacement: any) {
  if (columnA == null) {
    columnA = replacement;
  } 
  
  if (columnB == null) {
    columnB = replacement;
  }

  return {columnA, columnB};
}

/**
 * Parse table data in an Ant Design table component
 *
 * @export
 * @param {*} isBaseTable
 * @param {*} mediaDisplaySetting
 * @param {*} hasuraProps
 * @param {string} query
 * @param {*} userConfig
 * @param {*} setUserConfig
 * @param {*} setUserConfigQueryInput
 * @param {*} tableState
 * @param {*} setTableState
 * @param {*} dataState
 * @param {(string|null)} tableName
 */
export function parseTableData(
  isBaseTable: any,
  mediaDisplaySetting: any,
  hasuraProps: any,
  query: string,
  userConfig: any,
  setUserConfig: any,
  setUserConfigQueryInput: any,
  tableState: any,
  setTableState: any,
  dataState: any,
  tableName: string|null
) {
  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  useQuery(["tableQuery", query], async () => {
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
         // Succesful GraphQL query results have a 'data' field
        if (!res || !res.data) {
          setTableState({
            data: null,
            columns: null,
            columnsReady: true,
            dataState: dataState.READY,
          });
          return null;
        }
        if (tableName == null) {
          tableName = Object.keys(res.data)[0]; // TODO: how do we handle multiple tables?
        }
        return res.data[tableName];
      })
      .then((res) => {
        if (res) {
          let columnNames: string[] = [];
          let tableConfig;

          if (isBaseTable) {
            // If the query is called for a basetable, search for the basetable configuration
            tableConfig = userConfig.baseTables.filter((baseTable: any) => baseTable.name == tableName);
          } else {
            // If the query is called for a dashboard element, search for the dashboard grid view element configuration
            // @TODO: Change
            tableConfig = null;
          }

          let orderedColumn: string|null = null;
          let orderDirection: string|null = null;

          // Check if the table configuration exists in the user's configuration
          if (isBaseTable && tableConfig.length !== 0) {
            tableConfig = tableConfig[0]
            // Define the ordering for this table
            orderedColumn = tableConfig.ordering.by;
            orderDirection = tableConfig.ordering.direction;
          }

          // Retrieve column names from the table
          let extractedColumns = Object.keys(res[0]).map((columnName, index) => {
            columnNames.push(columnName);

            return {
              title: columnName,
              dataIndex: columnName,
              key: columnName + index, // Make sure the key is unique
              sorter: (a: any, b: any) => {
                // Define possible date formats
                var formats = [
                  moment.ISO_8601,
                  "MM/DD/YYYY  :)  HH*mm*ss"
                ]; 

                // Check the type of the column to determine the ordering
                if (typeof a[columnName] == 'number' && typeof a[columnName] == 'number') {
                  const {columnA, columnB} = replaceNull(a[columnName], b[columnName], 999)
                  // Order numbers in numerical order
                  return columnA - columnB;
                } else if (moment(a[columnName], formats, true).isValid()) {
                  const {columnA, columnB} = replaceNull(a[columnName], b[columnName], '2092-05-31')
                  // Order dates in chronological order
                  let dateA: any = new Date(columnA);
                  let dateB: any = new Date(columnB);
                  return dateA - dateB;
                } else {
                  const {columnA, columnB} = replaceNull(a[columnName], b[columnName], 'z')
                  // Order text in alphabetical order
                  return columnA.localeCompare(columnB);
                }
              },
              showSorterTooltip: false,
              // Set the default sorting according to the configuration
              defaultSortOrder: columnName == orderedColumn ? orderDirection : null,
              render: (row: any) => {
                // Check if the row contains an image
                if (typeof row == 'string' && mediaDisplaySetting == 'MEDIA' && (row.endsWith('.png') || row.endsWith('.jpeg') || row.endsWith('.jpg') || row.endsWith('.gif'))) {
                  // Row contains image, so display it as an image 
                  return (
                    <img src={row} width="auto" height="240"/>
                  );
                } else if (typeof row == 'string' && mediaDisplaySetting == 'MEDIA' && (row.endsWith('.mp4') || row.endsWith('.mp3'))) {
                  // Row contains video, so display it as a video
                  return (
                    <video width="auto" height="240" controls>
                      <source src={row} type="video/mp4"/>
                    </video>
                  );
                } else {
                  // Row contains text, display it as a normal string
                  return (
                    row
                  );
                }
             }
            };
          });

          // Give every row a unique key
          res.forEach(function (row: any, index: number) {
            row.key = index;
          }); 

          setTableState({
            data: res,
            columns: extractedColumns,
            columnsReady: true,
            dataState: dataState.READY,
          });

          // If the base table does not exist in the configuration, add it
          let existsInConfiguration = userConfig.baseTables.filter((baseTable: any) => baseTable.name == tableName).length != 0
          if (!existsInConfiguration && isBaseTable) { // @TODO: Change such that dashboard grid views are also saved
            userConfig.baseTables.push(
              {
                "name": tableName,
                "columnNames": columnNames,
                "ordering": {
                  "by": "",
                  "direction": ""
                }
              }
            );
            setUserConfigQueryInput(userConfig);
          }        
        }
      })
  });
}

/**
 * @param {*} {
 *   hasuraProps, 
 *   systemProps,
 *   columns,
 *   tableName,
 *   userConfig,
 *   setUserConfig,
 *   userConfigQueryInput,
 *   setUserConfigQueryInput 
 * }
 * @return {*}  {*}
 */
function BaseTableData({
  hasuraProps, 
  systemProps,
  columns,
  tableName,
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput 
}: any): any {
  const { t } = useTranslation();
  
  enum dataState {
    LOADING,
    READY,
  }

  // Add state deciding whether to show loader or table
  const [tableState, setTableState] = useState({
    data: undefined,
    columns: [{}],
    columnsReady: false,
    dataState: dataState.LOADING,
  });

  parseTableData(
    true, 
    systemProps.mediaDisplaySetting, 
    hasuraProps, 
    `{ ${tableName} { ${columns} }}`, 
    userConfig, 
    setUserConfig,
    setUserConfigQueryInput,
    tableState,
    setTableState,
    dataState,
    tableName
  );

  const [selectionType, setSelectionType] = useState('checkbox');

  const rowSelection: any = {
    // Get selected rows on
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    }
  };

  type RecordType = {
    field: string;
    order: string;
  }

  return (
    <>
      {tableState.dataState == dataState.READY ? (
        // If data is ready, show the user
        tableState.data && columns ? (
          // If there is data, display table
          <Table
            key={`tableData-${tableName}`}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            dataSource={tableState.data}
            columns={tableState.columns}
            onChange={ function(pagination, filters, sorter: SorterResult<RecordType> | SorterResult<RecordType>[]) {
              // Get the current table configuration
              const tableConfig = userConfig.baseTables.filter((baseTable: any) => baseTable.name == tableName)[0];

              // Remove the table configuration
              userConfig.baseTables = userConfig.baseTables.filter((baseTable: any) => baseTable.name != tableName);
              
              // Set the ordering
              tableConfig.ordering.by = (sorter as SorterResult<RecordType>).field;
              tableConfig.ordering.direction = (sorter as SorterResult<RecordType>).order;

              // Push the updated table configuration to the user's configuration
              userConfig.baseTables.push(tableConfig);
              setUserConfigQueryInput(userConfig);
            }}
          />
        ) : (
          // If table is empty, tell the user
          <p>{t("basetable.warning")}</p>
        )
      ) : (
        // If data is still loading, display throbber
        <Loader/>
      )}
    </>
  );
}

export default BaseTableData;
