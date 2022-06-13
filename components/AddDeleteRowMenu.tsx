import React, { useState } from "react";
import { message, Popover } from "antd";
import { useQuery } from "react-query";

import { Button, Form, Input } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';

/**
 * @param {*} {
 *   hasuraProps, 
 *   columns,
 *   tableName,
 *   selectedRow
 * }
 * @return {*}  {*}
 */
function AddDeleteRowMenu({
    hasuraProps, 
    columns,
    tableName,
    selectedRow,
    encrypt,
    setAlert,
    setAlertText,
    t
  }: any): any {
    columns = columns.map((item: any) => {
      var data = JSON.stringify(item);
      var parsedData = JSON.parse(data);
      return parsedData.title;
    })

    const hasuraHeaders = {
        "Content-Type": "application/json",
        "x-hasura-admin-secret": hasuraProps.hasuraSecret,
      } as HeadersInit;

    // Define constants used for add and delete row menu
    const [clickedAdd, setClickedAdd] = useState(false);
    const [clickedDelete, setClickedDelete] = useState(false);
    const [form] = Form.useForm();

    // Handlers for the add row menu
    const hideAdd = () => {
        setClickedAdd(false);
    };

    const handleClickChangeAdd = (visible: boolean) => {
        setClickedAdd(visible);
    };

    const onReset = () => {
        form.resetFields();
        hideAdd();
    };

    // Handlers for the delete row menu
    const hideDelete = () => {
        setClickedDelete(false);
    };

    const closeDelete = () => {
        hideDelete();
    };

    const handleClickChangeDelete = (visible: boolean) => {
        setClickedDelete(visible);
    };    

    // Define state variables that, once set, update the user configuration file
    const [query, setQuery] = useState('');
    const [baseTableQueryInput, setBaseTableQueryInput] = useState<String | undefined>(undefined);

    // Update the base tables
    useQuery(["updateBaseTables", baseTableQueryInput, query], async () => {
        if (baseTableQueryInput != undefined) {
        await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
            method: "POST",
            headers: hasuraHeaders,
            body: JSON.stringify({
            query: query,
            }),
        })
        .then((res) => res.json())
        .then((res) => {
          // Check if there are errors thrown by Hasura
          if (res.errors) {
            // Get the error message
            let errorMessage: string = res.errors[0].message;
            setAlert(true);
            setAlertText(errorMessage);
          } else {
            if (baseTableQueryInput == "Add") {
              message.info(t("table.addRowNotification"))
            } else {
              message.warn(t("table.deleteRowNotification"))
            }
          }
        });
        // Clear the query input state variable
        setBaseTableQueryInput(undefined);
        }
    })

    // Define the logic when 'submit' is clicked in the add row menu
    const onFinish = async (values: any) => {
        onReset();

        if (tableName === 'users') {
          await encrypt({
            password: values.values.password,
          }).then((res: any) => {
            values.values.password = res.encryptedPassword;
          });
        }

        // Add all values to an array
        const value = [];
        for (var key in values.values) {
          value.push(values.values[key]);
        }

        const columns = Object.keys(values.values);

        // Define the variables needed for the mutation
        let name = 'insert_' + tableName;
        let column = columns[0];
        var row = '';

        // Construct the query
        for (var i = 0; i < columns.length; i++) {
            if (!isNaN(+value[i]) || value[i] === null) {
                row += columns[i] + ': ' + (+value[i]) + ', ';
            } else {
                row += columns[i] + ': ' + '\"' + value[i] + '\"' + ', ';
            }
        }

        // remove the final comma
        row = row.slice(0, row.length - 2);

        // Define, set and send the query
        const query = `mutation TableMutation { ${name}(objects: {${row}}) { returning { ${column} } } }`;
        setQuery(query);
        setBaseTableQueryInput("Add");
        hideAdd();
    };

    // Define the logic when 'yes' is clicked in the delete row menu
    const confirmDelete = () => {
        const value = [];
        for (var key in selectedRow) {
            value.push(selectedRow[key]);
        }

        // Define the variables needed for the mutation
        let name = 'delete_' + tableName;
        let column = columns[0];
        var counter = 1;
        var query = 'mutation TableMutation { ';

        for (var i = 0; i < value.length; i++) {
            var row = '';
            // Parse the JSON data
            var data = JSON.stringify(value[i]);
            var parsedData = JSON.parse(data);
            var values = [];
            for (key in parsedData) {
                values.push(parsedData[key]);
            }
            
            // Construct the query
            for (var j = 0; j < columns.length; j++) {
                if (!isNaN(+values[j]) || values[j] === null) {
                row += columns[j] + ':{_eq: ' + (+values[j]) + '}, ';
                } else {
                row += columns[j] + ':{_eq: ' + '\"' + values[j] + '\"' + '}, ';
                }
            }

            // remove the final comma
            row = row.slice(0, row.length - 2);
            counter += 1;
            var alias = 'h' + counter.toString();

            query += `${alias}: ${name}(where: {${row}}) { returning { ${column} } } `;
        }

        // Define, set and send the query
        query += ' }';

        setQuery(query);
        setBaseTableQueryInput("Delete");
        hideDelete();
    }
    
    return (
        <>
        <Popover
        placement="topLeft"
        content={
            // Define the add row menu
            <Form form={form} onFinish={onFinish} autoComplete="off">
              <Form.List name="values">
                {(value) => (
                  // Define the input fields dynamically
                  <>
                    {columns.map((column: any, name:any, key: string) => (
                      <Form.Item label={column} rules={[{ required: true, message: t("table.required") }]} key={column} name={column}>
                        <Input placeholder={column} />
                      </Form.Item>
                    ))}
                  </>
                  )}
              </Form.List>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  {t("table.submit")}
                </Button>
                <Button htmlType="button" onClick={onReset}>
                  {t("table.discard")}
                </Button>
              </Form.Item>
            </Form>    
        }
        title={t("table.addRow")}
        trigger="click"
        visible={clickedAdd}
        onVisibleChange={handleClickChangeAdd}
      >
        <Button>
          <PlusCircleOutlined />
        </Button>
      </Popover>
      <Popover
      placement="rightTop"
        content={
            <>
              <div>
                {t("table.deleteMessage")}
              </div>
              <Button type="primary" htmlType="submit" onClick={confirmDelete}>
                {t("table.deleteYes")}
              </Button>
              <Button htmlType="button" onClick={closeDelete}>
                {t("table.deleteNo")}
              </Button>
            </>}
        title={t("table.deleteRow")}
        trigger="click"
        visible={clickedDelete}
        onVisibleChange={handleClickChangeDelete}
        >
        <Button>
          <MinusCircleOutlined />
        </Button>
      </Popover>
      </>
    );
  }
  
  export default AddDeleteRowMenu;  