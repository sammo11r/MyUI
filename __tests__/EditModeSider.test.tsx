import React from "react";
import EditModeSider from "../components/EditModeSider";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import { userConfig } from "../consts/demoUserConfig";

const dashboardState = {
  dashboard:
    { name: "foo", dashboardElements: [] }
}

const t = jest.fn((text: string) => text);
const saveDashboardChanges = jest.fn();
global.URL.createObjectURL = jest.fn(() => "MockURL");

describe("EditModeSider functions correctly", () => {

  it("renders", () => {
    render(<EditModeSider
      saveDashboardChanges={saveDashboardChanges}
      userConfig={userConfig}
      dashboardState={dashboardState}
      loadings={false}
      t={t}
    />);

    const sider = screen.getByTestId("edit-sider");

    expect(sider).toBeInTheDocument();
  });

  it("renders static and gridview buttons", () => {
    render(<EditModeSider
      saveDashboardChanges={saveDashboardChanges}
      userConfig={userConfig}
      dashboardState={dashboardState}
      loadings={false}
      t={t}
    />);

    const gridButton = screen.getByTestId("sider-button-gridview");
    const statButton = screen.getByTestId("sider-button-static");

    expect(gridButton).toBeInTheDocument();
    expect(statButton).toBeInTheDocument();
  });

  it("calls saveDashboardChanges when clicked on save button", async () => {
    render(<EditModeSider
      saveDashboardChanges={saveDashboardChanges}
      userConfig={userConfig}
      dashboardState={dashboardState}
      loadings={false}
      t={t}
    />);

    const save = screen.getByTestId("edit-save");

    expect(save).toBeInTheDocument();
    expect(saveDashboardChanges).toBeCalledTimes(0);

    await user.click(save);

    expect(saveDashboardChanges).toBeCalledTimes(1);
    expect(saveDashboardChanges).toHaveBeenCalledWith(userConfig, dashboardState);
  });

  it("downloads the dashboard configuration file when clicked on download dashboard button", async () => {
    render(<EditModeSider
      saveDashboardChanges={saveDashboardChanges}
      userConfig={userConfig}
      dashboardState={dashboardState}
      loadings={false}
      t={t}
    />);

    const downloadButton = screen.getByTestId("edit-download");

    expect(downloadButton).toBeInTheDocument();

    const link = {
      href: undefined,
      download: undefined,
      click: jest.fn(),
    };
    // @ts-ignore
    jest.spyOn(document, 'createElement').mockImplementationOnce(() => link);

    expect(link.click).toBeCalledTimes(0);

    await user.click(downloadButton);

    expect(link.click).toBeCalledTimes(1);
    expect(link.href).toBe("MockURL");
    expect(link.download).toBe("dashboardConfig-foo.json");
  });

  it("sets the dataTransfer properties when a gridview element is dragged from the sidebar", async () => {
    render(<EditModeSider
      saveDashboardChanges={saveDashboardChanges}
      userConfig={userConfig}
      dashboardState={dashboardState}
      loadings={false}
      t={t}
    />);

    const gridButton = screen.getByTestId("sider-button-gridview");
    const mockDataTransfer = {
      dataTransfer: {
        setData: jest.fn(),
      },
    }

    fireEvent.dragStart(gridButton, mockDataTransfer);

    expect(mockDataTransfer.dataTransfer.setData).toHaveBeenCalledTimes(1);
    expect(mockDataTransfer.dataTransfer.setData).toHaveBeenCalledWith("text/plain", "GRIDVIEW");
  });

  it("sets the dataTransfer properties when a static element is dragged from the sidebar", async () => {
    render(<EditModeSider
      saveDashboardChanges={saveDashboardChanges}
      userConfig={userConfig}
      dashboardState={dashboardState}
      loadings={false}
      t={t}
    />);

    const statButton = screen.getByTestId("sider-button-static");
    const mockDataTransfer = {
      dataTransfer: {
        setData: jest.fn(),
      },
    }

    fireEvent.dragStart(statButton, mockDataTransfer);

    expect(mockDataTransfer.dataTransfer.setData).toHaveBeenCalledTimes(1);
    expect(mockDataTransfer.dataTransfer.setData).toHaveBeenCalledWith("text/plain", "STATIC");
  });
})
