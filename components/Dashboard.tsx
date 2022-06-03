import { useTranslation } from "next-i18next";
import React from "react";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import { workspaceStates } from "../pages";
import { elementType } from "../pages";
import { DeleteOutlined } from "@ant-design/icons";
import GridView from "./GridView";
import StaticElement from "./StaticElement";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

function Dashboard({ hasuraProps, systemProps, name, mode, userConfig, setUserConfig, dashboardState, setDashboardState, setEditElementModalState }: any): JSX.Element {
  const { t } = useTranslation()

  const editElement = (event: any, index: number) => {
    if (mode !== workspaceStates.EDIT_DASHBOARD) {
      return
    }
    event.preventDefault()
    const element = dashboardState.dashboard.dashboardElements[index]
    setEditElementModalState({ visible: true, element: element })
  }

  const deleteElement = (index: number) => {
    const newDashboard = dashboardState.dashboard
    newDashboard.dashboardElements.splice(index, 1)
    setDashboardState({ dashboard: newDashboard })
  }

  function renderDashboardElement(element: any, hasuraProps: any, index: number): JSX.Element {
    let rendered_element = <p>{t("dashboard.element.unknown")}</p>;
    switch (element.type) {
      case elementType.GRIDVIEW:
        rendered_element = <GridView query={element.query} hasuraProps={hasuraProps} style={{ height: "100%", width: "100%", overflow: "auto" }} />;
        console.log("rendering a GRIDVIEW at: " + element.x + ", " + element.y)
        break;
      case elementType.STATIC:
        rendered_element = <StaticElement text={element.text} style={{ height: "100%", width: "100%" }} />;
        console.log("rendering a STATIC at: " + element.x + ", " + element.y)
        break;
    }
    return (
      <div
        id="test_id"
        key={index}
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
        {mode === workspaceStates.EDIT_DASHBOARD ? <DeleteOutlined
          style={{ // TODO: move style to css file, as none of it depends on state
            position: "absolute",
            zIndex: "10",
            fontSize: "20px",
            right: "5px",
            top: "5px"
          }}
          onClick={(e) => deleteElement(index)}
        /> : null}
        {rendered_element}
      </div>
    );
  }

  const saveChange = (layout: GridLayout.Layout[]) => {
    const newDashboard = dashboardState.dashboard
    for (let i = 0; i < newDashboard.dashboardElements.length; i++) {
      newDashboard.dashboardElements[i].x = layout[i].x;
      newDashboard.dashboardElements[i].y = layout[i].y;
      newDashboard.dashboardElements[i].w = layout[i].w;
      newDashboard.dashboardElements[i].h = layout[i].h;
    }
    setDashboardState({ dashboard: newDashboard });
  }

  const onDrop = (layout: GridLayout.Layout[], layoutItem: GridLayout.Layout, event: DragEvent) => {
    const typeString = event.dataTransfer?.getData("text/plain") as keyof typeof elementType
    if (elementType[typeString] === undefined) {
      return
    }
    const element = {
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
    setDashboardState({ dashboard: newDashboard })
  };

  const layout = dashboardState.dashboard.dashboardElements
    .map((element: any, index: number) => {
      return { i: index, x: element.x, y: element.y, w: element.w, h: element.h }
    })

  return (
    <ResponsiveReactGridLayout
      className="layout"
      // Number of collumns needs to be consistent such that elements are always in the same place
      breakpoints={{ bp: 0 }}
      cols={{ bp: 12 }}
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
      style={{ height: "100%" }}
      // Setting the layout prop is necessary in order to rerender 
      // the elements in the correct position after deleting
      layouts={{
        bp: dashboardState.dashboard.dashboardElements
          .map((element: any, index: number) => {
            return { i: index, x: element.x, y: element.y, w: element.w, h: element.h }
          })
      }}
    >
      {
        dashboardState.dashboard
          .dashboardElements
          .map((element: any, index: number) => renderDashboardElement(element, hasuraProps, index))
      }
    </ResponsiveReactGridLayout>
  );
}

export default Dashboard;
