import React from "react";
import TableData from "../components/TableData";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import user from "@testing-library/user-event";
import { loadingState, workspaceType } from "../consts/enum";
import { HasuraProps, UserConfig } from "../utils/customTypes";


const crypto = require("crypto");
Object.defineProperty(global.self, "crypto", {
    value: {
        getRandomValues: (arr: any) => crypto.randomBytes(arr.length),
        randomUUID: () => 0
    }
})


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    }
});

const hasuraProps: HasuraProps = {
    hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as string,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as RequestInfo
};

const hasuraHeaders = {
    "Content-Type": "application/json",
    Authorization: "mock", // Adding auth header instead of using the admin secret
} as HeadersInit;

const systemProps = {
    mediaDisplaySetting: process.env.URL_DISPLAY_SETTING as string,
};

const query = "query MyQuery { mockTable { mockAttr } }";
const dashboardName = "foo";

const encrypt = jest.fn((s) => Promise.resolve(s));
const setUserConfigQueryInput = jest.fn();
const t = jest.fn((text: string) => text);
const setGridViewToggle = jest.fn();
const style = {
    "height": "100%",
    "width": "100%",
    "overflow": "auto"
};

const userConfig = {
    "dashboards": [{
        "name": "foo",
        "dashboardElements": [
            {
                "name": "mockElementName",
                "x": 3,
                "y": 6,
                "w": 1,
                "h": 1,
                "type": 0,
                "query": "query mockQuery { mockTable { mockAttribute }}",
                "ordering": {
                    "by": "",
                    "direction": ""
                }
            }
        ]
    }
    ],
    "uiPreferences": {
        "language": "en"
    },
    "baseTables": [{
        "name": "test",
        "columnNames": [
            "date",
            "id",
            "password"
        ],
        "ordering": {
            "by": "",
            "direction": ""
        }
    },
    {
        "name": "users",
        "columnNames": [
            "date",
            "id",
            "password"
        ],
        "ordering": {
            "by": "",
            "direction": ""
        }
    }]
} as UserConfig;

let data = [{
    "date": "2022-01-01",
    "id": 1,
    "password": "mockPassword"
}];

let column = [{
    "title": "date",
    "dataIndex": "date",
    "key": "date0",
    "editable": true,
    "sorter": jest.fn(),
    "showSorterTooltip": true,
    "defaultSortOrder": null
},
{
    "title": "id",
    "dataIndex": "id",
    "key": "id1",
    "editable": true,
    "sorter": jest.fn(),
    "showSorterTooltip": true,
    "defaultSortOrder": null
},
{
    "title": "password",
    "dataIndex": "password",
    "key": "password2",
    "editable": true,
    "sorter": jest.fn(),
    "showSorterTooltip": true,
    "defaultSortOrder": null
}];


let state = loadingState.LOADING
let getLoading = false;
let newData = false;
jest.mock("../components/TableDataQuery", () => ({
    ...(jest.requireActual("../components/TableDataQuery")),
    queryTableData: jest.fn()

        .mockImplementation(
            ({ setTableState }) => {
                if (state === loadingState.LOADING) {
                    setTableState({
                        data: data,
                        columns: column,
                        columnsReady: true,
                        dataState: loadingState.READY
                    });
                    state = loadingState.READY;
                }

                if (getLoading) {
                    setTableState({
                        data: data,
                        columns: column,
                        columnsReady: false,
                        dataState: loadingState.LOADING,
                    });
                    getLoading = false;
                }

                if (newData) {
                    setTableState({
                        data: data,
                        columns: column,
                        columnsReady: true,
                        dataState: loadingState.READY,
                    });
                    newData = false;
                    console.log("NEW DATA CALLED");
                    console.log(data);
                }

            }
        )
}));

let permissionSet = false;
jest.mock("../components/EditRowsQueries", () => ({
    ...(jest.requireActual("../components/EditRowsQueries")),
    checkPermissions: jest.fn()

        .mockImplementation(
            ({ setEditable, setInsertable, setDeletable }) => {
                if (!permissionSet) {
                    setEditable(true);
                    setInsertable(true);
                    setDeletable(true);

                    permissionSet = true;
                }
            }
        )
}));

beforeEach(() => {
    state = loadingState.LOADING;
    getLoading = false;
    permissionSet = false;
    newData = false;
    jest.clearAllMocks();
    data = [{
        "date": "2022-01-01",
        "id": 1,
        "password": "mockPassword"
    }];
    column = [{
        "title": "date",
        "dataIndex": "date",
        "key": "date0",
        "editable": true,
        "sorter": jest.fn(),
        "showSorterTooltip": true,
        "defaultSortOrder": null
    },
    {
        "title": "id",
        "dataIndex": "id",
        "key": "id1",
        "editable": true,
        "sorter": jest.fn(),
        "showSorterTooltip": true,
        "defaultSortOrder": null
    },
    {
        "title": "password",
        "dataIndex": "password",
        "key": "password2",
        "editable": true,
        "sorter": jest.fn(),
        "showSorterTooltip": true,
        "defaultSortOrder": null
    }];
});


describe("TableData functions as expected in BaseTable form", () => {
    const isBaseTable = true;

    it("renders basetable when dataState is ready", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const table = screen.getByTestId("table-test");
        const edit = screen.getByTestId("TableData-Edit");

        expect(table).toBeInTheDocument();
        expect(edit).toBeInTheDocument();
    });

    it("displays row and column count correctly", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const rowExp = data.length
        const colExp = column.length

        const footer = screen.getByText(/table.rowCount/i);
        //@ts-ignore
        const footerText = footer.textContent.split(" ");

        const rowFound = parseInt(footerText[1]);
        const colFound = parseInt(footerText[4]);

        expect(rowFound).toBe(rowExp);
        expect(colFound).toBe(colExp);
    });


    it("renders loader when data is loading", () => {
        getLoading = true;

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const loader = screen.getByTestId("tableData-loader");

        expect(loader).toBeInTheDocument();
    });


    it("renders save button, cancel button, and editable cells when clicked on edit button", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");

        await user.click(edit);

        const save = screen.getByTestId("TableData-Save");
        const cancel = screen.getByTestId("TableData-Cancel");

        expect(save).toBeInTheDocument();
        expect(cancel).toBeInTheDocument();

        const title1 = column[0]['title'];
        const title2 = column[1]['title'];
        const cell1 = screen.getByTestId("EditCell-input-" + `${title1}`);
        const cell2 = screen.getByTestId("EditCell-input-" + `${title2}`);

        expect(cell1).toBeInTheDocument();
        expect(cell2).toBeInTheDocument();
    });


    it("hides editable cells when clicked on cancel and confirmed cancel", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");
        await user.click(edit);

        const cancel = screen.getByTestId("TableData-Cancel");
        await user.click(cancel);

        const ok = screen.getByText('OK');
        await user.click(ok);

        const title1 = column[0]['title'];
        const title2 = column[1]['title'];
        const cell1 = screen.queryByTestId("editCell-input-" + `${title1}`);
        const cell2 = screen.queryByTestId("editCell-input-" + `${title2}`);

        expect(cell1).not.toBeInTheDocument();
        expect(cell2).not.toBeInTheDocument();
    });


    it("updates cell values when clicked on save after editing", async () => {

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ value: {} })
        })) as jest.Mock;

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");
        fireEvent.click(edit);

        const save = screen.getByTestId("TableData-Save");


        const title2 = column[1]['title'];
        const cellToEdit = screen.getByTestId("EditCell-input-" + `${title2}`);

        fireEvent.change(cellToEdit, { target: { value: "5" }})
        data[0]['id'] = 5;
        newData = true;
        fireEvent.click(save)

        await waitFor(() => {
            expect(save).not.toBeInTheDocument();
            // TODO: test for table to have been updated,
            // currently does not rerender with updated value for some reason
        })
    });

    it("values remain unchanged when saving after not changing anything", async () => {

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ errors: 0, value: 0 })
        })) as jest.Mock;

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");
        fireEvent.click(edit);

        const save = screen.getByTestId("TableData-Save");

        fireEvent.click(save)

        await waitFor(() => {
            expect(save).not.toBeInTheDocument();
        })
        //data[0]['id'] = 15;
        //newData = true;

        //TODO: New data does not show up on the table after clicking on save
        //waitFor(() => {
        //    screen.debug()
        //})
    });

    it("Failes to updates cell values when clicked on save after editing with empty input field", async () => {

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ errors: {} })
        })) as jest.Mock;

        const consoleSpy = jest.spyOn(console, "log");

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");
        fireEvent.click(edit);

        const save = screen.getByTestId("TableData-Save");

        const title2 = column[1]['title'];
        const cellToEdit = screen.getByTestId("EditCell-input-" + `${title2}`);

        //await user.type(cellToEdit, "5")
        fireEvent.change(cellToEdit, { target: { value: "" }})
        fireEvent.click(save)

        await waitFor(() => {
            expect(consoleSpy).toHaveBeenCalledWith(
                "Validate Failed:", 
                {
                    errorFields: [{
                        errors: ["id table.empty"],
                        name: ["id"],
                        warnings: [],
                    }],
                    outOfDate: false,
                    values: {
                        date: "2022-01-01",
                        id: "",
                        password: "mockPassword"
                    }
                });
        })
    });

    it("shows an alert when setAlert is called by AddDeleteRowMenu", async () => {

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ errors: [{message: "mockErrorMessage"}] })
        })) as jest.Mock;

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const deleteRowButton = screen.getByTestId("delete-row-button");
        fireEvent.click(deleteRowButton);

        const confirmDeleteButton = screen.getByTestId("delete-confirm-button");
        fireEvent.click(confirmDeleteButton);

        await waitFor(() => {
            const errorMessage = screen.getByText("mockErrorMessage");
            expect(errorMessage).toBeInTheDocument();
        })

        const errorCloseButton = screen.getAllByRole("button")[0];
        fireEvent.click(errorCloseButton);

        expect(screen.queryByText("mockErrorMessage")).toBeNull();
    });

    it("calls setUserConfigQueryInput when clicked on sort", async () => {
        data = [{
            "date": "2022-01-01",
            "id": 1,
            "password": "mockPassword"
        },
        {
            "date": "2022-01-01",
            "id": 2,
            "password": "mockPassword"
        }]

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"test"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const columns = screen.getAllByRole("columnheader");
        const idHeader = columns[2];

        expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
        fireEvent.click(idHeader);
        
        await waitFor(() => {
            expect(setUserConfigQueryInput).toHaveBeenCalledTimes(1)
        });
    });
});

describe("Table data function as expected in users table form",() => {
    const isBaseTable = true;

    it("encrypt is called when password is edited", async () => {

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ value: {} })
        })) as jest.Mock;

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"users"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");
        fireEvent.click(edit);

        const save = screen.getByTestId("TableData-Save");


        const title3 = column[2]['title'];
        const cellToEdit = screen.getByTestId("EditCell-input-" + `${title3}`);

        fireEvent.change(cellToEdit, { target: { value: "newPassword" }});
        fireEvent.click(save);

        await waitFor(() => {
            expect(save).not.toBeInTheDocument();
            expect(encrypt).toBeCalledTimes(1);
            expect(encrypt).toBeCalledWith({password: "newPassword"});
        })
    });

    it("encrypt is not called when a value that is not a password is edited", async () => {

        global.fetch = jest.fn(() => Promise.resolve({
            json: () => Promise.resolve({ value: {} })
        })) as jest.Mock;

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"users"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.BASE_TABLE}
                />
            </QueryClientProvider>
        );

        const edit = screen.getByTestId("TableData-Edit");
        fireEvent.click(edit);

        const save = screen.getByTestId("TableData-Save");


        const title2 = column[1]['title'];
        const cellToEdit = screen.getByTestId("EditCell-input-" + `${title2}`);

        fireEvent.change(cellToEdit, { target: { value: "5" }});
        fireEvent.click(save);

        await waitFor(() => {
            expect(save).not.toBeInTheDocument();
            expect(encrypt).toBeCalledTimes(0);
        })
    });
})

describe("Table data function as expected in dashboard form",() => {
    const isBaseTable = false;

    it("renders dashboard table when dataState is ready", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    // @ts-ignore
                    tableName={undefined}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.DISPLAY_DASHBOARD}
                />
            </QueryClientProvider>
        );

        const table = screen.getByTestId("table-mockTable");
        const edit = screen.getByTestId("TableData-Edit");

        expect(table).toBeInTheDocument();
        expect(edit).toBeInTheDocument();
    });

    it("updates selected rows accordingly when checkbox is clicked", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    // @ts-ignore
                    tableName={undefined}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.DISPLAY_DASHBOARD}
                />
            </QueryClientProvider>
        );

        const table = screen.getByTestId("table-mockTable");
        const edit = screen.getByTestId("TableData-Edit");
        const checkBox = screen.getAllByRole("checkbox")[0];

        // select row
        fireEvent.click(checkBox);
        
        /* @TODO: test if the selectedRow state is updated, 
         * Perhaps mock AddDeleteRowMenu and check if it is called
         * with the corrected state? When I did this all other testcases broke though.
         */
        
        // unselect row again
        fireEvent.click(checkBox);

        expect(table).toBeInTheDocument();
        expect(edit).toBeInTheDocument();
    });

    it("informs the user when dataState is ready and no data was found", () => {
        column = [];
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"mockElementName"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.DISPLAY_DASHBOARD}
                />
            </QueryClientProvider>
        );

        const noDataWarning = screen.getByText("basetable.warning")
        expect(noDataWarning).toBeInTheDocument();
    });

    it("AddDeleteRowMenu is not rendered when in editmode", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"mockElementName"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.EDIT_DASHBOARD}
                />
            </QueryClientProvider>
        );

        const addRowButton = screen.queryByText("add-row-button");
        const deleteRowButton = screen.queryByText("delete-row-button");

        expect(addRowButton).toBeNull();
        expect(deleteRowButton).toBeNull();
    });

    it("calls setUserConfigQueryInput when clicked on sort", async () => {
        data = [{
            "date": "2022-01-01",
            "id": 1,
            "password": "mockPassword"
        },
        {
            "date": "2022-01-01",
            "id": 2,
            "password": "mockPassword"
        }]

        render(
            <QueryClientProvider client={queryClient}>
                <TableData
                    encrypt={encrypt}
                    hasuraProps={hasuraProps}
                    query={query}
                    style={style}
                    systemProps={systemProps}
                    userConfig={userConfig}
                    setUserConfigQueryInput={setUserConfigQueryInput}
                    dashboardName={dashboardName}
                    hasuraHeaders={hasuraHeaders}
                    t={t}
                    isBaseTable={isBaseTable}
                    tableName={"mockElementName"}
                    gridViewToggle={true}
                    setGridViewToggle={setGridViewToggle}
                    mode={workspaceType.DISPLAY_DASHBOARD}
                />
            </QueryClientProvider>
        );

        const columns = screen.getAllByRole("columnheader");
        const idHeader = columns[2];

        expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
        fireEvent.click(idHeader);
        
        await waitFor(() => {
            expect(setUserConfigQueryInput).toHaveBeenCalledTimes(1)
        });
    });
})