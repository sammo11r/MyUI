import React from "react";
import AppHeader from "../components/AppHeader";
import AppSider from "../components/AppSider";
import user from "@testing-library/user-event";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { Menu } from "antd";

describe("loadsBaseTable", () => {
  it("loads a base table on click of the item", async () => {
    const tableTestItems = ["Customer", "Inventory"];
    const dashboardTestItems = ["testDashboard1", "testDashboard2"];

    const mockDisplayBaseTable = jest.fn();
    const mockDisplayDashboard = jest.fn();

    render(
      <AppSider
        baseTableNames={tableTestItems}
        dashboardNames={dashboardTestItems}
        selectedKeys={null}
        openKeys={null}
        baseTableOnClick={mockDisplayBaseTable}
        dashboardOnClick={mockDisplayDashboard}
      />
    );

    const mySelectComponent = screen.getByTestId("sider");

    expect(mySelectComponent).toBeDefined();
    expect(mySelectComponent).not.toBeNull();
    expect(mockDisplayBaseTable).toHaveBeenCalledTimes(0);

    const baseTableSidebarButton = screen.getByText("basetable.sidebar");
    await user.click(baseTableSidebarButton);

    const baseTableItem = screen.getByText("Customer");
    await user.click(baseTableItem);

    waitFor(() => expect(mockDisplayBaseTable).toHaveBeenCalledTimes(1));
  });
});
