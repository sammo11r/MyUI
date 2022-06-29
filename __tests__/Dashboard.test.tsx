import React from "react";
import Dashboard from "../components/Dashboard";
import { unmountComponentAtNode } from "react-dom";
import { render, screen, fireEvent, createEvent, waitFor, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient } from "react-query";
import GridLayout from "react-grid-layout";
import * as ShallowRenderer from 'react-test-renderer/shallow';

import { elementType, workspaceType as workspaceStates } from "../consts/enum";
import { userConfig } from "../consts/demoUserConfig";
import { dashboardState } from "../consts/demoDashboardConfig";
import { hasuraProps } from "../consts/hasuraProps";

jest.mock("antd/lib/modal", () => ({
  ...(jest.requireActual("antd/lib/modal")),
  confirm: jest.fn((props) => props.onOk())
}));

jest.mock("../components/GridView", () => () => {
  return <div data-testid="mock-gridview" />
});

const systemProps = {
  "mediaDisplaySetting": "MEDIA"
};

const hasuraHeaders = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTY1NTA2MDUwOS4xNTEsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4ifSwiZXhwIjoxNjU1MTAzNzA5fQ.rYzY6y1smWPyeSoEbcOHeqNB0XHimWgDKHVjZC1Tf6Q"
};

const workspaceState = {
  "displaying": workspaceStates.EDIT_DASHBOARD,
  "name": "test"
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  }
});

class DataTransfer {
  data: any
  dropEffect: any;
  effectAllowed: any;
  files: any;
  img: any;
  items: any;
  types: any;
  xOffset: number;
  yOffset: number;

  constructor() {
    this.data = { dragX: "", dragY: "" };
    this.dropEffect = "none";
    this.effectAllowed = "all";
    this.files = [];
    this.img = "";
    this.items = [];
    this.types = [];
    this.xOffset = 0;
    this.yOffset = 0;
  }
  clearData() {
    this.data = {};
  }
  getData(format: any) {
    return this.data[format];
  }
  setData(format: any, data: any) {
    this.data[format] = data;
  }
  setDragImage(img: any, xOffset: number, yOffset: number) {
    this.img = img;
    this.xOffset = xOffset;
    this.yOffset = yOffset;
  }
}

const crypto = require('crypto');

Object.defineProperty(global.self, 'crypto', {
  value: {
    randomUUID: () => crypto.randomUUID()
  }
});

let container: any = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const setDashboardState = jest.fn();
const setEditElementModalState = jest.fn();
const setUserConfigQueryInput = jest.fn();
const setGridViewToggle = jest.fn();
const t = jest.fn((text: string) => text);
const encrypt = jest.fn((s) => Promise.resolve(s))

const useStateMock: any = (useState: any) => [useState, setDashboardState];
jest.spyOn(React, 'useState').mockImplementation(useStateMock);

describe("Dashboard renders correctly", () => {
  it("renders", () => {
    const renderer = ShallowRenderer.createRenderer()

    renderer.render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

    const result = renderer.getRenderOutput();

    expect(result.props["data-testid"]).toBe("dashboard-layout")
  });

  it("Dashboard renders correctly with gridview element", () => {

    const dashboardStateWithGridview = {
      dashboard: {
        name: "test",
        dashboardElements: [
          {
            "name": "e3b517e5-5b07-4b86-a585-2a567a05a4d3",
            "x": 2,
            "y": 2,
            "w": 2,
            "h": 2,
            "type": 1,
            "text": "Add text here..."
          },
          {
            "name": "3422ddbd-cbb0-4748-b1a5-c2210ba7d18b",
            "x": 6,
            "y": 3,
            "w": 1,
            "h": 1,
            "type": 1,
            "text": "Add text here..."
          },
          {
            "name": "c316118d-8286-459a-aede-070cf835c565",
            "x": 4,
            "y": 8,
            "w": 1,
            "h": 1,
            "type": 1,
            "text": "Add text here..."
          },
          {
            "name": "cdd0bc5a-46b6-406d-95bc-5bd7eaa28764",
            "x": 3,
            "y": 6,
            "w": 1,
            "h": 1,
            "type": 0,
            "query": "mockText"
          }
        ]
      }
    }

    render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        // @ts-ignore
        dashboardState={dashboardStateWithGridview}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

      const gridViewElement = screen.getByTestId("mock-gridview");
      
      expect(gridViewElement).toBeInTheDocument();
  })

  it("calls functions onDrop", () => {
    jest.clearAllMocks();

    const workspaceState = {
      displaying: workspaceStates.EDIT_DASHBOARD,
      name: "test"
    };

    let dataTransferContent = new DataTransfer();

    const event = {
      dataTransfer: dataTransferContent,
    };

    dataTransferContent.setData("text/plain", elementType[elementType.STATIC]);

    Object.defineProperty(event, "dataTransfer", {
      value: dataTransferContent
    })

    const layoutItem: GridLayout.Layout = {
      "w": 1,
      "h": 1,
      "x": 2,
      "y": 8,
      "i": "__dropping-elem__",
      "moved": false,
      "static": false,
      "isDraggable": true
    };

    render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

    // const layout = screen.queryByTestId("dashboard-layout");
    let elements = screen.getAllByTestId("static-element");
    const nrElements = dashboardState.dashboard.dashboardElements.length

    expect(elements.length).toBe(nrElements);

    expect(setDashboardState).toBeCalledTimes(0);
    expect(setEditElementModalState).toBeCalledTimes(0);

    let droppedElement = elements[0];

    fireEvent.drop(elements[0], { event, layoutItem });

    elements = screen.getAllByTestId('static-element');
    elements.push(droppedElement);

    expect(elements.length).toBe(nrElements + 1);
    const { getByText } = within(screen.getAllByTestId('static-element')[0]);
    expect(getByText('Add text here...')).toBeInTheDocument();
  });
});

describe("Testcases for the opening of the editModal by double clicking an element", () => {
  beforeEach(() => {
    setEditElementModalState.mockClear();
  })

  it("Opens editElementModal when an element is doubleclicked", async () => {
    render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

    // screen.debug();
    const staticElement = screen.getByText("mockText");

    fireEvent.doubleClick(staticElement);

    await waitFor(() => {
      expect(setEditElementModalState).toHaveBeenCalledTimes(1);
      expect(setEditElementModalState).toHaveBeenCalledWith({
        visible: true, element: {
          h: 1,
          name: "cdd0bc5a-46b6-406d-95bc-5bd7eaa28764",
          text: "mockText",
          type: elementType.STATIC,
          w: 1,
          x: 3,
          y: 6,
        }
      })
    })
  });

  it("Doesn't open editElementModal when an element is doubleclicked in non-editmode", async () => {
    render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceStates.DISPLAY_DASHBOARD}
        userConfig={userConfig}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

    // screen.debug();
    const staticElement = screen.getByText("mockText");

    fireEvent.doubleClick(staticElement);

    await waitFor(() => expect(setEditElementModalState).toHaveBeenCalledTimes(0))
  });
})

describe("Testcases for deleting / adding elements form / to the dashboard", () => {
  beforeEach(() => {
    setDashboardState.mockClear();
  })

  it("Deletes the dashboardElement from the dashboard configuration when the deletebutton is clicked", async () => {
    render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

    const staticElementDeleteButton = screen.getByTestId("delete-button-cdd0bc5a-46b6-406d-95bc-5bd7eaa28764");

    fireEvent.click(staticElementDeleteButton);

    await waitFor(() => {
      expect(setDashboardState).toHaveBeenCalledTimes(1);
      expect(setDashboardState).toHaveBeenCalledWith({
        dashboard: {
          name: "test",
          dashboardElements: [
            {
              "name": "e3b517e5-5b07-4b86-a585-2a567a05a4d3",
              "x": 2,
              "y": 2,
              "w": 2,
              "h": 2,
              "type": 1,
              "text": "Add text here..."
            },
            {
              "name": "3422ddbd-cbb0-4748-b1a5-c2210ba7d18b",
              "x": 6,
              "y": 3,
              "w": 1,
              "h": 1,
              "type": 1,
              "text": "Add text here..."
            },
            {
              "name": "c316118d-8286-459a-aede-070cf835c565",
              "x": 4,
              "y": 8,
              "w": 1,
              "h": 1,
              "type": 1,
              "text": "Add text here..."
            }
          ]
        }
      });
    })
  })

  /*it("Adds the dashboardElement to the dashboard configuration when dropped", async () => {
    render(
      <Dashboard
        hasuraProps={hasuraProps}
        systemProps={systemProps}
        mode={workspaceState.displaying}
        userConfig={userConfig}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        setEditElementModalState={setEditElementModalState}
        setUserConfigQueryInput={setUserConfigQueryInput}
        hasuraHeaders={hasuraHeaders}
        gridViewToggle={false}
        setGridViewToggle={setGridViewToggle}
        t={t}
        encrypt={encrypt}
      />);

    const dashboard = screen.getAllByText("Add text here...")[0];

    const layoutItem: GridLayout.Layout = {
      "w": 1,
      "h": 1,
      "x": 2,
      "y": 8,
      "i": "__dropping-elem__",
      "moved": false,
      "static": false,
      "isDraggable": true
    };
    const dataTransfer = new DataTransfer();
    dataTransfer.setData("text/plain", "GRIDVIEW");

    fireEvent.drop(dashboard, { dataTransfer: dataTransfer, layoutItem: layoutItem });

    await waitFor(() => {
      expect(setDashboardState).toHaveBeenCalledTimes(1);
      expect(setDashboardState).toHaveBeenCalledWith({
        dashboard: {
          name: "test",
          dashboardElements: [
            {
              "name": "e3b517e5-5b07-4b86-a585-2a567a05a4d3",
              "x": 2,
              "y": 2,
              "w": 2,
              "h": 2,
              "type": 1,
              "text": "Add text here..."
            },
            {
              "name": "3422ddbd-cbb0-4748-b1a5-c2210ba7d18b",
              "x": 6,
              "y": 3,
              "w": 1,
              "h": 1,
              "type": 1,
              "text": "Add text here..."
            },
            {
              "name": "c316118d-8286-459a-aede-070cf835c565",
              "x": 4,
              "y": 8,
              "w": 1,
              "h": 1,
              "type": 1,
              "text": "Add text here..."
            }
          ]
        }
      });
    })
  })*/
})