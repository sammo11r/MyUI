import React from "react";
import Workspace from "../components/Workspace";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { elementType, workspaceType as workspaceStates } from "../consts/enum";
import { when } from "jest-when";
import { SystemProps } from "../utils/customTypes";
import { hasuraProps } from "../consts/hasuraProps";
import { userConfig } from "../consts/demoUserConfig";

const hasuraHeaders = {
  "Content-Type": "application/json",
  Authorization: "mock", // Adding auth header instead of using the admin secret
} as HeadersInit;

const dashboardState = { 
  dashboard: {
    name: "mockName",
    dashboardElements: [{
      name: "mockElementName",
      ordering: {},
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      type: elementType.GRIDVIEW,
      text: "mockElementText",
      query: "mockElementQuery",
    }]
  } 
}
const setDashboardState = jest.fn();

const workspaceStateBaseTable = {
  name: "Customer",
  displaying: workspaceStates.BASE_TABLE
};

const workspaceStateEditDashboard = {
  name: "Customer",
  displaying: workspaceStates.EDIT_DASHBOARD
};

const workspaceStateDisplayDashboard = {
  name: "Customer",
  displaying: workspaceStates.DISPLAY_DASHBOARD
};

const workspaceStateEmpty = {
  name: "Customer",
  displaying: workspaceStates.EMPTY
};

const workspaceStateDefault = {
  name: "Customer",
  displaying: undefined
};

const systemProps = {
  mediaDisplaySetting: process.env.URL_DISPLAY_SETTING as String,
} as SystemProps;

// Essential mock functions to render the component
const setUserConfigQueryInput = jest.fn();
const setEditElementModalState = jest.fn();
const setGridViewToggle = jest.fn();
const t = jest.fn((text: string) => text);

// Mocking the behavior of the encrypt function
const encrypt = jest.fn();
when(encrypt).calledWith("password").mockReturnValue("$2b$10$c/D8xcCp.N5nDt1P9XyM4O1M/ZjgbDDBGKeC7ZuYyoBzvawd69KOi");

// Mocking the rendering of the base table component
jest.mock("../components/BaseTable", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="workspace-base" />
  }
});

// Mocking the render of the dashboard component
jest.mock("../components/Dashboard", () => {
  return {
    __esModule: true,
    default: () => <div data-testid="workspace-dashboard" />
  }
});


describe("renders Workspace correctly", () => {
  it("renders default workspace", () => {
    render(<Workspace
      // @ts-ignore
      workspaceState={workspaceStateDefault}
      hasuraProps={hasuraProps}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      dashboardState={dashboardState}
      setDashboardState={setDashboardState}
      setEditElementModalState={setEditElementModalState}
      hasuraHeaders={hasuraHeaders}
      encrypt={encrypt}
      gridViewToggle={false}
      setGridViewToggle={setGridViewToggle}
      t={t}
    />);

    const defaultWorkspace = screen.getByTestId("workspace-default");

    expect(defaultWorkspace).toBeInTheDocument();
  });

  it("renders empty workspace", () => {
    render(<Workspace
      workspaceState={workspaceStateEmpty}
      hasuraProps={hasuraProps}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      dashboardState={dashboardState}
      setDashboardState={setDashboardState}
      setEditElementModalState={setEditElementModalState}
      hasuraHeaders={hasuraHeaders}
      encrypt={encrypt}
      gridViewToggle={false}
      setGridViewToggle={setGridViewToggle}
      t={t}
    />);

    const emptyWorkspace = screen.getByTestId("workspace-empty");

    expect(emptyWorkspace).toBeInTheDocument();
  });

  it("renders base table", () => {
    render(<Workspace
      workspaceState={workspaceStateBaseTable}
      hasuraProps={hasuraProps}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      dashboardState={dashboardState}
      setDashboardState={setDashboardState}
      setEditElementModalState={setEditElementModalState}
      hasuraHeaders={hasuraHeaders}
      encrypt={encrypt}
      gridViewToggle={false}
      setGridViewToggle={setGridViewToggle}
      t={t}
    />);

    const baseTable = screen.getByTestId("workspace-base");

    expect(baseTable).toBeInTheDocument();
  });

  it("renders dashboard in editmode", () => {
    render(<Workspace
      workspaceState={workspaceStateEditDashboard}
      hasuraProps={hasuraProps}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      dashboardState={dashboardState}
      setDashboardState={setDashboardState}
      setEditElementModalState={setEditElementModalState}
      hasuraHeaders={hasuraHeaders}
      encrypt={encrypt}
      gridViewToggle={false}
      setGridViewToggle={setGridViewToggle}
      t={t}
    />);

    const dashboard = screen.getByTestId("workspace-dashboard");

    expect(dashboard).toBeInTheDocument();
  });

  it("renders dashboard in displaymode", () => {
    render(<Workspace
      workspaceState={workspaceStateDisplayDashboard}
      hasuraProps={hasuraProps}
      systemProps={systemProps}
      userConfig={userConfig}
      setUserConfigQueryInput={setUserConfigQueryInput}
      dashboardState={dashboardState}
      setDashboardState={setDashboardState}
      setEditElementModalState={setEditElementModalState}
      hasuraHeaders={hasuraHeaders}
      encrypt={encrypt}
      gridViewToggle={false}
      setGridViewToggle={setGridViewToggle}
      t={t}
    />);

    const dashboard = screen.getByTestId("workspace-dashboard");

    expect(dashboard).toBeInTheDocument();
  })
})