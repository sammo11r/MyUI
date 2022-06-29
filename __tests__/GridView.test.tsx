import React from "react";
import GridView from "../components/GridView";
import "@testing-library/jest-dom";
import { QueryClient } from "react-query";
import { workspaceType as workspaceStates } from "../consts/enum";
import * as ShallowRenderer from 'react-test-renderer/shallow'
import { SystemProps } from "../utils/customTypes";
import { userConfig } from "../consts/demoUserConfig";
import { hasuraProps } from "../consts/hasuraProps";

const hasuraHeaders = {
    "Content-Type": "application/json",
    Authorization: "mock", // Adding auth header instead of using the admin secret
} as HeadersInit;

const systemProps = {
    mediaDisplaySetting: process.env.URL_DISPLAY_SETTING as String,
} as SystemProps;

const query = "";
const dashboardName = "foo";

const encrypt = jest.fn((s) => Promise.resolve(s))
const setUserConfigQueryInput = jest.fn();
const t = jest.fn();
const setGridViewToggle = jest.fn();
const style = {
    "height": "100%",
    "width": "100%",
    "overflow": "auto"
};


describe("GridView functions as expected", () => {

    it("renders", () => {
        const renderer = ShallowRenderer.createRenderer()

        renderer.render(
            <GridView
                hasuraProps={hasuraProps}
                query={query}
                style={style}
                systemProps={systemProps}
                userConfig={userConfig}
                setUserConfigQueryInput={setUserConfigQueryInput}
                dashboardName={dashboardName}
                hasuraHeaders={hasuraHeaders}
                t={t}
                name={"test"}
                gridViewToggle={true}
                setGridViewToggle={setGridViewToggle}
                mode={workspaceStates.DISPLAY_DASHBOARD}
                encrypt={encrypt}
            />
        );

        const result = renderer.getRenderOutput();
        const props = result.props;

        expect(props["data-testid"]).toBe("gridview-test");

        expect(props["hasuraProps"]).toBe(hasuraProps);
        expect(props["query"]).toBe(query);
        expect(props["style"]).toBe(style);
        expect(props["systemProps"]).toBe(systemProps);
        expect(props["userConfig"]).toBe(userConfig);
        expect(props["setUserConfigQueryInput"]).toBe(setUserConfigQueryInput);
        expect(props["dashboardName"]).toBe(dashboardName);
        expect(props["hasuraHeaders"]).toBe(hasuraHeaders);
        expect(props["t"]).toBe(t);
        expect(props["isBaseTable"]).toBeFalsy();
        expect(props["tableName"]).toBe("test");
        expect(props["gridViewToggle"]).toBeTruthy();
        expect(props["setGridViewToggle"]).toBe(setGridViewToggle);
        expect(props["mode"]).toBe(workspaceStates.DISPLAY_DASHBOARD);
    });
});