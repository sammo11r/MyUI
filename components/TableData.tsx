import React, { useState } from "react";
import { Alert, Form, Popconfirm, Table, Typography } from "antd";
import {
  ColumnGroupType,
  ColumnType,
  Key,
  RowSelectionType,
  SorterResult,
} from "antd/lib/table/interface";
import {
  CloseOutlined,
  EditOutlined,
  EllipsisOutlined,
  SaveOutlined,
} from "@ant-design/icons";

import Loader from "../components/Loader";
import { loadingState, workspaceType } from "../consts/enum";
import AddDeleteRowMenu from "../components/AddDeleteRowMenu";
import EditableCell from "../components/EditableCell";
import {
  checkPermissions,
  updateRowQuery,
} from "../components/EditRowsQueries";
import { queryTableData } from "../components/TableDataQuery";
import {
  BaseTableType,
  ColumnProps,
  DashboardElementType,
  DashboardType,
  PasswordEncryptRequest,
  TableDataProps,
  TableStateProps,
} from "../utils/customTypes";

/**
 * @export
 * @param {TableDataProps} {
 *   isBaseTable,
 *   hasuraProps,
 *   hasuraHeaders,
 *   systemProps,
 *   tableName,
 *   query,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   dashboardName,
 *   style,
 *   encrypt,
 *   t,
 *   gridViewToggle,
 *   setGridViewToggle,
 *   mode
 * }
 * @return {*}  {JSX.Element}
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
  dashboardName,
  style,
  encrypt,
  t,
  gridViewToggle,
  setGridViewToggle,
  mode,
}: TableDataProps): JSX.Element {
  const mediaDisplaySetting: string = systemProps.mediaDisplaySetting;
  // State deciding whether to show loader or table for grid views and base tables
  const [tableState, setTableState] = useState<TableStateProps>({
    data: undefined,
    columns: [{}],
    columnsReady: false,
    dataState: loadingState.LOADING,
  });

  const [selectionType, setSelectionType] = useState<
    RowSelectionType | undefined
  >("checkbox");
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([""]);
  const [selectedRow, setSelectedRow] = useState<{ key: string }[]>([]);

  // Define state variables for data modification actions
  const [editable, setEditable] = useState(false);
  const [insertable, setInsertable] = useState(false);
  const [deletable, setDeletable] = useState(false);

  const [alert, setAlert] = useState(false);
  const [alertText, setAlertText] = useState("");
  const [editRowQueryInput, setEditRowQueryInput] = useState<string>();
  const [tableNameState, setTableNameState] = useState<string>(tableName);

  const [editRowForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState("");
  const isEditing = (record: { key: string }) =>
    record != undefined && record.key === editingKey;

  const cancelEdit = () => {
    setEditingKey("");
  };

  let elementName: string = tableName;
  if (!isBaseTable) {
    // If the table is a gridview, retrieve the table name from the query
    tableName = query
      .substring(query.indexOf("{") + 1, query.lastIndexOf("{"))
      .replace(/\s/g, "");
  }

  /**
   * @param {{key: string}} record
   * @param {string} query
   */
  const saveEdit = async (record: { key: string }, query: string) => {
    try {
      const input = await editRowForm.validateFields();
      let queryInput: {} = {}; // Object holding the edit query input

      // Compare updated input vs the old input
      for (let key in record) {
        // Check if the input value for the column has changed
        // Record object contains variable string elements
        if (record[key as keyof {}] != input[key] && input[key] != undefined) {
          // @ts-ignore
          queryInput[key] = input[key];
        }
      }

      // Check if there are any changes in the input
      if (Object.keys(queryInput).length > 0) {
        let updateQuery: string;
        // Construct query
        updateQuery = `mutation update { update_${tableName} ( where: {`;

        if (
          tableName == "users" &&
          queryInput.hasOwnProperty("password") &&
          encrypt
        ) {
          // @ts-ignore
          let editedPassword: string = queryInput["password"] as string;
          await encrypt({
            password: editedPassword,
          } as PasswordEncryptRequest).then((res: any) => {
            // Object contains field password, as the table is the users table
            // @ts-ignore
            queryInput["password"] = res.encryptedPassword;
          });
        }

        // Define search parameters for entity
        for (const key in record) {
          if (key != "key" && record[key as keyof {}] !== null) {
            updateQuery += `${key}: {_eq: "${record[key as keyof {}]}"},`;
          }
        }

        updateQuery = updateQuery.slice(0, -1) + `} _set: {`; // Remove last comma

        // Define new values
        for (const key in queryInput) {
          updateQuery += `${key}: "${queryInput[key as keyof {}]}",`;
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
   * @param {{key: string}} record
   */
  const edit = (record: { key: string }) => {
    editRowForm.setFieldsValue(record);
    setEditingKey(record.key);
  };

  updateRowQuery({
    setGridViewToggle,
    setEditingKey,
    setEditRowQueryInput,
    setTableNameState,
    setAlertText,
    setAlert,
    editRowQueryInput,
    hasuraHeaders,
    hasuraProps,
    gridViewToggle,
    editRowForm,
    t,
  });

  // Check the edit permission for this table
  checkPermissions({
    hasuraProps,
    isBaseTable,
    gridViewToggle,
    hasuraHeaders,
    setInsertable,
    setDeletable,
    setEditable,
    mode,
    tableName,
  });

  queryTableData({
    setTableState,
    setUserConfigQueryInput,
    t,
    query,
    hasuraProps,
    tableNameState,
    gridViewToggle,
    mediaDisplaySetting,
    isBaseTable,
    hasuraHeaders,
    dashboardName,
    tableName,
    userConfig,
    elementName,
  });

  const mergedColumns: ColumnProps[] = tableState.columns.map((column: any) => {
    if (!column.editable) {
      return column;
    }

    return {
      ...column,
      onCell: (record: {
        key: string;
      }): {
        record: { key: string };
        inputType: string;
        dataIndex: string | undefined;
        title: string | undefined | JSX.Element;
        editing: boolean;
      } => ({
        record,
        inputType: "text",
        dataIndex: column.dataIndex,
        title: column.title,
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
      render: (_: any, record: { key: string }): JSX.Element => {
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

  const rowSelection = {
    selectedRowKeys: selectedRowKeys,
    // Get selected rows on
    onChange: (selectedRowKeys: Key[], selectedRows: { key: string }[]) => {
      if (selectedRows.length == 0) {
        selectedRows = [];
      }
      setSelectedRow(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  // Display the amount of retrieved rows and columns in the table's footer
  const setFooter = () => {
    if (tableState.data) {
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
      {tableState.dataState == loadingState.READY ? (
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
                key={tableName}
                dataSource={tableState.data}
                columns={
                  mergedColumns as (
                    | ColumnGroupType<{ key: string }>
                    | ColumnType<{ key: string }>
                  )[]
                }
                footer={setFooter}
                rowClassName="editable-row"
                pagination={{
                  onChange: cancelEdit,
                }}
                onChange={function (
                  pagination,
                  filters,
                  sorter:
                    | SorterResult<{ key: string }>
                    | SorterResult<{ key: string }>[],
                  extra: { action: string }
                ) {
                  if (extra.action == "sort") {
                    if (isBaseTable) {
                      // Get the current table configuration
                      const baseTableConfig = userConfig.baseTables.filter(
                        (baseTable: BaseTableType) =>
                          baseTable.name == tableName
                      )[0];
                      let indexOfBaseTable =
                        userConfig.baseTables.indexOf(baseTableConfig);

                      // Update the ordering
                      baseTableConfig.ordering.by = (
                        sorter as SorterResult<RecordType>
                      ).field as string;
                      baseTableConfig.ordering.direction = (
                        sorter as SorterResult<RecordType>
                      ).order as string;

                      // Update the base table configuration
                      userConfig.baseTables[indexOfBaseTable] = baseTableConfig;
                    } else {
                      // Get the current table configuration
                      let currentDashboardConfig = userConfig.dashboards.filter(
                        (dashboard: DashboardType) =>
                          dashboard.name == dashboardName
                      )[0];
                      let indexOfDashboard = userConfig.dashboards.indexOf(
                        currentDashboardConfig
                      );
                      let tableConfig =
                        currentDashboardConfig.dashboardElements.filter(
                          (element: DashboardElementType) =>
                            element.name == elementName
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
                        ).field as string;
                        tableConfig.ordering.direction = (
                          sorter as SorterResult<RecordType>
                        ).order as string;

                        // Update the grid view configuration
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
            {mode != workspaceType.EDIT_DASHBOARD ? (
              <AddDeleteRowMenu
                hasuraProps={hasuraProps}
                hasuraHeaders={hasuraHeaders}
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
                insertable={insertable}
                deletable={deletable}
                t={t}
              ></AddDeleteRowMenu>
            ) : (
              <></>
            )}
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
