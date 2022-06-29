import React, { BaseSyntheticEvent } from "react";
import { Layout, Modal } from "antd";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";

import { workspaceType, elementType } from "../consts/enum";
import { DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import GridView from "./GridView";
import StaticElement from "./StaticElement";
import { parse, stringify } from "../consts/inputSanitizer";
import {
  DashboardElementType,
  DashboardProps,
  DashboardState,
  HasuraProps,
  SystemProps,
  UserConfig,
} from "../utils/customTypes";

const { confirm } = Modal;
const ResponsiveReactGridLayout = WidthProvider(Responsive);

/**
 * @export
 * @param {DashboardProps} {
 *   hasuraProps,
 *   systemProps,
 *   mode,
 *   userConfig,
 *   dashboardState,
 *   setDashboardState,
 *   setEditElementModalState,
 *   setUserConfigQueryInput,
 *   hasuraHeaders,
 *   gridViewToggle,
 *   setGridViewToggle,
 *   t,
 *   encrypt
 * }
 * @return {*}  {JSX.Element}
 */
export default function Dashboard({
  hasuraProps,
  systemProps,
  mode,
  userConfig,
  dashboardState,
  setDashboardState,
  setEditElementModalState,
  setUserConfigQueryInput,
  hasuraHeaders,
  gridViewToggle,
  setGridViewToggle,
  t,
  encrypt,
}: DashboardProps): JSX.Element {
  /**
   * Edit an element on the dashboard
   *
   * @param {BaseSyntheticEvent} event
   * @param {number} index
   */
  const editElement = (event: BaseSyntheticEvent, index: number) => {
    if (mode !== workspaceType.EDIT_DASHBOARD) {
      return;
    }
    event.preventDefault();
    const element = dashboardState.dashboard.dashboardElements[index];
    setEditElementModalState({ visible: true, element: element });
  };

  /**
   * Delete an element from the dashboard
   *
   * @param {number} index
   */
  const deleteElement = (index: number) => {
    const newDashboard = dashboardState.dashboard;
    newDashboard.dashboardElements.splice(index, 1);
    setDashboardState({ dashboard: newDashboard });
  };

  /**
   * Show the confirmation modal
   *
   * @param {number} index
   */
  const showDeleteConfirm = (index: number) => {
    confirm({
      title: t("dashboard.element.removewarning.title"),
      icon: <ExclamationCircleOutlined />,
      content: t("dashboard.element.removewarning.description"),
      okText: t("dashboard.element.removewarning.confirmText"),
      okType: "danger",
      cancelText: t("dashboard.element.removewarning.cancelText"),
      onOk() {
        deleteElement(index);
      },
    });
  };

  /**
   * Render dashboard elements
   *
   * @param {boolean} gridViewToggle
   * @param {React.Dispatch<React.SetStateAction<boolean>>} setGridViewToggle
   * @param {DashboardElementType} element
   * @param {HasuraProps} hasuraProps
   * @param {number} index
   * @param {SystemProps} systemProps
   * @param {UserConfig} userConfig
   * @param {(React.Dispatch<React.SetStateAction<UserConfig | undefined>>)} setUserConfigQueryInput
   * @param {DashboardState} dashboardState
   * @param {workspaceType} mode
   * @param {(arg0: string) => string} t
   * @param {(password: string) => Promise<any>} encrypt
   * @return {*}  {JSX.Element}
   */
  function renderDashboardElement(
    gridViewToggle: boolean,
    setGridViewToggle: React.Dispatch<React.SetStateAction<boolean>>,
    element: DashboardElementType,
    hasuraProps: HasuraProps,
    index: number,
    systemProps: SystemProps,
    userConfig: UserConfig,
    setUserConfigQueryInput: React.Dispatch<
      React.SetStateAction<UserConfig | undefined>
    >,
    dashboardState: DashboardState,
    mode: workspaceType,
    t: (arg0: string) => string,
    encrypt: (password: { password: string }) => Promise<any>
  ): JSX.Element {
    let rendered_element = <p>{t("dashboard.element.unknown")}</p>;
    // Render element based on type
    switch (element.type) {
      case elementType.GRIDVIEW:
        rendered_element = (
          <GridView
            gridViewToggle={gridViewToggle}
            setGridViewToggle={setGridViewToggle}
            query={parse(element.query)}
            hasuraProps={hasuraProps}
            systemProps={systemProps}
            userConfig={userConfig}
            setUserConfigQueryInput={setUserConfigQueryInput}
            name={element.name}
            dashboardName={dashboardState.dashboard.name}
            hasuraHeaders={hasuraHeaders}
            mode={mode}
            t={t}
            encrypt={encrypt}
            style={{ height: "100%", width: "100%", overflow: "auto" }}
          />
        );
        break;
      case elementType.STATIC:
        rendered_element = (
          <StaticElement
            text={parse(element.text)}
            style={{ height: "100%", width: "100%" }}
            mediaDisplaySetting={systemProps.mediaDisplaySetting}
          />
        );
        break;
    }
    return (
      <div
        key={element.name}
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
        {mode === workspaceType.EDIT_DASHBOARD ? (
          <DeleteOutlined
            style={{
              position: "absolute",
              zIndex: "10",
              fontSize: "20px",
              right: "5px",
              top: "5px",
            }}
            onClick={() => showDeleteConfirm(index)}
            data-testid={`delete-button-${element.name}`}
          />
        ) : null}
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
    // Make deep copy to prevent dashboardstate becoming a reference to the dashboard stored in userConfig
    const newDashboard = structuredClone(dashboardState.dashboard);
    for (let i = 0; i < newDashboard.dashboardElements.length; i++) {
      newDashboard.dashboardElements[i].x = layout[i].x;
      newDashboard.dashboardElements[i].y = layout[i].y;
      newDashboard.dashboardElements[i].w = layout[i].w;
      newDashboard.dashboardElements[i].h = layout[i].h;
    }
    setDashboardState({ dashboard: newDashboard });
  };

  /**
   * Add new elements to the dashboard configuration once dropped in the working area
   *
   * @param {GridLayout.Layout[]} layout
   * @param {GridLayout.Layout} layoutItem
   * @param {DragEvent} event
   */
  const onDrop = (
    layout: GridLayout.Layout[],
    layoutItem: GridLayout.Layout,
    event: DragEvent
  ) => {
    const typeString = event.dataTransfer?.getData(
      "text/plain"
    ) as keyof typeof elementType;
    if (elementType[typeString] === undefined) {
      return;
    }

    // Define the element
    let element: DashboardElementType = {
      // Give the element a unique name
      name: crypto.randomUUID(),
      ordering: { by: undefined, direction: undefined },
      x: layoutItem["x"],
      y: layoutItem["y"],
      w: layoutItem["w"],
      h: layoutItem["h"],
      type: elementType[typeString],
      text: stringify(t("dashboard.element.new.text")),
      query: "",
    };

    // Add new element to dashboard
    const newDashboard = dashboardState.dashboard;
    newDashboard.dashboardElements.push(element);
    setDashboardState({ dashboard: newDashboard });

    // Open editmenu for newly created element
    setEditElementModalState({ visible: true, element: element });
  };

  return (
    <ResponsiveReactGridLayout
      data-testid="dashboard-layout"
      className="layout"
      // Number of collumns needs to be consistent such that elements are always in the same place
      breakpoints={{ bp: 0 }}
      cols={{ bp: 12 }}
      rowHeight={30}
      compactType={null}
      preventCollision={true}
      isBounded={true}
      isDroppable={mode === workspaceType.EDIT_DASHBOARD}
      isDraggable={mode === workspaceType.EDIT_DASHBOARD}
      isResizable={mode === workspaceType.EDIT_DASHBOARD}
      onDrop={onDrop}
      onDragStop={saveChange}
      onResizeStop={saveChange}
      style={{ height: "100%" }}
      // Setting the layout prop is necessary in order to rerender
      // the elements in the correct position after deleting
      layouts={{
        // @ts-ignore
        bp: dashboardState.dashboard.dashboardElements.map(
          (element: DashboardElementType, index: number) => {
            return {
              i: index,
              x: element.x,
              y: element.y,
              w: element.w,
              h: element.h,
            };
          }
        ),
      }}
    >
      {dashboardState.dashboard.dashboardElements.map(
        (element: DashboardElementType, index: number) =>
          renderDashboardElement(
            gridViewToggle,
            setGridViewToggle,
            element,
            hasuraProps,
            index,
            systemProps,
            userConfig,
            setUserConfigQueryInput,
            dashboardState,
            mode,
            t,
            encrypt
          )
      )}
    </ResponsiveReactGridLayout>
  );
}
