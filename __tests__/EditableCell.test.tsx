import React from "react";
import EditableCell from "../components/EditableCell";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

describe("Test cases for EditableCell component", () => {
  it("Renders succesfully with inputType === number", () => {
    render(<EditableCell
      editing={true}
      dataIndex="mockDataIndex"
      title="mockTitle"
      inputType="number"
      record="mockRecord"
      index="mockIndex"
      children="mockChildren"
      restProps={""}
    />)

    expect(screen.getByTestId("Cell-mockTitle")).toBeInTheDocument();
    expect(screen.getByTestId("EditCell-input-mockTitle")).toBeInTheDocument();
  })

  it("Renders succesfully with inputType !== number", () => {
    render(<EditableCell
      editing={true}
      dataIndex="mockDataIndex"
      title="mockTitle"
      inputType="string"
      record="mockRecord"
      index="mockIndex"
      children="mockChildren"
      restProps={""}
    />)

    expect(screen.getByTestId("Cell-mockTitle")).toBeInTheDocument();
    expect(screen.getByTestId("EditCell-input-mockTitle")).toBeInTheDocument();
  })

  it("Renders succesfully with undefined title", () => {
    render(<EditableCell
      editing={true}
      dataIndex="mockDataIndex"
      // @ts-ignore
      title={undefined}
      inputType="string"
      record="mockRecord"
      index="mockIndex"
      children="mockChildren"
      restProps={""}
    />)

    expect(screen.getByTestId("Cell-NoData")).toBeInTheDocument();
    expect(screen.getByTestId("EditCell-input-NoData")).toBeInTheDocument();
  })

  it("Renders succesfully with editing === false", () => {
    render(<EditableCell
      editing={false}
      dataIndex="mockDataIndex"
      title="mockTitle"
      inputType="string"
      record="mockRecord"
      index="mockIndex"
      children="mockChildren"
      restProps={""}
    />)

    expect(screen.getByTestId("Cell-mockTitle")).toBeInTheDocument();
    expect(screen.queryByTestId("EditCell-input-mockTitle")).not.toBeInTheDocument();
  })
})