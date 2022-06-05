import React, { useState } from "react";
import { Form, Input, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

import { elementType } from "../pages";

/**
 * @export
 * @param {*} {state, setState}
 * @return {*}  {JSX.Element}
 */
export default function EditElementModal({state, setState}: any): JSX.Element {
  const { TextArea } = Input;
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: {field: string}) => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        try {
          // Remove all line breaks from the query input
          state.element.query = values.field.replace(/(\r\n|\n|\r)/gm, "");
          break;
        } catch (error) { break }
      case elementType.STATIC:
        state.element.text = values.field.replace(/(\r\n|\n|\r)/gm, "");
        break;
    }
    
      // Hide the modal if there is no error in the query
      hideModal()
  }

  const hideModal = () => {
    setState({visible: false, element: {}})
  }

  const elementContent = () => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        return state.element.query
      case elementType.STATIC:
        return state.element.text
    }
  }

  const elementTypeTextRef = () => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        return "gridview"
      case elementType.STATIC:
        return "static"
      default:
        return "unknown"
    }
  }
  /**
   * Validate the gridview input format on change
   *
   * @param {*} _
   * @param {string} value
   * @return {*} 
   */
  const checkFormat = (_: any, value: string) => {
    if (elementTypeTextRef() == "gridview") {
      if (value == '') {
        // Input is empty, throw no error such that the user can modify the element later
        return Promise.resolve();
      }
      // Check if the input contains the required brackets and 'query'
      const containsQuery = value.includes('query');
      const containsBrackets = (value.split("{").length - 1 >= 2) && (value.split("}").length - 1 >= 2);
      if (containsQuery && containsBrackets) {
        return Promise.resolve();
      }

      return Promise.reject(new Error(t(`dashboard.queryinput.warning`)));
    }
    return Promise.resolve();
  };

  return(
    <Modal
      title={t(`dashboard.element.${elementTypeTextRef()}.type`)}
      visible={state.visible}
      onOk={form.submit}
      onCancel={hideModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
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
          <TextArea rows={10}/>
        </Form.Item>
      </Form>
    </Modal>
  );
}