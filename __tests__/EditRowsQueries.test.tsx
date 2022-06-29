import { waitFor } from "@testing-library/dom";
import { checkPermissions, updateRowQuery } from "../components/EditRowsQueries";
import { workspaceType as workspaceStates } from "../consts/enum";
import { FormInstance } from "antd";
import { hasuraProps } from "../consts/hasuraProps";

const hasuraHeaders = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTY1NTA2MDUwOS4xNTEsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4ifSwiZXhwIjoxNjU1MTAzNzA5fQ.rYzY6y1smWPyeSoEbcOHeqNB0XHimWgDKHVjZC1Tf6Q"
} as HeadersInit;
const setEditable = jest.fn();
const setInsertable = jest.fn();
const setDeletable = jest.fn();

const useQuery = jest.spyOn(require("react-query"), "useQuery");
useQuery.mockImplementation((array: any, funct: any) => {
  funct();
});

describe("Tests for checkPermissions", () => {
  beforeEach(() => {
    setEditable.mockClear();
    setInsertable.mockClear();
    setDeletable.mockClear();
    useQuery.mockClear();
  })

  it("does not set permissions when query returns no data", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ errors: [{ message: "The operation exceeded the time limit allowed for this project" }] })
    })) as jest.Mock;
    checkPermissions({
      isBaseTable: true,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      setEditable: setEditable,
      setInsertable: setInsertable,
      setDeletable: setDeletable,
      tableName: "mockTableName",
      mode: workspaceStates.BASE_TABLE,
      gridViewToggle: true,
    })
    await waitFor(() => {
      expect(setEditable).toBeCalledTimes(0);
      expect(setInsertable).toBeCalledTimes(0);
      expect(setDeletable).toBeCalledTimes(0);
      expect(useQuery).toBeCalledTimes(1);
    })
  })

  it("sets permissions correctly when only allowed to edit a basetable", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            __type: {
              fields: [
                { name: "update_mockTableName" }
              ]
            }
          }
        }
      )
    })) as jest.Mock;
    checkPermissions({
      isBaseTable: true,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      setEditable: setEditable,
      setInsertable: setInsertable,
      setDeletable: setDeletable,
      tableName: "mockTableName",
      mode: workspaceStates.BASE_TABLE,
      gridViewToggle: true,
    })

    await waitFor(() => {
      expect(setEditable).toBeCalledTimes(1);
      expect(setInsertable).toBeCalledTimes(1);
      expect(setDeletable).toBeCalledTimes(1);
      expect(setEditable).toBeCalledWith(true);
      expect(setInsertable).toBeCalledWith(false);
      expect(setDeletable).toBeCalledWith(false);
      expect(useQuery).toBeCalledTimes(1);
    })
  })

  it("sets permissions correctly when allowed to do everything, viewing a basetable", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            __type: {
              fields: [
                { name: "update_mockTableName" },
                { name: "insert_mockTableName" },
                { name: "delete_mockTableName" },
              ]
            }
          }
        }
      )
    })) as jest.Mock;
    checkPermissions({
      isBaseTable: true,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      setEditable: setEditable,
      setInsertable: setInsertable,
      setDeletable: setDeletable,
      tableName: "mockTableName",
      mode: workspaceStates.BASE_TABLE,
      gridViewToggle: true,
    })

    await waitFor(() => {
      expect(setEditable).toBeCalledTimes(1);
      expect(setInsertable).toBeCalledTimes(1);
      expect(setDeletable).toBeCalledTimes(1);
      expect(setEditable).toBeCalledWith(true);
      expect(setInsertable).toBeCalledWith(true);
      expect(setDeletable).toBeCalledWith(true);
      expect(useQuery).toBeCalledTimes(1);
    })
  })

  it("sets permissions correctly when allowed to do everything, viewing a non-editmode dashboard", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            __type: {
              fields: [
                { name: "update_mockTableName" },
                { name: "insert_mockTableName" },
                { name: "delete_mockTableName" },
              ]
            }
          }
        }
      )
    })) as jest.Mock;
    checkPermissions({
      isBaseTable: false,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      setEditable: setEditable,
      setInsertable: setInsertable,
      setDeletable: setDeletable,
      tableName: "mockTableName",
      mode: workspaceStates.DISPLAY_DASHBOARD,
      gridViewToggle: true,
    })

    await waitFor(() => {
      expect(setEditable).toBeCalledTimes(1);
      expect(setInsertable).toBeCalledTimes(1);
      expect(setDeletable).toBeCalledTimes(1);
      expect(setEditable).toBeCalledWith(true);
      expect(setInsertable).toBeCalledWith(true);
      expect(setDeletable).toBeCalledWith(true);
      expect(useQuery).toBeCalledTimes(1);
    })
  })

  it("sets permissions correctly when allowed to do everything, viewing a dashboard in editmode", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            __type: {
              fields: [
                { name: "update_mockTableName" },
                { name: "insert_mockTableName" },
                { name: "delete_mockTableName" },
              ]
            }
          }
        }
      )
    })) as jest.Mock;
    checkPermissions({
      isBaseTable: false,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      setEditable: setEditable,
      setInsertable: setInsertable,
      setDeletable: setDeletable,
      tableName: "mockTableName",
      mode: workspaceStates.EDIT_DASHBOARD,
      gridViewToggle: true,
    })

    await waitFor(() => {
      expect(setEditable).toBeCalledTimes(1);
      expect(setInsertable).toBeCalledTimes(1);
      expect(setDeletable).toBeCalledTimes(1);
      expect(setEditable).toBeCalledWith(false);
      expect(setInsertable).toBeCalledWith(false);
      expect(setDeletable).toBeCalledWith(false);
      expect(useQuery).toBeCalledTimes(1);
    })
  })
})

const editRowQueryInput = "mockQuery";

const editRowForm = {
  setFields: jest.fn(),
} as unknown as FormInstance<any>;

const setEditingKey = jest.fn();
const setTableNameState = jest.fn();
const setEditRowQueryInput = jest.fn();
const setAlert = jest.fn();
const setAlertText = jest.fn();
const setGridViewToggle = jest.fn();
const t = jest.fn((s) => s);
const crypto = require("crypto");
Object.defineProperty(global.self, "crypto", {
  value: {
    getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
    randomUUID: () => 0
  }
})

describe("Tests for updateRowQuery", () => {
  beforeEach(() => {
    setEditingKey.mockClear();
    setTableNameState.mockClear();
    setEditRowQueryInput.mockClear();
    setAlert.mockClear();
    setAlertText.mockClear();
    setGridViewToggle.mockClear();    
  })

  it("handles undefined query input error", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          errors: [
            {message: "field \"mockColumnName\" not found in type"}
          ]
        }
      )
    })) as jest.Mock;
    updateRowQuery({
      editRowQueryInput: undefined,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      editRowForm: editRowForm,
      setEditingKey: setEditingKey,
      setTableNameState: setTableNameState,
      setEditRowQueryInput: setEditRowQueryInput,
      setAlert: setAlert,
      setAlertText: setAlertText,
      gridViewToggle: true,
      setGridViewToggle: setGridViewToggle,
      t: t
    });

    await waitFor(() => {
      expect(editRowForm.setFields).toHaveBeenCalledTimes(0);
      expect(setAlert).toHaveBeenCalledTimes(0);
      expect(setEditingKey).toHaveBeenCalledTimes(0);
    })
  })

  it("handles edit permission error", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          errors: [
            {message: "field \"mockColumnName\" not found in type"}
          ]
        }
      )
    })) as jest.Mock;
    updateRowQuery({
      editRowQueryInput: editRowQueryInput,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      editRowForm: editRowForm,
      setEditingKey: setEditingKey,
      setTableNameState: setTableNameState,
      setEditRowQueryInput: setEditRowQueryInput,
      setAlert: setAlert,
      setAlertText: setAlertText,
      gridViewToggle: true,
      setGridViewToggle: setGridViewToggle,
      t: t
    });

    await waitFor(() => {
      expect(editRowForm.setFields).toHaveBeenCalledTimes(1);
      expect(editRowForm.setFields).toHaveBeenCalledWith(
        [{name: "mockColumnName", errors: ["table.editError"]}]
      );
    })
  })

  it("handles foreign key violation error", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          errors: [
            {message: "Foreign key violation. mockTableName_mockColumnName_fkey"}
          ]
        }
      )
    })) as jest.Mock;
    updateRowQuery({
      editRowQueryInput: editRowQueryInput,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      editRowForm: editRowForm,
      setEditingKey: setEditingKey,
      setTableNameState: setTableNameState,
      setEditRowQueryInput: setEditRowQueryInput,
      setAlert: setAlert,
      setAlertText: setAlertText,
      gridViewToggle: true,
      setGridViewToggle: setGridViewToggle,
      t: t
    });

    await waitFor(() => {
      expect(editRowForm.setFields).toHaveBeenCalledTimes(1);
      expect(editRowForm.setFields).toHaveBeenCalledWith(
        [{name: "mockColumnName", errors: ["table.foreignKey"]}]
      );
    })
  })

  it("handles errors returned by hasura (not an edit or foreign key error)", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          errors: [
            {message: "someError"}
          ]
        }
      )
    })) as jest.Mock;
    updateRowQuery({
      editRowQueryInput: editRowQueryInput,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      editRowForm: editRowForm,
      setEditingKey: setEditingKey,
      setTableNameState: setTableNameState,
      setEditRowQueryInput: setEditRowQueryInput,
      setAlert: setAlert,
      setAlertText: setAlertText,
      gridViewToggle: true,
      setGridViewToggle: setGridViewToggle,
      t: t
    });

    await waitFor(() => {
      expect(setAlert).toHaveBeenCalledTimes(1);
      expect(setAlertText).toHaveBeenCalledWith("someError")
    })
  })

  it("works when no error occurs", async () => {
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {}
        }
      )
    })) as jest.Mock;
    updateRowQuery({
      editRowQueryInput: editRowQueryInput,
      hasuraProps: hasuraProps,
      hasuraHeaders: hasuraHeaders,
      editRowForm: editRowForm,
      setEditingKey: setEditingKey,
      setTableNameState: setTableNameState,
      setEditRowQueryInput: setEditRowQueryInput,
      setAlert: setAlert,
      setAlertText: setAlertText,
      gridViewToggle: true,
      setGridViewToggle: setGridViewToggle,
      t: t
    });

    await waitFor(() => {
      expect(setEditingKey).toHaveBeenCalledTimes(1);
      expect(setEditingKey).toHaveBeenCalledWith("");
      expect(setTableNameState).toHaveBeenCalledTimes(1);
      expect(setTableNameState).toHaveBeenCalledWith(0);
      expect(setGridViewToggle).toHaveBeenCalledTimes(1);
      expect(setGridViewToggle).toHaveBeenCalledWith(false);
    })
  })
})