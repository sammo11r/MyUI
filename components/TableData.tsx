import React, { useState } from "react";
import { Table } from "antd";
import { SorterResult } from "antd/lib/table/interface";
import { useQuery } from "react-query";
import moment from "moment";

import Loader from "../components/Loader";
import { columnStates } from "../const/enum";

import AddDeleteRowMenu from "../components/AddDeleteRowMenu";

/**
 * Replace null values by a replacement string
 *
 * @param {string} columnA
 * @param {string} columnB
 * @param {string} replacement
 * @return {*}
 */
function replaceNull(columnA: any, columnB: any, replacement: any): any {
  if (columnA == null) {
    columnA = replacement;
  }

  if (columnB == null) {
    columnB = replacement;
  }

  return { columnA, columnB };
}

/**
 * @export
 * @param {*} {
 *   isBaseTable,
 *   hasuraProps,
 *   hasuraHeaders,
 *   systemProps,
 *   tableName,
 *   query,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   name,
 *   dashboardName,
 *   style,
 *   t
 * }
 * @return {*}  {*}
 */
export default function TableData({
  isBaseTable,
  hasuraProps,
  hasuraHeaders,
  systemProps,
  tableName,
  query,
  userConfig,
  setUserConfigQueryInput,
  name,
  dashboardName,
  style,
  t,
  columns
}: any): any {
  const mediaDisplaySetting = systemProps.mediaDisplaySetting;
  // State deciding whether to show loader or table for grid views and base tables
  const [tableState, setTableState] = useState({
    data: undefined,
    columns: [{}],
    columnsReady: false,
    dataState: columnStates.LOADING,
  });

  /**
   * Alert the user of ways to prevent timeout errors when one occurs
   *
   * @param {Array} errors
   * @return {*}
   */
  const timeLimit = (errors: Array<any>): any => {
    errors.forEach(function (error) {
      if (error.message && error.message == "The operation exceeded the time limit allowed for this project") {
        alert(t(`dashboard.queryerror.timelimit`))
      }
    })
  }

  // Query the table data
  useQuery(["tableQuery", query, tableName], async () => {
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
          // Hasura returned an error, set table state
          setTableState({
            data: undefined,
            columns: [],
            columnsReady: true,
            dataState: columnStates.READY,
          });
          // Inform the user of ways to prevent timeout errors if applicable
          if (res && res.errors) {
            timeLimit(res.errors)
          }
          return null;
        }
        // If the table is not a base table, get the table name from the data and return the reponse
        if (!isBaseTable) {
          return res.data[Object.keys(res.data)[0]]; // TODO: how do we handle multiple tables?
        }
        // Return query data
        return res.data[tableName];
      })
      .then((res) => {
        if (res && res.length != 0) {
          let columnNames: string[] = [];
          let orderedColumn: string | null = null;
          let orderDirection: string | null = null;
          let tableConfig;
          let dashboardConfig;

          if (isBaseTable) {
            // If the query is called for a basetable, search for the basetable configuration
            tableConfig = userConfig.baseTables.filter(
              (baseTable: any) => baseTable.name == tableName
            )[0];

            if (tableConfig !== undefined) {
              // If the table is defined, get the ordering for this table
              orderedColumn = tableConfig.ordering.by;
              orderDirection = tableConfig.ordering.direction;
            } else {
              // If the base table does not exist in the configuration, add it
              userConfig.baseTables.push({
                name: tableName,
                columnNames: columnNames,
                ordering: {
                  by: "",
                  direction: "",
                },
              });
              setUserConfigQueryInput(userConfig);
            }
          } else {
            // If the query is called for a dashboard element, search for the dashboard grid view element configuration
            dashboardConfig = userConfig.dashboards.filter(
              (dashboard: any) => dashboard.name == dashboardName
            )[0];
            let indexOfDashboard =
              userConfig.dashboards.indexOf(dashboardConfig);
            tableConfig = dashboardConfig.dashboardElements.filter(
              (element: any) => element.name == tableName
            )[0];
            let indexOfElement =
              dashboardConfig.dashboardElements.indexOf(tableConfig);

            if (tableConfig !== undefined) {
              if (tableConfig.ordering == undefined) {
                // If the table did not have an ordering yet, set the default ordering
                tableConfig["ordering"] = {
                  by: "",
                  direction: "",
                };
                // Update the user configuration state variable
                userConfig.dashboards[indexOfDashboard].dashboardElements[
                  indexOfElement
                ] = tableConfig;
              } else {
                // Get the ordering for this table
                orderedColumn = tableConfig.ordering.by;
                orderDirection = tableConfig.ordering.direction;
              }
            }
          }

          // Retrieve column names from the table
          let extractedColumns = Object.keys(res[0]).map(
            (columnName, index) => {
              columnNames.push(columnName);
              return {
                title: columnName,
                dataIndex: columnName,
                key: columnName + index, // Make sure the key is unique
                sorter: (a: any, b: any) => {
                  // Define possible date formats
                  var formats = [moment.ISO_8601, "MM/DD/YYYY  :)  HH*mm*ss"];

                  // Check the type of the column to determine the ordering
                  if (
                    typeof a[columnName] == "number" &&
                    typeof a[columnName] == "number"
                  ) {
                    // Replace null number columns by a big number to make ordering possible
                    const { columnA, columnB } = replaceNull(
                      a[columnName],
                      b[columnName],
                      999999
                    );
                    // Order numbers in numerical order
                    return columnA - columnB;
                  } else if (moment(a[columnName], formats, true).isValid()) {
                    // Replace null date columns by a future date to make ordering possible
                    const { columnA, columnB } = replaceNull(
                      a[columnName],
                      b[columnName],
                      "2092-05-31"
                    );
                    // Order dates in chronological order
                    let dateA: any = new Date(columnA);
                    let dateB: any = new Date(columnB);
                    return dateA - dateB;
                  } else {
                    // Replace null string columns by a 'z' to make ordering possible
                    const { columnA, columnB } = replaceNull(
                      a[columnName],
                      b[columnName],
                      "z"
                    );
                    // Order text in alphabetical order
                    return columnA.localeCompare(columnB);
                  }
                },
                showSorterTooltip: false,
                // Set the default sorting according to the configuration
                defaultSortOrder:
                  columnName == orderedColumn ? orderDirection : null,
                render: (row: any) => {
                  // Check if the row contains an image
                  if (
                    typeof row == "string" &&
                    mediaDisplaySetting == "MEDIA" &&
                    (row.endsWith(".png") ||
                      row.endsWith(".jpeg") ||
                      row.endsWith(".jpg") ||
                      row.endsWith(".gif"))
                  ) {
                    // Row contains image, so display it as an image
                    return <img src={row} width="auto" height="240" />;
                  } else if (
                    typeof row == "string" &&
                    mediaDisplaySetting == "MEDIA" &&
                    (row.endsWith(".mp4") || row.endsWith(".mp3"))
                  ) {
                    // Row contains video, so display it as a video
                    return (
                      <video width="auto" height="240" controls>
                        <source src={row} type="video/mp4" />
                      </video>
                    );
                  } else {
                    // Row contains text, display it as a normal string
                    return row;
                  }
                },
              };
            }
          );

          // Give every row a unique key
          res.forEach(function (row: any, index: number) {
            row.key = index;
          });

          setTableState({
            data: res,
            columns: extractedColumns,
            columnsReady: true,
            dataState: columnStates.READY,
          });
        } else {
          // The table is empty, show the error
          setTableState({
            data: undefined,
            columns: [],
            columnsReady: true,
            dataState: columnStates.READY,
          });
          return null;
        }
      });
  });

  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRow, setSelectedRow] = useState(['']);

  const rowSelection: any = {
    // Get selected rows on
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows);
    }
  };

  // Display the amount of retrieved rows and columns in the table's footer
  const setFooter = () => {
    if (tableState.data) {
      const rows = tableState.data.length
      const columns = tableState.columns.length
      return `${t("table.rowCount")}: ${rows} | ${t("table.columnCount")}: ${columns}`
    }
  }

  type RecordType = {
    field: string;
    order: string;
  };

  return (
    <div style={style}>
      {tableState.dataState == columnStates.READY ? (
        // If data is ready, show the user
        tableState.data ? (
          // If there is data, display table
          <>
          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            size="small"
            key={name}
            dataSource={tableState.data}
            columns={tableState.columns}
            footer={setFooter}
            onChange={function (
              pagination,
              filters,
              sorter: SorterResult<RecordType> | SorterResult<RecordType>[],
              extra: any
            ) {
              if (extra.action == "sort") {
                if (isBaseTable) {
                  // Get the current table configuration
                  const baseTableConfig = userConfig.baseTables.filter(
                    (baseTable: any) => baseTable.name == tableName
                  )[0];
                  let indexOfBaseTable =
                    userConfig.baseTables.indexOf(baseTableConfig);

                  // Udate the ordering
                  baseTableConfig.ordering.by = (
                    sorter as SorterResult<RecordType>
                  ).field;
                  baseTableConfig.ordering.direction = (
                    sorter as SorterResult<RecordType>
                  ).order;

                  // Update the base table configuration
                  userConfig.baseTables[indexOfBaseTable] = baseTableConfig;
                } else {
                  // Get the current table configuration
                  let currentDashboardConfig = userConfig.dashboards.filter(
                    (dashboard: any) => dashboard.name == dashboardName
                  )[0];
                  let indexOfDashboard = userConfig.dashboards.indexOf(
                    currentDashboardConfig
                  );
                  let tableConfig =
                    currentDashboardConfig.dashboardElements.filter(
                      (element: any) => element.name == name
                    )[0];
                  let indexOfElement =
                    currentDashboardConfig.dashboardElements.indexOf(
                      tableConfig
                    );

                  // Update the ordering if the table configuration is defined
                  // If the table configuration is not defined, do not update orderings yet, as the user is still in edit mode with an unsaved table
                  if (tableConfig !== undefined) {
                    tableConfig.ordering.by = (
                      sorter as SorterResult<RecordType>
                    ).field;
                    tableConfig.ordering.direction = (
                      sorter as SorterResult<RecordType>
                    ).order;

                    // Update the base table configuration
                    userConfig.dashboards[indexOfDashboard].dashboardElements[
                      indexOfElement
                    ] = tableConfig;
                  }
                }
                setUserConfigQueryInput(userConfig);
              }
            }}
          />
          <AddDeleteRowMenu
            hasuraProps={hasuraProps}
            columns={tableState.columns}
            tableName={tableName}
            selectedRow={selectedRow}
          >
          </AddDeleteRowMenu>
        </>
        ) : (
          // If table is empty, warn the user
          <p>{t("basetable.warning")}</p>
        )
      ) : (
        //If data is still loading, display throbber
        <Loader />
      )}
    </div>
  );
}
