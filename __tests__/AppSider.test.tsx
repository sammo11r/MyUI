import React from "react";
import AppHeader from "../components/AppHeader";
import NavigationAppSider from "../components/NavigationSider";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("renderHeader", () => {
  it("renders AppSider correctly", () => {
    render(<NavigationAppSider></NavigationAppSider>);

    const siderMenu = screen.getByTestId("sider");

    expect(siderMenu).toBeInTheDocument();
  });
});
