import React from "react";
import AppHeader from "../components/AppHeader";
import AppSider from "../components/AppSider";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("renderHeader", () => {
  it("renders AppSider correctly", () => {
    render(<AppSider></AppSider>);

    const siderMenu = screen.getByTestId("sider");

    expect(siderMenu).toBeInTheDocument();
  });
});
