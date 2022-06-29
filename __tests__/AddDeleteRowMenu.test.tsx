import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import React from "react";
import AddDeleteRowMenu from "../components/AddDeleteRowMenu";
import { hasuraProps } from "../consts/hasuraProps";

const useQuery = jest.spyOn(require("react-query"), "useQuery");
useQuery.mockImplementation((array: any, funct: any) => {
  funct();
});

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({ result: { value: 10 } })
})) as jest.Mock;

const crypto = require("crypto");
Object.defineProperty(global.self, "crypto", {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    randomUUID: () => 0
  }
})

const encrypt = jest.fn((s) => Promise.resolve(s))
const t = jest.fn((s) => s);
const setTableNameState = jest.fn();
const setGridViewToggle = jest.fn();
const setSelectedRowKeys = jest.fn();
const setAlert = jest.fn();
const setAlertText = jest.fn();

const hasuraHeaders = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTY1NTA2MDUwOS4xNTEsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4ifSwiZXhwIjoxNjU1MTAzNzA5fQ.rYzY6y1smWPyeSoEbcOHeqNB0XHimWgDKHVjZC1Tf6Q"
} as HeadersInit;

const columns = [
  { title: "ColumnTitle1" },
  { title: "ColumnTitle2" },
  { title: "ColumnTitle3" }
]

const selectedRow = [{
  ColumnTitle1: "mockValue1",
  ColumnTitle2: "mockValue2",
  ColumnTitle3: "mockValue3",
  key: "0"
}]

describe("Buttons only render when a user has permission to perform the corresponding action", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ mockResult: { value: 10 } })
    })) as jest.Mock;
    setTableNameState.mockClear();
    setGridViewToggle.mockClear();
    useQuery.mockClear();
  })

  it("Buttons render succesfully when insertable and deletable", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={true}
        deletable={true}
        t={t} 
      />
    );

    const addRowButton = screen.getByTestId("add-row-button");
    const deleteRowButton = screen.getByTestId("delete-row-button");

    expect(addRowButton).toBeInTheDocument();
    expect(deleteRowButton).toBeInTheDocument();
  })

  it("Buttons don't render when not insertable and not deletable", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={false}
        deletable={false}
        t={t}
      />
    );

    const addRowButton = screen.queryByTestId("add-row-button");
    const deleteRowButton = screen.queryByTestId("delete-row-button");

    expect(addRowButton).not.toBeInTheDocument();
    expect(deleteRowButton).not.toBeInTheDocument();
  })

  it("Only add button renders when insertable but not deletable", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={true}
        deletable={false}
        t={t}
      />
    );

    const addRowButton = screen.queryByTestId("add-row-button");
    const deleteRowButton = screen.queryByTestId("delete-row-button");

    expect(addRowButton).toBeInTheDocument();
    expect(deleteRowButton).not.toBeInTheDocument();
  })

  it("Only delete button renders when deletable but not insertable", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={false}
        deletable={true}
        t={t}
      />
    );

    const addRowButton = screen.queryByTestId("add-row-button");
    const deleteRowButton = screen.queryByTestId("delete-row-button");

    expect(addRowButton).not.toBeInTheDocument();
    expect(deleteRowButton).toBeInTheDocument();
  })
})

describe("Add menu works correctly", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ mockResult: { value: 10 } })
    })) as jest.Mock;
    setTableNameState.mockClear();
    setGridViewToggle.mockClear();
    useQuery.mockClear();
  })

  afterEach(() => {
    setTableNameState.mockClear();
    setGridViewToggle.mockClear();
    setAlert.mockClear();
    setAlertText.mockClear();
    useQuery.mockClear();
  })

  it("Add row menu renders", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={true}
        deletable={false}
        t={t}
      />
    );

    const addRowButton = screen.getByTestId("add-row-button");

    fireEvent.click(addRowButton);

    const addRowMenu = screen.queryByText("table.addRow");
    const rowInputColumn1 = screen.getByTestId("ColumnTitle1-input");
    const rowInputColumn2 = screen.getByTestId("ColumnTitle2-input");
    const rowInputColumn3 = screen.getByTestId("ColumnTitle3-input");

    expect(addRowMenu).toBeInTheDocument();
    expect(rowInputColumn1).toBeInTheDocument();
    expect(rowInputColumn2).toBeInTheDocument();
    expect(rowInputColumn3).toBeInTheDocument();
  })

  it("Query is sent when add confirm button is clicked", async () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={true}
        deletable={false}
        t={t}
      />
    );

    const addRowButton = screen.getByTestId("add-row-button");
    
    fireEvent.click(addRowButton);

    const rowInputColumn1 = screen.getByTestId("ColumnTitle1-input");
    const rowInputColumn2 = screen.getByTestId("ColumnTitle2-input");
    const rowInputColumn3 = screen.getByTestId("ColumnTitle3-input");
    const confirmAddButton = screen.getByTestId("add-confirm-button");

    fireEvent.change(rowInputColumn1, {target: {value: "value1"}});
    fireEvent.change(rowInputColumn2, {target: {value: "value2"}});
    fireEvent.change(rowInputColumn3, {target: {value: "value3"}});
    fireEvent.click(confirmAddButton);

    await waitFor(() => {
      expect(useQuery).toHaveBeenCalledWith([
        "updateBaseTables", 
        "Add", 
        'mutation TableMutation { insert_mockName(objects: {ColumnTitle1: \"value1\", ColumnTitle2: \"value2\", ColumnTitle3: \"value3\"}) { returning { ColumnTitle1 } } }'
      ], expect.any(Function));
    })

    // TODO: check if menu vanished:
    //const addRowMenu = screen.getByText("table.addRow");

    //expect(addRowMenu).not.toBeInTheDocument();
  })
})

describe("Delete menu works correctly", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ mockResult: { value: 10 } })
    })) as jest.Mock;
    setTableNameState.mockClear();
    setGridViewToggle.mockClear();
    useQuery.mockClear();
  })

  it("Delete row menu renders", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={false}
        deletable={true}
        t={t}
      />
    );

    const deleteRowButton = screen.getByTestId("delete-row-button");

    fireEvent.click(deleteRowButton);

    const deleteRowMenu = screen.queryByText("table.deleteRow");
    const confirmDeleteButton = screen.queryByTestId("delete-confirm-button");
    const cancelDeleteButton = screen.queryByTestId("delete-cancel-button");

    expect(deleteRowMenu).toBeInTheDocument();
    expect(confirmDeleteButton).toBeInTheDocument();
    expect(cancelDeleteButton).toBeInTheDocument();
  })

  it("Delete row menu does not query when cancel button is clicked", () => {
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={false}
        deletable={true}
        t={t}
      />
    );

    const deleteRowButton = screen.getByTestId("delete-row-button");

    fireEvent.click(deleteRowButton);

    const cancelDeleteButton = screen.getByTestId("delete-cancel-button");

    fireEvent.click(cancelDeleteButton);

    expect(useQuery).not.toHaveBeenCalledWith(["updateBaseTables", "Delete", expect.any(String)], expect.any(Function));
    
    // TODO: Check if menu actually vanished
    //const deleteRowMenu = screen.queryByText("table.deleteRow");

    //expect(deleteRowMenu).not.toBeInTheDocument();
  })

  it("Query is sent when delete confirm button is clicked", () => {
    render(
      <AddDeleteRowMenu
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        insertable={false}
        deletable={true}
        setTableNameState={setTableNameState}
        setSelectedRowKeys={setSelectedRowKeys}
        setAlert={setAlert}
        setAlertText={setAlertText}
        gridViewToggle={true}
        setGridViewToggle={setGridViewToggle}
        encrypt={encrypt}
        hasuraHeaders={hasuraHeaders}
        t={t}
      />
    );

    const deleteRowButton = screen.getByTestId("delete-row-button");

    fireEvent.click(deleteRowButton);

    const confirmDeleteButton = screen.getByTestId("delete-confirm-button");

    fireEvent.click(confirmDeleteButton);

    expect(useQuery).toHaveBeenCalledWith(
      [
        "updateBaseTables",
        "Delete",
        "mutation TableMutation { h2: delete_mockName(where: {ColumnTitle1:{_eq: \"mockValue1\"}, ColumnTitle2:{_eq: \"mockValue2\"}, ColumnTitle3:{_eq: \"mockValue3\"}}) { returning { ColumnTitle1 } }  }"
      ],
      expect.any(Function)
    );
    
    // TODO: check if menu vanished:
    //const deleteRowMenu = screen.queryByText("table.deleteRow");

    //expect(deleteRowMenu).not.toBeInTheDocument();
  })

  it("Alert is shown when delete confirm button is clicked", async () => {
    const errorMessage = "errorMsg";
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ errors: [{message: errorMessage}] })
    })) as jest.Mock;
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"mockName"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={false}
        deletable={true}
        t={t}
      />
    );

    const deleteRowButton = screen.getByTestId("delete-row-button");

    fireEvent.click(deleteRowButton);

    const confirmDeleteButton = screen.getByTestId("delete-confirm-button");

    fireEvent.click(confirmDeleteButton);
    
    await waitFor(() => {
      expect(setAlert).toBeCalledWith(true);
      expect(setAlertText).toBeCalledWith(errorMessage);
    })
    
    // TODO: check if menu vanished:
    //const deleteRowMenu = screen.queryByText("table.deleteRow");

    //expect(deleteRowMenu).not.toBeInTheDocument();
  })
})

describe("Add and delete for users table", () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ mockResult: { value: 10 } })
    })) as jest.Mock;
    setTableNameState.mockClear();
    setGridViewToggle.mockClear();
    useQuery.mockClear();
  })

  it("Encrypt is called when new passwords are inserted into the users table", async () => {
    columns[2].title = "password"    
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"users"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={true}
        deletable={false}
        t={t}
      />
    );

    const addRowButton = screen.getByTestId("add-row-button");
    
    fireEvent.click(addRowButton);

    const rowInputColumn1 = screen.getByTestId("ColumnTitle1-input");
    const rowInputColumn2 = screen.getByTestId("ColumnTitle2-input");
    const rowInputColumn3 = screen.getByTestId("password-input");
    const confirmAddButton = screen.getByTestId("add-confirm-button");

    fireEvent.change(rowInputColumn1, {target: {value: "value1"}});
    fireEvent.change(rowInputColumn2, {target: {value: "value2"}});
    fireEvent.change(rowInputColumn3, {target: {value: "password"}});
    fireEvent.click(confirmAddButton);

    await waitFor(() => {
      expect(useQuery).toHaveBeenCalledWith([
        "updateBaseTables",
        "Add", 
        'mutation TableMutation { insert_users(objects: {ColumnTitle1: "value1", ColumnTitle2: "value2", password: "undefined"}) { returning { ColumnTitle1 } } }'
      ], expect.any(Function));
    })
    
    // TODO: check if menu vanished:
    //const addRowMenu = screen.getByText("table.addRow");

    //expect(addRowMenu).not.toBeInTheDocument();
  })

  it("Correct query is sent when deleting entry from users table", () => {
    columns[0].title = "created_at"
    render(
      <AddDeleteRowMenu
        setTableNameState={setTableNameState}
        hasuraHeaders={hasuraHeaders}
        setGridViewToggle={setGridViewToggle}
        gridViewToggle={false}
        hasuraProps={hasuraProps}
        columns={columns}
        tableName={"users"}
        selectedRow={selectedRow}
        setSelectedRowKeys={setSelectedRowKeys}
        encrypt={encrypt}
        setAlert={setAlert}
        setAlertText={setAlertText}
        insertable={false}
        deletable={true}
        t={t}
      />
    );

    const deleteRowButton = screen.getByTestId("delete-row-button");

    fireEvent.click(deleteRowButton);

    const confirmDeleteButton = screen.getByTestId("delete-confirm-button");

    fireEvent.click(confirmDeleteButton);

    expect(useQuery).toHaveBeenCalledWith(
      [
        "updateBaseTables",
        "Delete",
        "mutation TableMutation { h2: delete_users(where: {created_at:{_eq: \"mockValue1\"}, ColumnTitle2:{_eq: \"mockValue2\"}, password:{_eq: \"mockValue3\"}}) { returning { created_at } }  }"
      ],
      expect.any(Function)
    );
    
    // TODO: check if menu vanished:
    //const deleteRowMenu = screen.queryByText("table.deleteRow");

    //expect(deleteRowMenu).not.toBeInTheDocument();
  })
})