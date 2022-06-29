import React from "react";
import GlobalSettings from "../components/GlobalSettings";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import user from "@testing-library/user-event";
import { SystemProps } from "../utils/customTypes";

// globalSettingsModalState,
// setGlobalSettingsModalState,
// updateUserConfig,
// systemProps,
// t,

const setGlobalSettingsModalState = jest.fn();
const t = jest.fn((s) => s);


// Mock an async function that returns a promise
const updateUserConfig = jest.fn(() => Promise.resolve());
const systemProps = {
  mediaDisplaySetting: "" as String,
} as SystemProps;

describe("Global Settings Modal", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("Pressing OK closes the modal", async () => {
    render(<GlobalSettings
      globalSettingsModalState={true}
      setGlobalSettingsModalState={setGlobalSettingsModalState}
      updateUserConfig={updateUserConfig}
      systemProps={systemProps}
      t={t}
    />);

    const currentSetting = screen.getByTestId("global-settings-dropdown").textContent;
    expect(currentSetting).toBe(systemProps.mediaDisplaySetting);

    // Click the OK button
    const okButton = screen.getByText("OK");
    await user.click(okButton);

    await waitFor(() => {
      expect(setGlobalSettingsModalState).toHaveBeenCalledTimes(1);
      expect(setGlobalSettingsModalState).toHaveBeenCalledWith(false);
    });
  });

  it("Pressing CANCEL closes the modal", async () => {
    render(<GlobalSettings
      globalSettingsModalState={true}
      setGlobalSettingsModalState={setGlobalSettingsModalState}
      updateUserConfig={updateUserConfig}
      systemProps={systemProps}
      t={t}
    />);

    const currentSetting = screen.getByTestId("global-settings-dropdown").textContent;
    expect(currentSetting).toBe(systemProps.mediaDisplaySetting);

    // Click the Cancel button
    const cancelButton = screen.getByText("Cancel");
    await user.click(cancelButton); 

    await waitFor(() => {
      expect(setGlobalSettingsModalState).toHaveBeenCalledTimes(1);
      expect(setGlobalSettingsModalState).toHaveBeenCalledWith(false);
    })
  });

  it("Changing the display setting to Media calls updateUserConfig with MEDIA", async () => {
    render(<GlobalSettings
      globalSettingsModalState={true}
      setGlobalSettingsModalState={setGlobalSettingsModalState}
      updateUserConfig={updateUserConfig}
      systemProps={systemProps}
      t={t}
    />);

    const currentSetting = screen.getByTestId("global-settings-dropdown").textContent;
    expect(currentSetting).toBe(systemProps.mediaDisplaySetting);

    const globalSettingsDrowndown = screen.getByTestId("global-settings-dropdown");
    await user.click(globalSettingsDrowndown)
    
    await waitFor(async () => {
      const mediaDropdownItem = screen.getByText("Media");
      await user.click(mediaDropdownItem);
    })

    await waitFor(() => {
      expect(updateUserConfig).toHaveBeenCalledTimes(1);
      expect(updateUserConfig).toHaveBeenCalledWith({ mediaDisplaySetting: "MEDIA"});
    })
  });

  it("Changing the display setting to URL calls updateUserConfig with URL", async () => {
    render(<GlobalSettings
      globalSettingsModalState={true}
      setGlobalSettingsModalState={setGlobalSettingsModalState}
      updateUserConfig={updateUserConfig}
      systemProps={systemProps}
      t={t}
    />);

    const currentSetting = screen.getByTestId("global-settings-dropdown").textContent;
    expect(currentSetting).toBe(systemProps.mediaDisplaySetting);

    const globalSettingsDrowndown = screen.getByTestId("global-settings-dropdown");
    await user.click(globalSettingsDrowndown)
    
    await waitFor(async () => {
      const urlDropdownItem = screen.getByText("URL");
      await user.click(urlDropdownItem);
    })

    await waitFor(() => {
      expect(updateUserConfig).toHaveBeenCalledTimes(1);
      expect(updateUserConfig).toHaveBeenCalledWith({ mediaDisplaySetting: "URL"});
    })
  });
})
