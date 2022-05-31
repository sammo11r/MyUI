import { Grid } from "antd";
import React from "react";
import GridLayout from "react-grid-layout";
import { workspaceStates } from "../pages";

enum elementType {
  GRIDVIEW,
  STATIC
}

function renderDashboardElement(element: any, hasuraProps: any): JSX.Element {
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

  switch (element.type) {
    case elementType.GRIDVIEW:
      return (
        <p>Gridview W.I.P.</p>
      )
    case elementType.STATIC:
      return (
        <p>Gridview W.I.P.</p>
      )
    default:
      return <p>Unknown element type</p>;
  }
}

function Dashboard({ hasuraProps, systemProps, name, mode, userConfig, setUserConfig }: any): JSX.Element {
  const dashboards = []; //userConfig["dashboards"] ? userConfig["dashboards"] : [];

  function getDashboard(name: string) {
    const dashboard = dashboards.filter((dashboard: any) => dashboard.name === name)[0];
    if (dashboard) {
      return dashboard
    }
    return dashboards[0]
  }

  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
    { i: "b", x: 1, y: 0, w: 3, h: 2, minW: 2, maxW: 4 },
    { i: "c", x: 4, y: 0, w: 1, h: 2 }
  ];

  return (
    /*<>
      {
        getDashboard(name)
          .dashboardElements
          .map((element: any) => renderDashboardElement(element, hasuraProps))
      }
    </>*/
    <GridLayout
      className="layout"
      layout={layout}
      cols={12}
      rowHeight={30}
      width={1200}
      heigth={100}
      compactType={null}
      preventCollision={true}
    >
      <div key="a">a</div>
      <div key="b">b</div>
      <div key="c">c</div>
    </GridLayout>
  );
}

export default Dashboard;
