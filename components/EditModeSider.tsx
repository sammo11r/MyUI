import React, { useState } from "react"
import { Button, Layout } from "antd";
import {
  TableOutlined,
  BorderOutlined
} from "@ant-design/icons";
import { useTranslation } from "next-i18next";

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
  setDashboardState,
  loadings,
  saveDashboardChanges
}: any): any {
  const { t } = useTranslation();
  
  const draggableElement = (type: elementType, text: string, icon: any): JSX.Element => {
    return (
      <div
        className="droppable-element"
        draggable={true}
        onDragStart={e => {
          e.dataTransfer.setData("text/plain", elementType[type])
        }}
      > 
        {icon} {/* @TODO: improve the visuals */}
        {text}
      </div>
    )
  }

  return (
    <Sider theme="light">
      {draggableElement(elementType.STATIC, t("dashboard.element.static.type"), <BorderOutlined/>)}
      {draggableElement(elementType.GRIDVIEW, t("dashboard.element.gridview.type"), <TableOutlined/>)}
      <Button type="primary" loading={loadings} onClick={() => saveDashboardChanges(userConfig, dashboardState)} style={{width:"100%"}}>
        {t("dashboard.save")}
      </Button>
    </Sider>
  )
}

