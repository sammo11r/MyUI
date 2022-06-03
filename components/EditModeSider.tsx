import React from "react"
import { Layout } from "antd";
import {
  TableOutlined,
  BorderOutlined
} from "@ant-design/icons";
import { elementType } from "../pages";

const { Sider } = Layout;

function EditModeSider() {
  const draggableElement = (type: elementType, text: string, icon: any): JSX.Element => {
    return (
      <div
        className="droppable-element"
        draggable={true}
        onDragStart={e => {
          e.dataTransfer.setData("text/plain", elementType[type])
        }}
      > 
        {icon} {/* TODO: improve the visuals */}
        {text}
      </div>
    )
  }

  return (
    <Sider theme="light">
      {draggableElement(elementType.STATIC, "Static Element (Drag me!)", <BorderOutlined/>)}
      {draggableElement(elementType.GRIDVIEW, "Gridview Element (Drag me!)", <TableOutlined/>)}
    </Sider>
  )
}

export default EditModeSider