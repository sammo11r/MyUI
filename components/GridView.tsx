import React, { useState } from "react";
import { Table } from "antd";
import { useQuery } from "react-query";
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
 *   setUserConfigQueryInput 
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
  setUserConfigQueryInput 
}: any) {
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
    false, 
    systemProps.mediaDisplaySetting, 
    hasuraProps, 
    query, 
    userConfig, 
    setUserConfig,
    setUserConfigQueryInput,
    tableState,
    setTableState,
    dataState,
    null
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
            key={`tableData`} // TODO: make key unique
            dataSource={tableState.data}
            columns={tableState.columns}
            onChange={ function(pagination, filters, sorter: SorterResult<RecordType> | SorterResult<RecordType>[]) {
              // // Get the current table configuration
              // const tableConfig = userConfig.baseTables.filter((baseTable: any) => baseTable.name == tableName)[0];

              // // Remove the table configuration
              // userConfig.baseTables = userConfig.baseTables.filter((baseTable: any) => baseTable.name != tableName);
              
              // // Set the ordering
              // tableConfig.ordering.by = (sorter as SorterResult<RecordType>).field;
              // tableConfig.ordering.direction = (sorter as SorterResult<RecordType>).order;

              // @TODO Push the updated table configuration to the user's configuration
              // userConfig.baseTables.push(tableConfig);
              // setUserConfigQueryInput(userConfig);
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
