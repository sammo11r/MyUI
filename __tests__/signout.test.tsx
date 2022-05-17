import React from "react";
import Signout from "../pages/auth/signout";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Signout", () => {
  it("renders a signout form", () => {
    render(<Signout />);

    const row = screen.getByTestId("row-element");
    const form = screen.getByTestId("form-element");
    const submitButton = screen.getByTestId("submit-button");

    expect(row).toBeInTheDocument();
    expect(form).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });
});
