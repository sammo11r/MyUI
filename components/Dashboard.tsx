import React, { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";

import { workspaceStates } from "../pages";
import { elementType } from "../pages";
import GridView from "./GridView";
import StaticElement from "./StaticElement";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * @param {*} {
 *   hasuraProps,
 *   systemProps,
 *   name,
 *   mode,
 *   userConfig,
 *   setUserConfig,
 *   dashboardState,
 *   setDashboardState,
 *   setEditElementModalState,
 *   userConfigQueryInput,
 *   setUserConfigQueryInput 
 * }
 * @return {*}  {JSX.Element}
 */
 export default function Dashboard({
  hasuraProps,
  systemProps,
  name,
  mode,
  userConfig,
  setUserConfig,
  dashboardState,
  setDashboardState,
  setEditElementModalState,
  userConfigQueryInput,
  setUserConfigQueryInput 
}: any): JSX.Element {
  const { t } = useTranslation()

  /**
   * Edit an element on the dashboard
   *
   * @param {*} event
   * @param {number} index
   */
  const editElement = (event: any, index: number) => {
    if (mode !== workspaceStates.EDIT_DASHBOARD) {
      return;
    }
    event.preventDefault();
    const element = dashboardState.dashboard.dashboardElements[index];
    setEditElementModalState({visible: true, element: element});
  }

  /**
   * Render dashboard elements
   *
   * @param {*} element
   * @param {*} hasuraProps
   * @param {number} index
   * @return {*}  {JSX.Element}
   */
  function renderDashboardElement(element: any, hasuraProps: any, index: number): JSX.Element {
    let rendered_element = <p>{t("dashboard.element.unknown")}</p>;
    switch (element.type) {
      case elementType.GRIDVIEW:
        rendered_element = <GridView query={element.query} hasuraProps={hasuraProps} style={{height:"100%", width:"100%", overflow:"auto"}}/>;
        break;
      case elementType.STATIC:
        rendered_element = <StaticElement text={element.text} style={{height:"100%", width:"100%"}}/>;
        break;
    }
    return (
      <div
        key={index + Date.now()} // Make sure that the key is unique
        style={{ 
          outline: "2px solid #ebf2ff",
        }}
        onDoubleClick={(e) => editElement(e, index)}
        data-grid={{
          x: element.x,
          y: element.y,
          w: element.w,
          h: element.h,
        }}
      >
        {rendered_element}
      </div>
    );
  }

  /**
   * Save the dashboard configuration changes
   *
   * @param {GridLayout.Layout[]} layout
   */
  const saveChange = (layout: GridLayout.Layout[]) => {
    const newDashboard = dashboardState.dashboard;
    for (let i = 0; i < newDashboard.dashboardElements.length; i++) {
      newDashboard.dashboardElements[i].x = layout[i].x;
      newDashboard.dashboardElements[i].y = layout[i].y;
      newDashboard.dashboardElements[i].w = layout[i].w;
      newDashboard.dashboardElements[i].h = layout[i].h;
    }
    setDashboardState({dashboard: newDashboard});
  }

  /**
   * Add new elements to the dashboard configuration once dropped in the working area
   *
   * @param {GridLayout.Layout[]} layout
   * @param {GridLayout.Layout} layoutItem
   * @param {DragEvent} event
   */
  const onDrop = (layout: GridLayout.Layout[], layoutItem: GridLayout.Layout, event: DragEvent) => {
    const typeString = event.dataTransfer?.getData("text/plain") as keyof typeof elementType;
    if (elementType[typeString] === undefined) {
      return
    }

    let element = {
      name: t("dashboard.element.new.name"),
      x: layoutItem["x"],
      y: layoutItem["y"],
      w: layoutItem["w"],
      h: layoutItem["h"],
      type: elementType[typeString],
      text: t("dashboard.element.new.text")
    }

    const newDashboard = dashboardState.dashboard
    newDashboard.dashboardElements.push(element)
    setDashboardState({dashboard: newDashboard})
  };

  return (
    <ResponsiveReactGridLayout
      className="layout"
      // Number of collumns needs to be consistent such that elements are always in the same place
      cols={{lg: 12, md: 12, sm: 12, xs: 12, xxs: 12}}
      rowHeight={30}
      compactType={null}
      preventCollision={true}
      isBounded={true}
      isDroppable={mode === workspaceStates.EDIT_DASHBOARD}
      isDraggable={mode === workspaceStates.EDIT_DASHBOARD}
      isResizable={mode === workspaceStates.EDIT_DASHBOARD}
      onDrop={onDrop}
      onDragStop={saveChange}
      onResizeStop={saveChange}
      style={{height: "100%"}}
    >
      {
        dashboardState.dashboard
          .dashboardElements
          .map((element: any, index: number) => renderDashboardElement(element, hasuraProps, index))
      }
    </ResponsiveReactGridLayout>
  );
}
