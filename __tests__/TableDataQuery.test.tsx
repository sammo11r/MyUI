import { waitFor } from "@testing-library/react";
import { queryTableData } from "../components/TableDataQuery";
import "@testing-library/jest-dom";
import { loadingState as columnStates } from "../consts/enum";
import { hasuraProps } from "../consts/hasuraProps";
import { userConfig } from "../consts/demoUserConfig";
import { UserConfig } from "../utils/customTypes";

window.alert = jest.fn();

const useQuery = jest.spyOn(require("react-query"), "useQuery");
useQuery.mockImplementation((array: any, funct: any) => {
  funct();
});

const hasuraHeaders = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTY1NTA2MDUwOS4xNTEsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4ifSwiZXhwIjoxNjU1MTAzNzA5fQ.rYzY6y1smWPyeSoEbcOHeqNB0XHimWgDKHVjZC1Tf6Q"
} as HeadersInit;

describe("Tests for TableDataQuery", () => {
  it("When error is returned", async () => {
    const query = "mockQuery";
    const tableNameState = "mockTableName";
    const setTableState = jest.fn();
    const isBaseTable = true;
    const tableName = "mockTableName";
    const dashboardName = "mockDashboardName";
    const setUserConfigQueryInput = jest.fn();
    const mediaDisplaySetting = "mockMediaDisplaySetting";
    const gridViewToggle = true;
    const t = jest.fn((t) => t);
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ errors: [{ message: "The operation exceeded the time limit allowed for this project" }] })
    })) as jest.Mock;

    expect(queryTableData({
      query,
      tableNameState,
      hasuraProps,
      hasuraHeaders,
      setTableState,
      isBaseTable,
      tableName,
      dashboardName,
      userConfig,
      setUserConfigQueryInput,
      mediaDisplaySetting,
      gridViewToggle,
      t,
      elementName: "mockElementName"
    }));
    await waitFor(() => {
      expect(setTableState).toHaveBeenCalledWith({
        data: undefined,
        columns: [],
        columnsReady: true,
        dataState: columnStates.READY,
      })
    })
  })

  it("Query returns an empty table", async () => {
    const query = "query mockQuery { mockTableName { mockAttr1, mockAttr2 } }";
    const tableNameState = "mockTableName";
    const setTableState = jest.fn();
    const isBaseTable = true;
    const tableName = "mockTableName";
    const dashboardName = "mockDashboardName";
    const setUserConfigQueryInput = jest.fn();
    const mediaDisplaySetting = "mockMediaDisplaySetting";
    const gridViewToggle = true;
    const t = jest.fn();
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve({ data: { mockTableName: [] } })
    })) as jest.Mock;

    queryTableData({
      query,
      tableNameState,
      hasuraProps,
      hasuraHeaders,
      setTableState,
      isBaseTable,
      tableName,
      dashboardName,
      userConfig,
      setUserConfigQueryInput,
      mediaDisplaySetting,
      gridViewToggle,
      t,
      elementName: "mockElementName"
    })
    await waitFor(() => {
      expect(setTableState).toHaveBeenCalledWith({
        data: undefined,
        columns: [{
          dataIndex: " mockAttr1",
          key: " mockAttr1",
          title: " mockAttr1",
        },
        {
          dataIndex: " mockAttr2 ",
          key: " mockAttr2 ",
          title: " mockAttr2 ",
        },],
        columnsReady: true,
        dataState: columnStates.READY
      })
    })
  })

  it("BaseTable Query returns a non-empty table", async () => {
    const query = "query mockQuery { mockTableName { mockAttr1, mockAttr2 } }";
    const tableNameState = "mockTableName";
    const setTableState = jest.fn();
    const isBaseTable = true;
    const tableName = "mockTableName";
    const dashboardName = "mockDashboardName";
    const setUserConfigQueryInput = jest.fn();
    const mediaDisplaySetting = "mockMediaDisplaySetting";
    const gridViewToggle = true;
    const t = jest.fn();
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            mockTableName: [
              { mockAttr1: "mockVal1", mockAttr2: "mockVal2" },
              { mockAttr1: "mockVal3", mockAttr2: "mockVal4" }
            ]
          }
        }
      )
    })) as jest.Mock;

    queryTableData({
      query,
      tableNameState,
      hasuraProps,
      hasuraHeaders,
      setTableState,
      isBaseTable,
      tableName,
      dashboardName,
      userConfig,
      setUserConfigQueryInput,
      mediaDisplaySetting,
      gridViewToggle,
      t,
      elementName: "mockElementName"
    })
    await waitFor(() => {
      expect(setTableState).toHaveBeenCalledWith({
        data: [
          {
            key: "0",
            mockAttr1: "mockVal1",
            mockAttr2: "mockVal2",
          },
          {
            key: "1",
            mockAttr1: "mockVal3",
            mockAttr2: "mockVal4",
          },
        ],
        columns: [{
          dataIndex: "mockAttr1",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr10",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr1",
        },
        {
          dataIndex: "mockAttr2",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr21",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr2",
        },],
        columnsReady: true,
        dataState: columnStates.READY
      })
    })
  })

  it("Basetable query not yet defined in userconfig", async () => {
    const query = "query mockQuery { mockTableName { mockAttr1, mockAttr2 } }";
    const tableNameState = "mockTableName";
    const setTableState = jest.fn();
    const isBaseTable = true;
    const tableName = "mockTableName";
    const dashboardName = "test";
    const setUserConfigQueryInput = jest.fn();
    const mediaDisplaySetting = "mockMediaDisplaySetting";
    const gridViewToggle = true;
    const t = jest.fn();
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            mockTableName: [
              { mockAttr1: "mockVal1", mockAttr2: "mockVal2" },
              { mockAttr1: "mockVal3", mockAttr2: "mockVal4" }
            ]
          }
        }
      )
    })) as jest.Mock;

    queryTableData({
      query,
      tableNameState,
      hasuraProps,
      hasuraHeaders,
      setTableState,
      isBaseTable,
      tableName,
      dashboardName,
      userConfig,
      setUserConfigQueryInput,
      mediaDisplaySetting,
      gridViewToggle,
      t,
      elementName: "mockElementName"
    })
    await waitFor(() => {
      expect(setTableState).toHaveBeenCalledWith({
        data: [
          {
            key: "0",
            mockAttr1: "mockVal1",
            mockAttr2: "mockVal2",
          },
          {
            key: "1",
            mockAttr1: "mockVal3",
            mockAttr2: "mockVal4",
          },
        ],
        columns: [{
          dataIndex: "mockAttr1",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr10",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr1",
        },
        {
          dataIndex: "mockAttr2",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr21",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr2",
        },],
        columnsReady: true,
        dataState: columnStates.READY
      })
    })
  })

  it("Non-baseTable Query returns a non-empty table, ordering not yet defined", async () => {
    const query = "query mockQuery { mockTableName { mockAttr1, mockAttr2 } }";
    const tableNameState = "mockTableName";
    const setTableState = jest.fn();
    const isBaseTable = false;
    const tableName = "mockTableName";
    const dashboardName = "test";

    const setUserConfigQueryInput = jest.fn();
    const mediaDisplaySetting = "mockMediaDisplaySetting";
    const gridViewToggle = true;
    const t = jest.fn();
    const userConfigWithGrid = {
      "dashboards": [{
          "name": "test",
          "dashboardElements": [
              {
                  "name": "mockElementName",
                  "x": 3,
                  "y": 6,
                  "w": 1,
                  "h": 1,
                  "type": 0,
                  "query": "Add text here..."
              }
          ]
      }
      ],
      "uiPreferences": {
          "language": "en"
      },
      "baseTables": [{}]
    } as UserConfig;
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            mockTableName: [
              { mockAttr1: "mockVal1", mockAttr2: "mockVal2" },
              { mockAttr1: "mockVal3", mockAttr2: "mockVal4" }
            ]
          }
        }
      )
    })) as jest.Mock;

    queryTableData({
      query,
      tableNameState,
      hasuraProps,
      hasuraHeaders,
      setTableState,
      isBaseTable,
      tableName,
      dashboardName,
      userConfig: userConfigWithGrid,
      setUserConfigQueryInput,
      mediaDisplaySetting,
      gridViewToggle,
      t,
      elementName: "mockElementName"
    })
    await waitFor(() => {
      expect(setTableState).toHaveBeenCalledWith({
        data: [
          {
            key: "0",
            mockAttr1: "mockVal1",
            mockAttr2: "mockVal2",
          },
          {
            key: "1",
            mockAttr1: "mockVal3",
            mockAttr2: "mockVal4",
          },
        ],
        columns: [{
          dataIndex: "mockAttr1",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr10",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr1",
        },
        {
          dataIndex: "mockAttr2",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr21",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr2",
        },],
        columnsReady: true,
        dataState: columnStates.READY
      })
    })
  })

  it("Non-baseTable Query returns a non-empty table, ordering already defined", async () => {
    const query = "query mockQuery { mockTableName { mockAttr1, mockAttr2 } }";
    const tableNameState = "mockTableName";
    const setTableState = jest.fn();
    const isBaseTable = false;
    const tableName = "mockTableName";
    const dashboardName = "test";

    const setUserConfigQueryInput = jest.fn();
    const mediaDisplaySetting = "mockMediaDisplaySetting";
    const gridViewToggle = true;
    const t = jest.fn();
    const userConfigWithGrid = {
      "dashboards": [{
          "name": "test",
          "dashboardElements": [
              {
                  "name": "mockElementName",
                  "x": 3,
                  "y": 6,
                  "w": 1,
                  "h": 1,
                  "type": 0,
                  "query": "Add text here...",
                  "ordering": {
                    "by": undefined,
                    "direction": undefined,
                  }
              }
          ]
      }
      ],
      "uiPreferences": {
          "language": "en"
      },
      "baseTables": [{}]
    } as UserConfig;
    global.fetch = jest.fn(() => Promise.resolve({
      json: () => Promise.resolve(
        {
          data: {
            mockTableName: [
              { mockAttr1: "mockVal1", mockAttr2: "mockVal2" },
              { mockAttr1: "mockVal3", mockAttr2: "mockVal4" }
            ]
          }
        }
      )
    })) as jest.Mock;

    queryTableData({
      query,
      tableNameState,
      hasuraProps,
      hasuraHeaders,
      setTableState,
      isBaseTable,
      tableName,
      dashboardName,
      userConfig: userConfigWithGrid,
      setUserConfigQueryInput,
      mediaDisplaySetting,
      gridViewToggle,
      t,
      elementName: "mockElementName"
    })
    await waitFor(() => {
      expect(setTableState).toHaveBeenCalledWith({
        data: [
          {
            key: "0",
            mockAttr1: "mockVal1",
            mockAttr2: "mockVal2",
          },
          {
            key: "1",
            mockAttr1: "mockVal3",
            mockAttr2: "mockVal4",
          },
        ],
        columns: [{
          dataIndex: "mockAttr1",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr10",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr1",
        },
        {
          dataIndex: "mockAttr2",
          defaultSortOrder: null,
          editable: true,
          key: "mockAttr21",
          render: expect.any(Function),
          showSorterTooltip: false,
          sorter: expect.any(Function),
          title: "mockAttr2",
        },],
        columnsReady: true,
        dataState: columnStates.READY
      })
    })
  })
})