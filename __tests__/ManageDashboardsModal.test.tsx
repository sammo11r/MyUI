import React from "react";
import ManageDashboardsModal from "../components/ManageDashboardsModal";
import { render, screen, cleanup, waitFor, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import user from "@testing-library/user-event";
import { userConfig } from "../consts/demoUserConfig";
import { workspaceType as workspaceStates } from "../consts/enum";
import { modalType } from "../consts/enum";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  }
});

const dashboardNames = ["lorem", "ipsum"];
const dashboardAddKey = "dashboardAdd";
const dashboardRemoveKey = "dashboardDelete";

const setVisible = jest.fn();
const setDashboardNames = jest.fn();
const setUserConfigQueryInput = jest.fn();
const displayDashboard = jest.fn();
const setWorkspaceState = jest.fn();
const saveDashboardChanges = jest.fn();

const workspaceState = {
  "displaying": workspaceStates.DISPLAY_DASHBOARD,
  "name": "test"
}

const type = modalType.ADD;

const t = jest.fn();
t.mockImplementation((text: string) => text);

afterAll(cleanup);

describe("renders ManageDashboardModal correctly", () => {
  it("renders when isVisible=true", () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const modal = screen.getByTestId("modal");

    expect(modal).toBeInTheDocument();
  });


  it("does not render when isVisible=false", () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={false}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const modal = screen.queryByTestId("modal");

    expect(modal).not.toBeInTheDocument();
  });

  it("setVisible is called on cancel when adding", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const cancel = screen.getByText("Cancel");

    expect(setVisible).toHaveBeenCalledTimes(0);

    await user.click(cancel);

    expect(setVisible).toHaveBeenCalledTimes(1);
    expect(setVisible).toHaveBeenCalledWith(false);

    expect(setDashboardNames).toHaveBeenCalledTimes(0);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
    expect(displayDashboard).toHaveBeenCalledTimes(0);
  });


  it("setVisible is called on cancel when removing", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const cancel = screen.getByText("Cancel");

    expect(setVisible).toHaveBeenCalledTimes(0);

    await user.click(cancel);

    expect(setVisible).toHaveBeenCalledTimes(1);
    expect(setVisible).toHaveBeenCalledWith(false);

    expect(setDashboardNames).toHaveBeenCalledTimes(0);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
    expect(displayDashboard).toHaveBeenCalledTimes(0);
  });


  it("functions are called on OK when adding a dashboard", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText("OK");
    const input = screen.getByTestId("modal-input");
    const queryText = "test";

    expect(setVisible).toHaveBeenCalledTimes(0);
    expect(setDashboardNames).toHaveBeenCalledTimes(0);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
    expect(displayDashboard).toHaveBeenCalledTimes(0);

    await user.type(input, queryText);
    await user.click(ok);

    expect(setVisible).toHaveBeenCalledTimes(1);
    expect(setDashboardNames).toHaveBeenCalledTimes(1);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(1);
    expect(displayDashboard).toHaveBeenCalledTimes(1);

    expect(setDashboardNames).toBeCalledWith(dashboardNames);
    expect(setUserConfigQueryInput).toBeCalledWith(userConfig);
    expect(displayDashboard).toBeCalledWith(queryText, userConfig);
  });

  it("no functions are called on OK when dashboardtype !== ADD and dashboardtype !== DELETE", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          // @ts-ignore
          type={undefined}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText("OK");
    const input = screen.getByTestId("modal-input");
    const queryText = "test";

    expect(setVisible).toHaveBeenCalledTimes(0);
    expect(setDashboardNames).toHaveBeenCalledTimes(0);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
    expect(displayDashboard).toHaveBeenCalledTimes(0);

    await user.type(input, queryText);
    await user.click(ok);

    expect(setVisible).toHaveBeenCalledTimes(0);
    expect(setDashboardNames).toHaveBeenCalledTimes(0);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(0);
    expect(displayDashboard).toHaveBeenCalledTimes(0);
  });

  it("adds a dashboard name to the dashboardNames and userConfig", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText("OK");
    const input = screen.getByTestId("modal-input");
    const queryText = "test2";
    const dashLength = dashboardNames.length
    const confLength = userConfig.dashboards.length;

    await user.type(input, queryText);
    await user.click(ok);

    expect(dashboardNames.length).toBe(dashLength + 1);
    expect(userConfig.dashboards.length).toBe(confLength + 1);
  });

  it("setUploadState is called when using file upload", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText("OK");
    const uploadInput = screen.getByTestId("json-input");
    const input = screen.getByTestId("modal-input");
    const queryText = "test3";
    const dashLength = dashboardNames.length
    const confLength = userConfig.dashboards.length;
    
    const file = new File(['{ "mockAttr": "mockValue"}'], "mockFile.json", { type: "json" });

    fireEvent.change(uploadInput, { target: { files: [file] }})
    fireEvent.change(input, { target: { value: queryText }});
    fireEvent.click(ok);

    await waitFor(() => {
      expect(dashboardNames.length).toBe(dashLength + 1);
      expect(userConfig.dashboards.length).toBe(confLength + 1);
      expect(saveDashboardChanges).toHaveBeenCalledTimes(1);
      expect(saveDashboardChanges).toHaveBeenCalledWith(userConfig, {"dashboard": {"dashboardElements": [], "name": "test3"}});
    })
  });

  it("removes a dashboard name from dashboardNames and userConfig", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={modalType.REMOVE}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText("OK");
    const input = screen.getByTestId("modal-input");
    const queryText = "lorem";

    await user.type(input, queryText);
    await user.click(ok);

    await waitFor(async () => {
      const yes = screen.getByText("dashboard.modal.removewarning.confirmText");
      await user.click(yes);
    })

    await waitFor(() => {
      expect(setDashboardNames).toHaveBeenCalledTimes(1);
      expect(setDashboardNames).toHaveBeenCalledWith(["ipsum", "test", "test2", "test3"]);
      expect(setWorkspaceState).not.toHaveBeenCalled();
    })
  });

  it("removes a dashboard name from dashboardNames and userConfig and calls" +
    "setWorkspaceState when deleting the dashboard currently displayed in the workspace",
    async () => {
      jest.clearAllMocks();

      render(
        <QueryClientProvider client={queryClient}>
          <ManageDashboardsModal
            isVisible={true}
            setVisible={setVisible}
            dashboardNames={dashboardNames}
            setDashboardNames={setDashboardNames}
            dashboardAddKey={dashboardAddKey}
            dashboardRemoveKey={dashboardRemoveKey}
            userConfig={userConfig}
            setUserConfigQueryInput={setUserConfigQueryInput}
            displayDashboard={displayDashboard}
            setWorkspaceState={setWorkspaceState}
            workspaceState={{
              "displaying": workspaceStates.DISPLAY_DASHBOARD,
              "name": "lorem"
            }}
            type={modalType.REMOVE}
            t={t}
            saveDashboardChanges={saveDashboardChanges}
          />
        </QueryClientProvider>
      );

      const ok = screen.getByText("OK");
      const input = screen.getByTestId("modal-input");
      const queryText = "lorem";

      await user.type(input, queryText);
      await user.click(ok);

      await waitFor(async () => {
        const yes = screen.getByText("dashboard.modal.removewarning.confirmText");
        await user.click(yes);
      })

      await waitFor(() => {
        expect(setDashboardNames).toHaveBeenCalledTimes(1);
        expect(setDashboardNames).toHaveBeenCalledWith(["ipsum", "test", "test2", "test3"]);
        expect(setWorkspaceState).toHaveBeenCalledTimes(1);
      })
    });


  it("checks name validity when adding dashboard", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={type}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText('OK');
    const input = screen.getByTestId('modal-input');

    expect(ok).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    let errMsg = screen.queryByText('dashboard.modal.add.error');

    expect(errMsg).not.toBeInTheDocument();

    const include = dashboardNames.includes('ipsum');

    expect(include).toBeTruthy();

    await user.type(input, 'ipsum');
    await user.click(ok);

    errMsg = screen.queryByText('dashboard.modal.add.error');

    expect(errMsg).toBeInTheDocument();
  });


  it("does not remove dashboards when clicked on OK", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={modalType.REMOVE}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText("OK");
    const input = screen.getByTestId("modal-input");
    const queryText = "lorem";
    const dashLength = dashboardNames.length
    const confLength = userConfig.dashboards.length;

    await user.type(input, queryText);
    await user.click(ok);

    expect(dashboardNames.length).toBe(dashLength);
    expect(userConfig.dashboards.length).toBe(confLength);
  });


  it("checks name validity when removing a dashboard", async () => {
    jest.clearAllMocks();

    render(
      <QueryClientProvider client={queryClient}>
        <ManageDashboardsModal
          isVisible={true}
          setVisible={setVisible}
          dashboardNames={dashboardNames}
          setDashboardNames={setDashboardNames}
          dashboardAddKey={dashboardAddKey}
          dashboardRemoveKey={dashboardRemoveKey}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          displayDashboard={displayDashboard}
          setWorkspaceState={setWorkspaceState}
          workspaceState={workspaceState}
          type={modalType.REMOVE}
          t={t}
          saveDashboardChanges={saveDashboardChanges}
        />
      </QueryClientProvider>
    );

    const ok = screen.getByText('OK');
    const input = screen.getByTestId("modal-input");

    expect(ok).toBeInTheDocument();
    expect(input).toBeInTheDocument();

    let errMsg = screen.queryByText("dashboard.modal.remove.error");

    expect(errMsg).not.toBeInTheDocument();

    // TODO: Confirmation modal does not show in test renderer
    // await user.type(input, "foo");
    // await user.click(ok);

    // errMsg = screen.queryByText("dashboard.modal.remove.error")

    // expect(errMsg).toBeInTheDocument();
  });
})