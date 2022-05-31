import { Grid } from "antd";
import React from "react";
import GridLayout from "react-grid-layout";
import { workspaceStates } from "../pages";

enum elementType {
  GRIDVIEW,
  STATIC
}

function renderDashboardElement(element: any, hasuraProps: any, key: number): JSX.Element {
  // Style properties used to render element, 
  // position is absolute relative to parent element, i.e. WorkSpace
  const style = {
    position: "absolute",
    top: element.position.y,
    left: element.position.x,
    height: element.height,
    width: element.width,
    outline: "2px solid #ebf2ff",
  }

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
      key={key}
      style={{ outline: "2px solid #ebf2ff" }}
      data-grid={{
        x: element.position.x,
        y: element.position.y,
        w: element.width,
        h: element.height
      }}
    >
      {rendered_element}
    </div>
  );
}

function Dashboard({ hasuraProps, systemProps, name, mode, userConfig, setUserConfig }: any): JSX.Element {
  const dashboards = [{
    name: "Cool Dashboard",
    dashboardElements: [
      {
        name: "Cool Element",
        position: {
          x: 0,
          y: 0
        },
        height: 9,
        width: 6,
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
        position: {
          x: 6,
          y: 0
        },
        height: 9,
        width: 6,
        text: "Dit is een klein stukje tekst. Prijs de heer, zuip wat meer!",
        type: elementType.STATIC
      },
      {
        name: "Video Element",
        position: {
          x: 0,
          y: 9
        },
        height: 9,
        width: 6,
        text: "https://archive.org/download/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4",
        type: elementType.STATIC
      }]
  }];
  //userConfig["dashboards"] ? userConfig["dashboards"] : [];

  function getDashboard(name: string) {
    const dashboard = dashboards.filter((dashboard: any) => dashboard.name === name)[0];
    if (dashboard) {
      return dashboard
    }
    return dashboards[0];
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
      width={1500}
      compactType={null}
      preventCollision={true}
      isDroppable={true}
      onDrop={onDrop}
    >
      {
        getDashboard(name)
          .dashboardElements
          .map((element: any, index) => renderDashboardElement(element, hasuraProps, index))
      }
    </GridLayout>
  );
}

export default Dashboard;
