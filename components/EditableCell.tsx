import React from "react";
import { Form, Input, InputNumber } from "antd";
import { useTranslation } from "react-i18next";

import { EditableCellType } from "../utils/customTypes";

/**
 * @export
 * @param {EditableCellType} {
 *   editing,
 *   dataIndex,
 *   title,
 *   inputType,
 *   record,
 *   index,
 *   children,
 *   ...restProps
 * }
 * @return {*}  {JSX.Element}
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
}: EditableCellType): JSX.Element {
  const { t } = useTranslation();

  const column = title ? title : "NoData"
  const cellTestID = "Cell-" + `${column}`
  const editTestID = editing ? "EditCell-input-" + `${column}` : ""

  const inputNode = inputType === "number" ? <InputNumber data-testid={editTestID} /> : <Input data-testid={editTestID} />;

  return (
    <td data-testid={cellTestID} {...restProps}>
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
