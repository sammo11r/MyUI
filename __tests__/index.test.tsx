import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../pages/index";
import { getServerSideProps } from "../pages/index";
import { SessionProvider } from "next-auth/react";
import "@testing-library/jest-dom"

import { hasuraProps } from "../consts/hasuraProps";
import { userConfig as demoConfig } from "../consts/demoUserConfig";
import { loadingState } from "../consts/enum";
import { DashboardElementType } from "../utils/customTypes";

const systemProps = {
    "mediaDisplaySetting": "MEDIA"
};

jest.mock("jwt-decode", () => () => ({
    "sub": "123",
    "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["admin"]
    }
}));

jest.mock("next/router", () => ({
    useRouter: () => ({pathname: "mockPathname", asPath: "mockAsPath", query: "mockQuery"})
}))

jest.mock("../components/BaseTable", () => ({ name }: { name: string }) => {
    return <div data-testid={`mock-basetable-${name}`} />
})

let configQueryExecuted = false;
let tableQueryExecuted = false;
jest.mock("../components/BaseQueries", () => ({
    configurationQuery: jest.fn(async (
        userId,
        hasuraHeaderVersioning,
        setUserConfigQueryInput,
        setDashboardNames,
        setUserConfig,
        router
    ) => {
        if (!configQueryExecuted) {
            setDashboardNames(demoConfig.dashboards.map((dashboard) => dashboard.name));
            setUserConfig(demoConfig);
            configQueryExecuted = true;
        } 
        return Promise.resolve({
            isSuccessConfig: true
        })
    }),
    updateUserConfiguration: jest.fn(),
    tableQuery: jest.fn(async (hasuraHeaders, setSiderState) => {
        if (!tableQueryExecuted) {
            setSiderState({
                tableNames: [],
                tableNameState: loadingState.READY
            });
            tableQueryExecuted = true;
        }
        return Promise.resolve({
            tableNames: ["mockBaseTable"]
        })
    }),
    defaultConfiguration: {}
}))

global.structuredClone = (item) => JSON.parse(JSON.stringify(item));


describe("tests for viewing of basetables", () => {
    beforeEach(() => {
        configQueryExecuted = false;
        tableQueryExecuted = false;
    })

    demoConfig.baseTables = [{
        name: "mockBaseTable",
        columnNames: ["columnName1", "columnName2"],
        ordering: {
            by: "none",
            direction: "none"
        }
    }];

    it("Navigate to basetable", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Navigate to basetable
            const baseTableMenu = screen.getByText("basetable.sidebar");
            fireEvent.click(baseTableMenu);
        })
        const mockBaseTableMenuItem = screen.getByText("mockBaseTable");
        fireEvent.click(mockBaseTableMenuItem);

        const mockBaseTable = screen.getByTestId("mock-basetable-mockBaseTable");
        expect(mockBaseTable).toBeInTheDocument();
    })
})

describe("tests for Edit mode", () => {
    beforeEach(() => {
        configQueryExecuted = false;
        tableQueryExecuted = false;
    })

    it("Navigate to dashboard and enter and exit editmode without changes", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Navigate to dashboard
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const testDashboard = screen.getByText("test");
            fireEvent.click(testDashboard);

            // Toggle editmode twice to enter and exit it again
            const editmodeButton = screen.getByTestId("header-editmode-element");
            fireEvent.click(editmodeButton);
            fireEvent.click(editmodeButton);
        })
    })

    it("Navigate to dashboard and enter and exit editmode with changes", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Navigate to dashboard
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const testDashboard = screen.getByText("test");
            fireEvent.click(testDashboard);
        })

        // Enter editmode
        const editmodeButton = screen.getByTestId("header-editmode-element");
        fireEvent.click(editmodeButton);

        // Modify a dashboard element
        const dashboardElement = screen.getAllByText("Add text here...")[0];
        fireEvent.doubleClick(dashboardElement);
        const elementMenuInput = screen.getByTestId("edit-element-modal-input-field");
        fireEvent.change(elementMenuInput, { target: { value: "updatedText" }});
        const submitInputButton = screen.getByText(/ok/i);
        fireEvent.click(submitInputButton);
        
        await waitFor(() => {
            expect(submitInputButton).not.toBeInTheDocument();
            screen.getByText("updatedText");
        })

        // Exit editmode
        fireEvent.click(editmodeButton);

        // Choose "save changes" when asked if you want to save
        await waitFor(() => {
            const confirmationPrompt = screen.getByText("dashboard.saveprompt.title");
            expect(confirmationPrompt).toBeInTheDocument();
        })
        const saveAndLeaveButton = screen.getByText("dashboard.saveprompt.savetext");
        fireEvent.click(saveAndLeaveButton);

        // Waitfor "save successfull" notice
        await waitFor(() => {
            const saveSuccesfullNotice = screen.getByText("dashboard.savenotification.message");
            expect(saveSuccesfullNotice).toBeInTheDocument();
        })
    })

    it("Navigate to dashboard and enter and exit editmode with changes", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Navigate to dashboard
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const testDashboard = screen.getByText("test");
            fireEvent.click(testDashboard);
        })

        // Enter editmode
        const editmodeButton = screen.getByTestId("header-editmode-element");
        fireEvent.click(editmodeButton);

        // Modify a dashboard element
        const dashboardElement = screen.getAllByText("Add text here...")[0];
        fireEvent.doubleClick(dashboardElement);
        const elementMenuInput = screen.getByTestId("edit-element-modal-input-field");
        fireEvent.change(elementMenuInput, { target: { value: "updatedText2" }});
        const submitInputButton = screen.getByText(/ok/i);
        fireEvent.click(submitInputButton);
        
        await waitFor(() => {
            expect(submitInputButton).not.toBeInTheDocument();
            screen.getByText("updatedText2");
        })

        // Exit editmode
        fireEvent.click(editmodeButton);

        // Choose "discard changes" when asked if you want to save
        await waitFor(() => {
            const confirmationPrompt = screen.getByText("dashboard.saveprompt.title");
            expect(confirmationPrompt).toBeInTheDocument();
        })
        const discardAndLeaveButton = screen.getByText("dashboard.saveprompt.discardtext");
        fireEvent.click(discardAndLeaveButton);
    })

    it("Navigate to dashboard, enter editmode, and cancel exiting editmode", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Navigate to dashboard
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const testDashboard = screen.getByText("test");
            fireEvent.click(testDashboard);
        })

        // Enter editmode
        const editmodeButton = screen.getByTestId("header-editmode-element");
        fireEvent.click(editmodeButton);

        // Modify a dashboard element
        const dashboardElement = screen.getAllByText("Add text here...")[0];
        fireEvent.doubleClick(dashboardElement);
        const elementMenuInput = screen.getByTestId("edit-element-modal-input-field");
        fireEvent.change(elementMenuInput, { target: { value: "updatedText2" }});
        const submitInputButton = screen.getByText(/ok/i);
        fireEvent.click(submitInputButton);
        
        await waitFor(() => {
            expect(submitInputButton).not.toBeInTheDocument();
            screen.getByText("updatedText2");
        })

        // Exit editmode
        fireEvent.click(editmodeButton);

        // Choose "discard changes" when asked if you want to save
        await waitFor(() => {
            const confirmationPrompt = screen.getByText("dashboard.saveprompt.title");
            expect(confirmationPrompt).toBeInTheDocument();
        })
        const cancelExitButton = screen.getByText("table.cancel");
        fireEvent.click(cancelExitButton);
    })

    it("Navigate to dashboard, enter editmode, and cancel exiting editmode", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Navigate to dashboard
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const testDashboard = screen.getByText("test");
            fireEvent.click(testDashboard);
        })

        // Enter editmode
        const editmodeButton = screen.getByTestId("header-editmode-element");
        fireEvent.click(editmodeButton);

        // Remove a dashboard element
        demoConfig.dashboards[0].dashboardElements.pop();

        // Exit editmode
        fireEvent.click(editmodeButton);

        // Choose "discard changes" when asked if you want to save
        await waitFor(() => {
            const confirmationPrompt = screen.getByText("dashboard.saveprompt.title");
            expect(confirmationPrompt).toBeInTheDocument();
        })
        const cancelExitButton = screen.getByText("table.cancel");
        fireEvent.click(cancelExitButton);
    })
});

describe("tests for Adding and removing dashboards", () => {
    beforeEach(() => {
        configQueryExecuted = false;
        tableQueryExecuted = false;
    })

    it("Add a new dashboard and delete it again", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Open dashboard modal
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const addDashboardButton = screen.getByText("dashboard.new");
            fireEvent.click(addDashboardButton);
        })

        // Add new dashboard
        let editDashboardModalInput = screen.getByTestId("modal-input");
        fireEvent.change(editDashboardModalInput, { target: { value: "newDashboard" }});
        let dashboardModalSubmitButton = screen.getByText("OK");
        fireEvent.click(dashboardModalSubmitButton);

        // Verify that the new dashboard was added
        /*await waitFor(() => {
            const modal = screen.queryByTestId("modal");
            expect(modal).toBeNull();
            expect(screen.queryByText("newDashboard")).toBeInTheDocument();
        })*/

        // Open dashboard modal
        const deleteDashboardButton = screen.getByText("dashboard.delete");
        fireEvent.click(deleteDashboardButton);

        // Delete new dashboard
        editDashboardModalInput = screen.getByTestId("modal-input");
        fireEvent.change(editDashboardModalInput, { target: { value: "newDashboard" }});
        dashboardModalSubmitButton = screen.getByText("OK");
        fireEvent.click(dashboardModalSubmitButton);

        expect(screen.queryByText("newDashboard")).toBeNull();
    })

    it("Cancel adding a new dashboard", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Open dashboard modal
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const addDashboardButton = screen.getByText("dashboard.new");
            fireEvent.click(addDashboardButton);
        })

        // Type new dashboard name but cancel the action
        let editDashboardModalInput = screen.getByTestId("modal-input");
        fireEvent.change(editDashboardModalInput, { target: { value: "newDashboard" }});
        let dashboardModalCancelButton = screen.getByText("Cancel");
        fireEvent.click(dashboardModalCancelButton);

        expect(screen.queryByText("newDashboard")).toBeNull();
    })

    it("Cancel deleting a dashboard", async () => {
        const mockSession = {
            expires: "1"
        };

        render(
            <SessionProvider session={mockSession}>
                <App hasuraProps={hasuraProps} systemProps={systemProps} />
            </SessionProvider>
        );

        await waitFor(() => {
            // Open dashboard modal
            const dashboardMenu = screen.getByText("dashboard.sidebar");
            fireEvent.click(dashboardMenu);
            const addDashboardButton = screen.getByText("dashboard.delete");
            fireEvent.click(addDashboardButton);
        })

        // Type dashboard name but cancel the action
        let editDashboardModalInput = screen.getByTestId("modal-input");
        fireEvent.change(editDashboardModalInput, { target: { value: "test" }});
        let dashboardModalCancelButton = screen.getByText("Cancel");
        fireEvent.click(dashboardModalCancelButton);

        expect(screen.queryByText("test")).toBeInTheDocument();
    })
});