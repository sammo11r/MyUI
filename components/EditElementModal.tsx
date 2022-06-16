import React from "react";
import { Form, Input, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

import { elementType } from "../consts/enum";
import { isAllowed, parse, stringify } from "../consts/inputSanitizer";

/**
 *
 *
 * @export
 * @param {*} {state, setState, t}
 * @return {*}  {JSX.Element}
 */
export default function EditElementModal({
  state,
  setState,
  t,
}: any): JSX.Element {
  const { TextArea } = Input;
  const [editElementForm] = Form.useForm();

  const onFinish = (values: { field: string }) => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        // Stringify the query input, so it can be saved in the configuration
        state.element.query = stringify(values.field)
        break;
      case elementType.STATIC:
        // Stringify the text input, so it can be saved in the configuration
        state.element.text = stringify(values.field)
        break;
    }

    hideModal();
  };

  /**
   * Hide the modal by setting the visible state to false
   *
   */
  const hideModal = () => {
    setState({ visible: false, element: {} });
  };

  /**
   * Define the content of the element
   *
   * @return {*}
   */
  const elementContent = () => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        return parse(state.element.query)
      case elementType.STATIC:
        return parse(state.element.text)
    }
  };

  /**
   * Define which text type the element holds
   *
   * @return {*}
   */
  const elementTypeTextRef = () => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        return "gridview";
      case elementType.STATIC:
        return "static";
      default:
        return "unknown";
    }
  };

  /**
   * Validate the gridview input format on change
   *
   * @param {*} _
   * @param {string} value
   * @return {*}
   */
  const checkFormat = (_: any, value: string) => {
    if (elementTypeTextRef() == "gridview") {
      // Validate the input for a gridview
      if (value == "") {
        // Input is empty, throw no error such that the user can modify the element later
        return Promise.resolve();
      } else if (!isAllowed(value)) {
        // Input contains illegal characters
        return Promise.reject(new Error(t(`dashboard.queryinput.warning`)));
      }
      // Check if the input contains the required brackets and word 'query'
      const containsQuery = value.includes("query");
      const containsBrackets =
        value.split("{").length > 2 && value.split("}").length > 2;

      if (containsQuery && containsBrackets) {
        // The input is valid
        return Promise.resolve();
      }
      return Promise.reject(new Error(t(`dashboard.queryinput.warning`)));
    } else {
      // Validate the input for a text input
      if (!isAllowed(value)) {
        return Promise.reject(new Error(t(`dashboard.textinput.warning`)));
      }
    }
    return Promise.resolve();
  };

  return (
    <Modal
      title={t(`dashboard.element.${elementTypeTextRef()}.type`)}
      visible={state.visible}
      onOk={editElementForm.submit}
      onCancel={hideModal}
    >
      <Form form={editElementForm} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name={"field"}
          label={t(`dashboard.element.${elementTypeTextRef()}.label`)}
          initialValue={elementContent()}
          tooltip={{
            title: t(`dashboard.element.${elementTypeTextRef()}.tooltip`),
            icon: <InfoCircleOutlined />,
          }}
          rules={[
            {
              validator: checkFormat,
            },
          ]}
        >
          <TextArea rows={10} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
