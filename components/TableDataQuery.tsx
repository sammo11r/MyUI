import React from "react";
import moment from "moment";
import { useQuery } from "react-query";

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
 * Alert the user of ways to prevent timeout errors when one occurs
 *
 * @param {Array} errors
 * @return {*}
 */
const timeLimit = (errors: Array<any>, t: any): any => {
  errors.forEach(function (error) {
    if (
      error.message &&
      error.message ==
        "The operation exceeded the time limit allowed for this project"
    ) {
      alert(t(`dashboard.queryerror.timelimit`));
    }
  });
};

/**
 * @export
 * @param {*} {
 *   query,
 *   tableNameState,
 *   hasuraProps,
 *   hasuraHeaders,
 *   setTableState,
 *   columnStates,
 *   isBaseTable,
 *   tableName,
 *   dashboardName,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   mediaDisplaySetting,
 *   t
 * }
 */
export function queryTableData({
  query,
  tableNameState,
  hasuraProps,
  hasuraHeaders,
  setTableState,
  columnStates,
  isBaseTable,
  tableName,
  dashboardName,
  userConfig,
  setUserConfigQueryInput,
  mediaDisplaySetting,
  gridViewToggle, 
  t,
}: any) {
  // Query the table data
  useQuery(["tableQuery", query, tableNameState, gridViewToggle], async () => {
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
            timeLimit(res.errors, t);
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
                editable: true, // @TODO,
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
            row.key = index.toString();
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
}
