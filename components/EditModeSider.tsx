import React from "react";
import { Button, Layout } from "antd";
import { TableOutlined, BorderOutlined } from "@ant-design/icons";

import { elementType } from "../const/enum";

const { Sider } = Layout;

/**
 * @export
 * @param {*} {
 *   userConfig,
 *   dashboardState,
 *   loadings,
 *   saveDashboardChanges,
 *   t
 * }
 * @return {*}  {*}
 */
export default function EditModeSider({
  userConfig,
  dashboardState,
  loadings,
  saveDashboardChanges,
  t,
}: any): any {
  /**
   * Define a draggable element for the sider
   *
   * @param {elementType} type
   * @param {string} text
   * @param {*} icon
   * @return {*}  {JSX.Element}
   */
  const draggableElement = (
    type: elementType,
    text: string,
    icon: any
  ): JSX.Element => {
    return (
      <div
        className="droppable-element"
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", elementType[type]);
        }}
      >
        {icon}
        {text}
      </div>
    );
  };

  // Render the sider with the draggable elements
  return (
    <Sider theme="light">
      {draggableElement(
        elementType.STATIC,
        t("dashboard.element.static.type"),
        <BorderOutlined />
      )}
      {draggableElement(
        elementType.GRIDVIEW,
        t("dashboard.element.gridview.type"),
        <TableOutlined />
      )}
      <Button
        type="primary"
        loading={loadings}
        onClick={() => saveDashboardChanges(userConfig, dashboardState)}
        style={{ width: "100%" }}
      >
        {t("dashboard.save")}
      </Button>
    </Sider>
  );
}
