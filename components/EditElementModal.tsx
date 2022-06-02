import React from "react";

import { Form, Input, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

import { elementType } from "../pages";

export default function EditElementModal({state, setState}: any): JSX.Element {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const onFinish = (values: {field: string}) => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        state.element.query = values.field
        break;
      case elementType.STATIC:
        state.element.text = values.field
        break;
    }
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
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}