import React from "react";
import { Form, Input, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

/**
 * @export
 * @param {*} {
 *   editing,
 *   dataIndex,
 *   title,
 *   inputType,
 *   record,
 *   index,
 *   children,
 *   ...restProps
 * }
 * @return {*}
 */
export default function EditableCell({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}: any): any {
  const { t } = useTranslation();
  const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {/* If the user is editing, show the form items */}
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `${title} ` + t("table.empty"),
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
}
