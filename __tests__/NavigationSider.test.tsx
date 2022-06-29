import React from "react";
import NavigationSider from "../components/NavigationSider";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";


const baseTableNames = ["lorem", "ipsum"];
const dashboardNames = ["dolor", "sit", "amet"];
const selectedKeys = "test"

const t = jest.fn((s) => s);
const baseTableOnClick = jest.fn();
const dashboardOnClick = jest.fn();

describe("renderHeader", () => {
  it("renders NavigationSider correctly", () => {
    render(
    <NavigationSider
      baseTableNames={baseTableNames}
      dashboardNames={dashboardNames}
      selectedKeys={selectedKeys}
      baseTableOnClick={baseTableOnClick}
      dashboardOnClick={dashboardOnClick}
      t={t}
    />
  );

    const siderMenu = screen.getByTestId("sider");

    expect(siderMenu).toBeInTheDocument();
  });

  it("renders BaseTable names", async () => {
    render(<NavigationSider
      dashboardNames={dashboardNames}
      baseTableNames={baseTableNames}
      selectedKeys={selectedKeys}
      baseTableOnClick={baseTableOnClick}
      dashboardOnClick={dashboardOnClick}
      t={t}
    />);

    const baseMenu = screen.getByText("basetable.sidebar");
    await user.click(baseMenu);
    const basetable = screen.getByText(`${baseTableNames[0]}`);
    const basetable2 = screen.getByText(`${baseTableNames[1]}`);

    expect(baseMenu).toBeInTheDocument();
    expect(basetable).toBeInTheDocument();
    expect(basetable2).toBeInTheDocument();
  })

  it("renders add/remove dashboard icons and dashboard names", async () => {
    render(<NavigationSider
      dashboardNames={dashboardNames}
      baseTableNames={baseTableNames}
      selectedKeys={selectedKeys}
      baseTableOnClick={baseTableOnClick}
      dashboardOnClick={dashboardOnClick}
      t={t}
    />);

    const dashMenu = screen.getByText("dashboard.sidebar");
    await user.click(dashMenu);
    const dashboard = screen.getByText(`${dashboardNames[0]}`);
    const dashboard2 = screen.getByText(`${dashboardNames[1]}`);
    const dashboard3 = screen.getByText(`${dashboardNames[2]}`);

    const plusIcon = screen.getByTestId("dash-plus");
    const minusIcon = screen.getByTestId("dash-minus");

    expect(dashMenu).toBeInTheDocument();
    expect(dashboard).toBeInTheDocument();
    expect(dashboard2).toBeInTheDocument();
    expect(dashboard3).toBeInTheDocument();

    expect(plusIcon).toBeInTheDocument();
    expect(minusIcon).toBeInTheDocument();
  });

  it("calls baseTableOnClick when clicked on a basetable name", async () => {
    const baseTableOnClick = jest.fn();

    render(<NavigationSider
      dashboardNames={dashboardNames}
      baseTableNames={baseTableNames}
      selectedKeys={selectedKeys}
      baseTableOnClick={baseTableOnClick}
      dashboardOnClick={dashboardOnClick}
      t={t}
    />);

    const baseMenu = screen.getByText("basetable.sidebar");
    await user.click(baseMenu);
    const basetable = screen.getByText(`${baseTableNames[0]}`);
    const basetable2 = screen.getByText(`${baseTableNames[1]}`);

    expect(baseTableOnClick).toBeCalledTimes(0);

    await user.click(basetable);

    expect(baseTableOnClick).toBeCalledTimes(1);

    await user.click(basetable2);

    expect(baseTableOnClick).toBeCalledTimes(2);
  });

  it("calls dashboardOnClick when clicked on a dashboard menu item", async () => {
    const dashboardOnClick = jest.fn();

    render(<NavigationSider
      dashboardNames={dashboardNames}
      baseTableNames={baseTableNames}
      selectedKeys={selectedKeys}
      baseTableOnClick={baseTableOnClick}
      dashboardOnClick={dashboardOnClick}
      t={t}
    />);

    const dashMenu = screen.getByText("dashboard.sidebar");
    await user.click(dashMenu);
    const dashboard = screen.getByText(`${dashboardNames[0]}`);
    const dashboard2 = screen.getByText(`${dashboardNames[1]}`);
    const dashboard3 = screen.getByText(`${dashboardNames[2]}`);
    const plusIcon = screen.getByTestId("dash-plus");
    const minusIcon = screen.getByTestId("dash-minus");

    expect(dashboardOnClick).toBeCalledTimes(0);

    await user.click(dashboard);
    expect(dashboardOnClick).toBeCalledTimes(1);

    await user.click(dashboard2);
    expect(dashboardOnClick).toBeCalledTimes(2);

    await user.click(dashboard3);
    expect(dashboardOnClick).toBeCalledTimes(3);

    await user.click(plusIcon);
    expect(dashboardOnClick).toBeCalledTimes(4);

    await user.click(minusIcon);
    expect(dashboardOnClick).toBeCalledTimes(5);
  });

  it("Still renders successfully when no basetables are present", async () => {
    const dashboardOnClick = jest.fn();

    render(<NavigationSider
      dashboardNames={dashboardNames}
      // @ts-ignore
      baseTableNames={undefined}
      selectedKeys={selectedKeys}
      baseTableOnClick={baseTableOnClick}
      dashboardOnClick={dashboardOnClick}
      t={t}
    />);

    const siderMenu = screen.getByTestId("sider");

    expect(siderMenu).toBeInTheDocument();
  });
});


