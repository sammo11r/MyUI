import React, { useState } from "react";
import { Alert, Form, Popconfirm, Table, Typography } from "antd";
import { SorterResult } from "antd/lib/table/interface";
import {
  CloseOutlined,
  EditOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import Loader from "../components/Loader";
import { columnStates, workspaceStates } from "../const/enum";
import AddDeleteRowMenu from "../components/AddDeleteRowMenu";
import EditableCell from "../components/EditableCell";
import {
  checkEditPermissions,
  updateRowQuery,
} from "../components/EditRowsQueries";
import { queryTableData } from "../components/TableDataQuery";

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
 *   encrypt,
 *   t,
 *   gridViewToggle,
 *   setGridViewToggle,
 *   columns,
 *   mode
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
  encrypt,
  t,
  gridViewToggle,
  setGridViewToggle,
  columns,
  mode
}: any): any {
  const mediaDisplaySetting = systemProps.mediaDisplaySetting;
  // State deciding whether to show loader or table for grid views and base tables
  const [tableState, setTableState] = useState({
    data: undefined,
    columns: [{}],
    columnsReady: false,
    dataState: columnStates.LOADING,
  });

  const [editable, setEditable] = useState(false);
  const [alert, setAlert] = useState(false);
  const [alertText, setAlertText] = useState(false);
  const [editRowQueryInput, setEditRowQueryInput] = useState<string>();
  const [tableNameState, setTableNameState] = useState(tableName);

  const [editRowForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: any) => record.key === editingKey;

  const cancelEdit = () => {
    setEditingKey("");
  };

  /**
   * @param {*} record
   */
  const saveEdit = async (record: any, query: any) => {
    try {
      const input = await editRowForm.validateFields();
      let queryInput: any = {};

      // Compare updated input vs the old input
      for (const key in record) {
        // Check if the input value for the column has changed
        if (record[key] != input[key] && input[key] != undefined) {
          queryInput[key] = input[key];
        }
      }

      // Check if there are any changes in the input
      if (Object.keys(queryInput).length > 0) {
        let updateQuery;
        // Construct query
        if (isBaseTable) {
          updateQuery = `mutation update { update_${tableName} ( where: {`;
        } else {
          // If the table is a gridview, retriee the table name from the query
          let tableName = query
            .substring(query.indexOf("{") + 1, query.lastIndexOf("{"))
            .replace(/\s/g, "");
          updateQuery = `mutation update { update_${tableName} ( where: {`;
        }

        if (tableName == 'users' && queryInput.hasOwnProperty('password')) {
          await encrypt({
            password: queryInput['password'],
          }).then((res: any) => {
            queryInput['password'] = res.encryptedPassword;
          });
        }

        // Define search parameters for entity
        for (const key in record) {
          if (key != "key" && record[key] !== null) {
            updateQuery += `${key}: {_eq: "${record[key]}"},`;
          }
        }

        updateQuery = updateQuery.slice(0, -1) + `} _set: {`; // Remove last comma

        // Define new values
        for (const key in queryInput) {
          updateQuery += `${key}: "${queryInput[key]}",`;
        }

        updateQuery =
          updateQuery.slice(0, -1) +
          `}) { returning { ${Object.keys(record)[0]} }}}`; // Remove last comma
        setEditRowQueryInput(updateQuery);
      } else {
        setEditingKey(""); // Close edit menu
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  /**
   * Set default values of the edit
   *
   * @param {*} record
   */
  const edit = (record: any) => {
    editRowForm.setFieldsValue(record);
    setEditingKey(record.key);
  };

  updateRowQuery({
    editRowQueryInput,
    hasuraProps,
    hasuraHeaders,
    editRowForm,
    setEditingKey,
    setTableNameState,
    setEditRowQueryInput,
    setAlert,
    setAlertText,
    gridViewToggle,
    setGridViewToggle,
    t,
  });

  // Check the edit permission for this table
  checkEditPermissions({
    isBaseTable,
    hasuraProps,
    hasuraHeaders,
    setEditable,
    name,
    mode,
    gridViewToggle,
  });

  queryTableData({
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
  });

  const mergedColumns = tableState.columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record: any) => ({
        record,
        inputType: typeof col.dataIndex == "string" ? "text" : "number", //TODO
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  // If at least one column is editable by the logged in user
  // Show the action panel with the edit button
  if (editable) {
    mergedColumns.push({
      title: <EllipsisOutlined />,
      dataIndex: "operation",
      render: (_: any, record: any): JSX.Element => {
        const userIsEditing = isEditing(record);
        return userIsEditing ? (
          <span>
            <Typography.Link
              onClick={() => saveEdit(record, query)}
              style={{
                marginRight: 8,
              }}
            >
              <SaveOutlined />
            </Typography.Link>
            <Popconfirm
              title={t(`table.cancelConfirmation`)}
              cancelText={t(`table.cancel`)}
              onConfirm={cancelEdit}
            >
              <CloseOutlined />
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link
            disabled={editingKey !== ""}
            onClick={() => edit(record)}
          >
            <EditOutlined />
          </Typography.Link>
        );
      },
    });
  }

  const [selectionType, setSelectionType] = useState("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState([""]);
  const [selectedRow, setSelectedRow] = useState([""]);

  const rowSelection: any = {
    selectedRowKeys: selectedRowKeys,
    // Get selected rows on
    onChange: (selectedRowKeys: any, selectedRows: any) => {
      setSelectedRow(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // Display the amount of retrieved rows and columns in the table's footer
  const setFooter = () => {
    if (tableState.data) {
      // @ts-ignore
      const rows = tableState.data.length;
      const columns = tableState.columns.length;
      return `${t("table.rowCount")}: ${rows} | ${t(
        "table.columnCount"
      )}: ${columns}`;
    }
  };

  type RecordType = {
    field: string;
    order: string;
  };

  return (
    <div style={style}>
      {alert ? (
        <Alert
          message="Hasura error"
          description={alertText}
          type="warning"
          showIcon
          closable
          onClose={() => setAlert(false)}
        />
      ) : (
        <></>
      )}
      {tableState.dataState == columnStates.READY ? (
        // If data is ready, show the user
        tableState.columns.length != 0 ? (
          // If there is data, display table
          <>
            <Form form={editRowForm} component={false}>
              <Table
                rowSelection={{
                  type: selectionType,
                  ...rowSelection,
                }}
                components={{
                  body: {
                    cell: EditableCell,
                  },
                }}
                size="small"
                key={name}
                dataSource={tableState.data}
                columns={mergedColumns}
                footer={setFooter}
                rowClassName="editable-row"
                pagination={{
                  onChange: cancelEdit,
                }}
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
                        userConfig.dashboards[
                          indexOfDashboard
                        ].dashboardElements[indexOfElement] = tableConfig;
                      }
                    }
                    setUserConfigQueryInput(userConfig);
                  }
                }}
              />
            </Form>
            {mode != workspaceStates.EDIT_DASHBOARD ? (
              <AddDeleteRowMenu
                hasuraProps={hasuraProps}
                columns={tableState.columns}
                tableName={tableName}
                selectedRow={selectedRow}
                setSelectedRowKeys={setSelectedRowKeys}
                encrypt={encrypt}
                setAlert={setAlert}
                setAlertText={setAlertText}
                setTableNameState={setTableNameState}
                setGridViewToggle={setGridViewToggle}
                gridViewToggle={gridViewToggle}
                t={t}
              ></AddDeleteRowMenu>
            ) : (<></>)}
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
};
