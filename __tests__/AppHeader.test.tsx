import React from "react";
import AppHeader from "../components/AppHeader";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { workspaceType as workspaceStates } from "../consts/enum";
import { userConfig } from "../consts/demoUserConfig";

const userRoles: string[] = ["user"];
const t = jest.fn((s) => s);
const setUserConfig = jest.fn();
const setUserConfigQueryInput = jest.fn();
const setGlobalSettingsModalState = jest.fn();
const toggleEditMode = jest.fn();
const signOut = jest.spyOn(require("next-auth/react"), "signOut");
signOut.mockImplementation();
const useRouter = jest.spyOn(require("next/router"), "useRouter");
useRouter.mockImplementation(() => ({
  pathname: {},
  asPath: {},
  query: {},
  push: jest.fn()
}));

describe("render Header", () => {
  it("renders AppHeader correctly when viewing a dashboard", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const editIcon = screen.getByTestId("header-editmode-element");
    const userIcon = screen.getByTestId("header-profile-element");

    expect(editIcon).toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  it("renders AppHeader correctly when editing a dashboard", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.EDIT_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const editIcon = screen.getByTestId("header-editmode-element");
    const userIcon = screen.getByTestId("header-profile-element");

    expect(editIcon).toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  it("renders AppHeader correctly when viewing a basetable", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.BASE_TABLE }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const editIcon = screen.queryByTestId("header-editmode-element");
    const userIcon = screen.getByTestId("header-profile-element");

    expect(editIcon).not.toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });

  it("renders AppHeader correctly when userConfig is undefined", () => {
    render(
      <AppHeader
        // @ts-ignore
        userConfig={undefined}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.BASE_TABLE }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const editIcon = screen.queryByTestId("header-editmode-element");
    const userIcon = screen.getByTestId("header-profile-element");

    expect(editIcon).not.toBeInTheDocument();
    expect(userIcon).toBeInTheDocument();
  });
});


describe("interact with Header", () => {
  beforeEach(() => {
    setUserConfig.mockClear();
    setUserConfigQueryInput.mockClear();
    toggleEditMode.mockClear();
    setGlobalSettingsModalState.mockClear();
  })

  it("clicking on the gear toggles editmode", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const editIcon = screen.getByTestId("header-editmode-element");

    fireEvent.click(editIcon)

    expect(toggleEditMode).toHaveBeenCalledTimes(1);
  });

  it("clicking on the user icon opens a menu", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const userIcon = screen.getByTestId("header-profile-element");

    expect(screen.queryByTestId("header-profile-menu")).not.toBeInTheDocument();

    fireEvent.click(userIcon)

    expect(screen.queryByTestId("header-profile-menu")).toBeInTheDocument();
    expect(screen.queryByTestId("header-profile-menu-english-button")).toBeInTheDocument();
    expect(screen.queryByTestId("header-profile-menu-dutch-button")).toBeInTheDocument();
    expect(screen.queryByText("logout.button")).toBeInTheDocument();
  });

  it("clicking on the logout option in the menu calls signOut", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon);

    const logoutButton = screen.getByText("logout.button");

    fireEvent.click(logoutButton);

    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it("clicking on the english option in the menu changes the language to english", () => {
    userConfig.uiPreferences.language = "nl";
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon);

    const englishButton = screen.getByTestId("header-profile-menu-english-button");

    fireEvent.click(englishButton);

    expect(setUserConfig).toHaveBeenCalledTimes(1);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(1);
    expect(userConfig.uiPreferences.language).toBe("en");
  });

  it("clicking on the dutch option in the menu changes the language to dutch", () => {
    userConfig.uiPreferences.language = "en";

    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon)

    const dutchButton = screen.getByTestId("header-profile-menu-dutch-button");

    fireEvent.click(dutchButton);

    expect(setUserConfig).toHaveBeenCalledTimes(1);
    expect(setUserConfigQueryInput).toHaveBeenCalledTimes(1);
    expect(userConfig.uiPreferences.language).toBe("nl");
  });

  it("Logs the error when changing the language throws an error", () => {
    userConfig.uiPreferences.language = "en";
    jest.spyOn(require("i18next"), "changeLanguage").mockImplementationOnce((lan: any, funct: any) => {
      funct(Error("mockError"));
    })
    const consoleSpy = jest.spyOn(console, "log");
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);

    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon)

    const dutchButton = screen.getByTestId("header-profile-menu-dutch-button");

    fireEvent.click(dutchButton);

    expect(consoleSpy).toHaveBeenCalledTimes(1);
    expect(consoleSpy).toHaveBeenCalledWith("Something went wrong while loading the language", expect.any(Error));
  });

  it("does not show global settings menu if user does not have admin role", () => {
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);
    
    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon)
    
    const globalSettings = screen.queryByTestId("global-settings");

    expect(globalSettings).not.toBeInTheDocument();
  })

  it("does show global settings menu if user does have admin role", () => {
    userRoles.push("admin");
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);
    
    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon)

    const globalSettings = screen.getByTestId("global-settings");

    expect(globalSettings).toBeInTheDocument();
  })

  it("calls setGlobalSettingsModalState when an admin clicks on the global settings", () => {
    expect(userRoles.includes("admin")).toBe(true);
    render(
      <AppHeader
        userConfig={userConfig}
        userRoles={userRoles}
        setUserConfig={setUserConfig}
        setUserConfigQueryInput={setUserConfigQueryInput}
        setGlobalSettingsModalState={setGlobalSettingsModalState}
        workspaceState={{ name: "test", displaying: workspaceStates.DISPLAY_DASHBOARD }}
        toggleEditMode={toggleEditMode}
        t={t}
      />);
    
    const userIcon = screen.getByTestId("header-profile-element");

    fireEvent.click(userIcon)

    const globalSettings = screen.getByTestId("global-settings");
    
    fireEvent.click(globalSettings);

    expect(setGlobalSettingsModalState).toHaveBeenCalledTimes(1);
    expect(setGlobalSettingsModalState).toHaveBeenCalledWith(true);
  })
});
