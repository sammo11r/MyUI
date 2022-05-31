import { Grid } from "antd";
import React from "react";
import GridLayout from "react-grid-layout";
import { workspaceStates } from "../pages";

enum elementType {
  GRIDVIEW,
  STATIC
}

function Dashboard({ hasuraProps, systemProps, name, mode, userConfig, setUserConfig }: any): JSX.Element {
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

  function getDashboard(name: string) {
    const dashboard = dashboards.filter((dashboard: any) => dashboard.name === name)[0];
    console.log(name);
    if (dashboard) {
      return dashboard
    }
    return dashboards[0];
  }
 
  const dashboard = getDashboard(name);

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
    let newDashboard = dashboard;
    for (let i = 0; i < newDashboard.dashboardElements.length; i++) {
      newDashboard.dashboardElements[i].x = layout[i].x;
      newDashboard.dashboardElements[i].y = layout[i].y;
      newDashboard.dashboardElements[i].w = layout[i].w;
      newDashboard.dashboardElements[i].h = layout[i].h;
    }
  }

  const onDrop = (layout: any, layoutItem: any, _event: Event) => {
    console.log(layout)
    console.log(layoutItem)
    console.log(_event)
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
        dashboard
          .dashboardElements
          .map((element: any, index: number) => renderDashboardElement(element, hasuraProps, index))
      }
    </GridLayout>
  );
}

export default Dashboard;
