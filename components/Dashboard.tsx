import { Grid } from "antd";
import React from "react";
import GridLayout from "react-grid-layout";

import { workspaceStates } from "../pages";
import { elementType } from "../pages";

function Dashboard({ hasuraProps, systemProps, name, mode, userConfig, setUserConfig, dashboardState, setDashboardState }: any): JSX.Element {
  const dashboards = [{
    name: "Cool Dashboard",
    dashboardElements: [
      {
        name: "Cool Element",
        x: 0,
        y: 0,
        h: 9,
        w: 6,
        rowsPerPage: 5,
        query: `
        query MyQuery {
          Product {
            id
            name
            description
          }
        }
        `,
        type: elementType.GRIDVIEW // type of visualization
      },
      {
        name: "Text Element",
        x: 6,
        y: 0,
        h: 9,
        w: 6,
        text: "Dit is een klein stukje tekst. Prijs de heer, zuip wat meer!",
        type: elementType.STATIC
      },
      {
        name: "Video Element",
        x: 0,
        y: 9,
        h: 9,
        w: 6,
        text: "https://archive.org/download/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4",
        type: elementType.STATIC
      }]
  }];
  //userConfig["dashboards"] ? userConfig["dashboards"] : [];

  function renderDashboardElement(element: any, hasuraProps: any, index: number): JSX.Element {

    let rendered_element = <p>Unknown element type</p>;
    switch (element.type) {
      case elementType.GRIDVIEW:
        rendered_element = <p>Gridview W.I.P.</p>;
        break;
      case elementType.STATIC:
        rendered_element = <p>Static W.I.P.</p>;
        break;
    }
    return (
      <div
        id="test_id"
        key={index + Date.now()}
        style={{ outline: "2px solid #ebf2ff" }}
        data-grid={{
          x: element.x,
          y: element.y,
          w: element.w,
          h: element.h,
          static: mode === workspaceStates.DISPLAY_DASHBOARD
        }}
      >
        {rendered_element}
      </div>
    );
  }

  const saveChange = (layout: any) => {
    console.log("Change made:");
    console.log(layout)
    let newDashboard = dashboardState.dashboard;
    for (let i = 0; i < newDashboard.dashboardElements.length; i++) {
      newDashboard.dashboardElements[i].x = layout[i].x;
      newDashboard.dashboardElements[i].y = layout[i].y;
      newDashboard.dashboardElements[i].w = layout[i].w;
      newDashboard.dashboardElements[i].h = layout[i].h;
    }

    setDashboardState({dashboard: newDashboard});
  }

  const onDrop = (layout: GridLayout.Layout[], layoutItem: GridLayout.Layout, _event: DragEvent) => {
    const typeString = _event.dataTransfer?.getData("text/plain") as keyof typeof elementType
    const element = {
      name: "New Element " + Date.now(),
      x: layoutItem["x"],
      y: layoutItem["y"],
      w: layoutItem["w"],
      h: layoutItem["h"],
      type: elementType[typeString],
      text: "Input text here..."
    }
    //getDashboard(name).dashboardElements.push(element)
  };

  return (
    <GridLayout
      className="layout"
      cols={12}
      rowHeight={30}
      width={1500} // TODO: Make width scale responsively
      compactType={null}
      preventCollision={true}
      isDroppable={true}
      onDrop={onDrop}
      onLayoutChange={(layout: any) => saveChange(layout)}
    >
      {
        dashboardState.dashboard
          .dashboardElements
          .map((element: any, index: number) => renderDashboardElement(element, hasuraProps, index))
      }
    </GridLayout>
  );
}

export default Dashboard;
