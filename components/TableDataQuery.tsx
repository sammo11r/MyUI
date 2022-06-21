import React from "react";
import moment from "moment";
import { useQuery } from "react-query";
import {
  BaseTableType,
  DashboardElementType,
  DashboardType,
  QueryTableDataProps,
} from "../utils/customTypes";
import { loadingState } from "../consts/enum";
import { ColumnGroupType, ColumnType } from "rc-table/lib/interface";

/**
 * Replace null values by a replacement string
 *
 * @param {string|number} columnA
 * @param {string|number} columnB
 * @param {string|number} replacement
 * @return {*}  {{}}
 */
function replaceNull(
  columnA: string | number,
  columnB: string | number,
  replacement: string | number
): { columnA: string | number; columnB: string | number } {
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
 * @param {Array<any>} errors
 * @param {(arg0: string) => string} t
 */
const timeLimit = (errors: Array<any>, t: (arg0: string) => string): void => {
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
 * @param {QueryTableDataProps} {
 *   query,
 *   tableNameState,
 *   hasuraProps,
 *   hasuraHeaders,
 *   setTableState,
 *   isBaseTable,
 *   tableName,
 *   dashboardName,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   mediaDisplaySetting,
 *   gridViewToggle,
 *   t,
 *   elementName
 * }
 */
export function queryTableData({
  query,
  tableNameState,
  hasuraProps,
  hasuraHeaders,
  setTableState,
  isBaseTable,
  tableName,
  dashboardName,
  userConfig,
  setUserConfigQueryInput,
  mediaDisplaySetting,
  gridViewToggle,
  t,
  elementName,
}: QueryTableDataProps) {
  // Query the table data
  useQuery(["tableQuery", query, tableNameState, gridViewToggle], async () => {
    let response = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      body: JSON.stringify({
        query: query,
      }),
      headers: hasuraHeaders,
    })
      .then((res) => res.json())
      .then((res) => {
        // Succesful GraphQL query results have a 'data' field
        if (res && res.errors) {
          // Hasura returned an error, set table state
          setTableState({
            data: res.errors,
            columns: [],
            columnsReady: true,
            dataState: loadingState.READY,
          });
          // Inform the user of ways to prevent timeout errors if applicable
          if (res && res.errors) {
            timeLimit(res.errors, t);
          }
          return null;
        }
        // If the table is not a base table, get the table name from the data and return the reponse
        if (!isBaseTable) {
          return res.data[Object.keys(res.data)[0]];
        }
        // Return query data
        return res.data[tableName];
      })
      .then((res) => {
        if (res && res.length != 0) {
          let columnNames: string[] = [];
          let orderedColumn: string | undefined = undefined;
          let orderDirection: string | undefined = undefined;
          let tableConfig;
          let dashboardConfig: DashboardType;

          if (isBaseTable) {
            // If the query is called for a basetable, search for the basetable configuration
            tableConfig = userConfig.baseTables.filter(
              (baseTable: BaseTableType) => baseTable.name == tableName
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
              (dashboard: DashboardType) => dashboard.name == dashboardName
            )[0];
            let indexOfDashboard =
              userConfig.dashboards.indexOf(dashboardConfig);
            tableConfig = dashboardConfig.dashboardElements.filter(
              (element: DashboardElementType) => element.name == elementName
            )[0];
            let indexOfElement =
              dashboardConfig.dashboardElements.indexOf(tableConfig);

            if (tableConfig !== undefined) {
              if (tableConfig.ordering == undefined) {
                // If the table did not have an ordering yet, set the default ordering
                tableConfig["ordering"] = {
                  by: undefined,
                  direction: undefined,
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
                editable: true,
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
                    return (columnA as number) - (columnB as number);
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
                    return (columnA as string).localeCompare(columnB as string);
                  }
                },
                showSorterTooltip: false,
                // Set the default sorting according to the configuration
                defaultSortOrder:
                  columnName == orderedColumn ? orderDirection : null,
                render: (row: string) => {
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
          res.forEach(function (row: { key: string }, index: number) {
            row.key = index.toString();
          });

          setTableState({
            data: res,
            columns: extractedColumns as (
              | ColumnGroupType<{ key: string }>
              | ColumnType<{ key: string }>
            )[],
            columnsReady: true,
            dataState: loadingState.READY,
          });
        } else {
          let columns: {}[] = [];

          if (res != null) {
            // Queried data is empty, show empty tamble with the column headers
            // Retrieve the column names from the query
            let columNames = query.slice(
              query.lastIndexOf("{") + 1,
              query.indexOf("}")
            );
            // Put the names in an array
            let columNamesArray = columNames.split(",");

            columNamesArray.forEach(function (name: string) {
              columns.push({ title: name, dataIndex: name, key: name });
            });
          }

          setTableState({
            data: undefined,
            columns: columns,
            columnsReady: true,
            dataState: loadingState.READY,
          });
          return null;
        }
      });
  });
}
