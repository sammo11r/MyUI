import React from "react";

import { Form, Input, Modal } from "antd";
import { elementType } from "../pages";

export default function EditElementModal({state, setState}: any): JSX.Element {
  const [form] = Form.useForm();

  const elementContent = () => {
    switch (state.element.type) {
      case elementType.GRIDVIEW:
        return state.element.query
      case elementType.STATIC:
        return state.element.text
    }
  }

  const onFinish =  (values: {field: string}) => {
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

  return(
    <Modal
      title={"MODAL TITLE"}
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
          label={"FORM LABEL"}
          initialValue={elementContent()}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}