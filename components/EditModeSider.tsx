import React, { ReactNode } from "react";
import { Button, Layout } from "antd";
import {
  TableOutlined,
  BorderOutlined,
  DownloadOutlined,
} from "@ant-design/icons";

import { elementType } from "../consts/enum";
import { EditModeSiderProps } from "../utils/customTypes";

const { Sider } = Layout;

/**
 * @export
 * @param {EditModeSiderProps} {
 *   userConfig,
 *   dashboardState,
 *   loadings,
 *   saveDashboardChanges,
 *   t,
 * }
 * @return {*}  {JSX.Element}
 */
export default function EditModeSider({
  userConfig,
  dashboardState,
  loadings,
  saveDashboardChanges,
  t,
}: EditModeSiderProps): JSX.Element {
  /**
   * Define a draggable element for the sider
   *
   * @param {elementType} type
   * @param {string} text
   * @param {ReactNode} icon
   * @return {*}  {JSX.Element}
   */
  const draggableElement = (
    type: elementType,
    text: string,
    icon: ReactNode
  ): JSX.Element => {

    const testID = "sider-button-" + (type == 0 ? "gridview" : "static")

    return (
      <Button
        className="droppable-element"
        data-testid={testID}
        draggable={true}
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", elementType[type]);
        }}
        icon={icon}
      >
        {text}
      </Button>
    );
  };

  /**
   * Download the dashboard configurationfile as a JSON
   */
  const downloadDashboard = (): void => {
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
  };

  // Render the sider with the draggable elements
  return (
    <Sider data-testid="edit-sider" theme="light">
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
        data-testid="edit-save"
      >
        {t("dashboard.save")}
      </Button>
      {/* Add the download button */}
      <Button
        style={{ width: "100%" }}
        onClick={() => downloadDashboard()}
        icon={<DownloadOutlined />}
        data-testid="edit-download"
      >
        {t("dashboard.downloadDashboard")}
      </Button>
    </Sider>
  );
}
