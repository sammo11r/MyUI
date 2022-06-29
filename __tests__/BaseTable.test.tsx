import React from "react";
import BaseTable from "../components/BaseTable";
import {
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import "@testing-library/jest-dom";
import { workspaceType as workspaceStates } from "../consts/enum";
import { userConfig } from "../consts/demoUserConfig";
import { hasuraProps } from "../consts/hasuraProps";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  }
});

global.fetch = jest.fn(() => Promise.resolve({
  json: () => Promise.resolve({
    data: {
      __type: {
        fields: [
          { name: "Mockname1" },
          { name: "Mockname2" },
          { name: "Mockname3" },
        ]
      }
    }
  })
})) as jest.Mock;

const systemProps = {
  "mediaDisplaySetting": "MEDIA"
};

const hasuraHeaders = {
  "Content-Type": "application/json",
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2IiwibmFtZSI6ImFkbWluIiwiYWRtaW4iOnRydWUsImlhdCI6MTY1NTA2MDUwOS4xNTEsImh0dHBzOi8vaGFzdXJhLmlvL2p3dC9jbGFpbXMiOnsieC1oYXN1cmEtYWxsb3dlZC1yb2xlcyI6WyJhZG1pbiIsImVkaXRvciIsInVzZXIiXSwieC1oYXN1cmEtZGVmYXVsdC1yb2xlIjoiYWRtaW4ifSwiZXhwIjoxNjU1MTAzNzA5fQ.rYzY6y1smWPyeSoEbcOHeqNB0XHimWgDKHVjZC1Tf6Q"
};

const setUserConfigQueryInput = jest.fn();
const encrypt = jest.fn((s) => s);
const setGridViewToggle = jest.fn();
const t = jest.fn((s) => s);

jest.createMockFromModule("../components/TableData");

describe("it loads a basetable", () => {
  it("Renders basetable successfully", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <BaseTable
          hasuraProps={hasuraProps}
          systemProps={systemProps}
          name={"mockName"}
          userConfig={userConfig}
          setUserConfigQueryInput={setUserConfigQueryInput}
          hasuraHeaders={hasuraHeaders}
          encrypt={encrypt}
          gridViewToggle={true}
          setGridViewToggle={setGridViewToggle}
          t={t}
          mode={workspaceStates.BASE_TABLE}
          data-testid={"mock-basetable"}
        />
      </QueryClientProvider>
    )

    await waitFor(() => {
      expect(screen.queryByTestId("baseTable-loader")).toBeNull();
      screen.debug();
    })
  })
});
