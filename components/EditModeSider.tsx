import React, { useState } from "react"
import { Button, Layout } from "antd";
import {
  TableOutlined,
  BorderOutlined
} from "@ant-design/icons";

import { elementType } from "../pages";

const { Sider } = Layout;

/**
 * @export
 * @param {*} userConfig
 * @param {*} setUserConfig
 * @param {*} userConfigQueryInput
 * @param {*} setUserConfigQueryInput
 * @param {*} dashboardState
 * @param {*} setDashboardState
 * @return {*} 
 */
export default function EditModeSider({
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput,
  dashboardState,
  setDashboardState
}: any): any {
  const [loadings, setLoadings] = useState(false);

  /**
   * Save the dashboard changes to the user's configuration file
   */
  const saveDashboardChanges = () => {
    setLoadings(true);
    // Remove the old dashboard from the user config
    let otherDashboards = userConfig.dashboards.filter((dashboard: any) => dashboard.name != dashboardState.name);

    // Add the edited dashboard to the user config
    otherDashboards.push(dashboardState);
    userConfig.dashboards = otherDashboards;

    setUserConfigQueryInput(userConfig);
    setLoadings(false);
  }
  
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
      <Button type="primary" loading={loadings} onClick={saveDashboardChanges} style={{width:"100%"}}>
          Save changes
      </Button>
    </Sider>
  )
}

