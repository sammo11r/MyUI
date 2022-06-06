import React, { useState } from "react";
import { Table } from "antd";
import { useTranslation } from "next-i18next";

import Loader from "../components/Loader";
import { parseTableData } from "../components/BaseTableData"
import { SorterResult } from "antd/lib/table/interface";

/**
 * @param {*} {
 *   hasuraProps,
 *   query,
 *   style,
 *   rowsPerPage,
 *   systemProps,
 *   userConfig,
 *   setUserConfig,
 *   setUserConfigQueryInput,
 *   name,
 *   dashboardName,
 *   hasuraHeaders
 * }
 * @return {*} 
 */
function GridView({
  hasuraProps,
  query,
  style,
  rowsPerPage,
  systemProps,
  userConfig,
  setUserConfig,
  setUserConfigQueryInput,
  name,
  dashboardName,
  hasuraHeaders
}: any): any {
  const { t } = useTranslation();
  enum dataState { LOADING, READY };

  // Add state deciding whether to show loader or table
  const [tableState, setTableState] = useState({
    data: undefined,
    columns: [{}],
    columnsReady: false,
    dataState: dataState.LOADING,
  });

  parseTableData(
    false, 
    systemProps.mediaDisplaySetting, 
    hasuraProps, 
    query, 
    userConfig, 
    setUserConfigQueryInput,
    setTableState,
    dataState,
    name,
    dashboardName,
    hasuraHeaders
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
    <div style={style} >
      {tableState.dataState == dataState.READY ? (
        // If data is ready, show the user
        tableState.data ? (
          // If there is data, display table
          <Table
            pagination={{ pageSize: rowsPerPage }}
            rowSelection={{
              type: selectionType,
              ...rowSelection,
            }}
            size="small" // TODO: Make this customizable by user
            key={name}
            dataSource={tableState.data}
            columns={tableState.columns}
            onChange={ function(pagination, filters, sorter: SorterResult<RecordType> | SorterResult<RecordType>[], extra: any) {
              if (extra.action == 'sort') {
                // Get the current table configuration
                let currentDashboardConfig = userConfig.dashboards.filter((dashboard: any) => dashboard.name == dashboardName)[0];
                let indexOfDashboard = userConfig.dashboards.indexOf(currentDashboardConfig);
                let tableConfig = currentDashboardConfig.dashboardElements.filter((element: any) => element.name == name)[0];
                let indexOfElement =  currentDashboardConfig.dashboardElements.indexOf(tableConfig);

                // Update the ordering if the table configuration is defined
                // If the table configuration is not defined, do not update orderings yet, as the user is still in edit mode with an unsaved table
                if (tableConfig !== undefined) {
                  tableConfig.ordering.by = (sorter as SorterResult<RecordType>).field;
                  tableConfig.ordering.direction = (sorter as SorterResult<RecordType>).order;

                  // Update the base table configuration
                  userConfig.dashboards[indexOfDashboard].dashboardElements[indexOfElement] = tableConfig;
                  setUserConfigQueryInput(userConfig);
                }
              }
            }}
          />
        ) : (
          // If table is empty, warn the user
          <p>{t("basetable.warning")}</p>
        )
      ) : (
        //If data is still loading, display throbber
        <Loader/>
      )}
    </div>
  );
}

export default GridView;
