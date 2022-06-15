import React, { useState } from "react";
import { Button, Layout, Popover, Form, Input } from "antd";
import { TableOutlined, BorderOutlined, DownloadOutlined } from "@ant-design/icons";

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
      <Button
        className="droppable-element"
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", elementType[type]);
        }}
      >
        {icon}
        {text}
      </Button>
    );
  };

  // Download the dashboard configurationfile as a JSON
  const downloadDashboard = () => {
    // Format the data
    const fileData = JSON.stringify(dashboardState);
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const name = dashboardState.dashboard.name;
    // Export it to the user
    link.download = "dashboardConfig-" + name + ".json";
    link.href = url;
    link.click();
  }

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
      {/* Add the save changes button */}
      <Button
        type="primary"
        loading={loadings}
        onClick={() => saveDashboardChanges(userConfig, dashboardState)}
        style={{ width: "100%" }}
      >
        {t("dashboard.save")}
      </Button>
      {/* Add the download button */}
      <Button 
        style={{ width: "100%" }} 
        onClick={() => downloadDashboard()}
        icon={<DownloadOutlined />}
      >
        {t("dashboard.downloadDashboard")}
      </Button>
    </Sider>
  );
}
