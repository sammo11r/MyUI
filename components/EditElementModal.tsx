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
          // Remove all line breaks from the query input as this cannot be saved in the configuration
          state.element.query = values.field.replace(/(\r\n|\n|\r)/gm, "");
          break;
        } catch (error) { 
          // If the input is empty, catch the error
          break 
        }
      case elementType.STATIC:
        // Remove all line breaks from the text input as this cannot be saved in the configuration
        state.element.text = values.field.replace(/(\r\n|\n|\r)/gm, "");
        break;
    }
    
    hideModal()
  }

  /**
   * Hide the modal by setting the visible state to false
   *
   */
  const hideModal = () => {
    setState({visible: false, element: {}})
  }

  /**
   * Define the content of the element
   *
   * @return {*} 
   */
  const elementContent = () => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        return state.element.query
      case elementType.STATIC:
        return state.element.text
    }
  }

  /**
   * Define which text type the element holds
   *
   * @return {*} 
   */
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
      // Validate the input for an gridview
      if (value == undefined) {
        // Input is empty, throw no error such that the user can modify the element later
        return Promise.resolve();
      }
      // Check if the input contains the required brackets and word 'query'
      const containsQuery = value.includes('query');
      const containsBrackets = (value.split("{").length - 1 >= 2) && (value.split("}").length - 1 >= 2);

      if (containsQuery && containsBrackets) {
        // The input is valid
        return Promise.resolve();
      }
      return Promise.reject(new Error(t(`dashboard.queryinput.warning`)));
    } else {
      // Validate the input for a text input
      if (value.includes('\"') || value.includes('\\')) {
        return Promise.reject(new Error(t(`dashboard.textinput.warning`)));
      }   
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
