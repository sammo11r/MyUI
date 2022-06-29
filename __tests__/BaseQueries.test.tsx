import "@testing-library/jest-dom";
import { configurationQuery, tableQuery, updateUserConfiguration } from "../components/BaseQueries";
import { NextRouter, useRouter } from 'next/router';
import { defaultConfiguration } from "../consts/defaultConfiguration";
import { userConfig as demoConfig } from "../consts/demoUserConfig";
import { hasuraProps } from "../consts/hasuraProps";
import { waitFor } from "@testing-library/react";
import { loadingState } from "../consts/enum";

jest.mock('next/router', () => ({
  __esModule: true,
  useRouter: jest.fn()
}))

const useQuery = jest.spyOn(require("react-query"), "useQuery");
useQuery.mockImplementation((array: any, funct: any) => {
  funct();
});

let userConfig: any = { data: { user_versioned_config: [] } }
jest.mock("../utils/getUserConfig", () => ({
  getUserConfig: jest.fn(() => (userConfig))
}));

jest.mock("../utils/introspectionQuery", () => ({
  introspect: jest.fn(() => ("mockInstances"))
}));

const setUserConfigQueryInput = jest.fn();
const setDashboardNames = jest.fn();
const setUserConfig = jest.fn();
const setSiderState = jest.fn();

const mockRouter = {
  push: jest.fn() // BaseQueries implements the push function only
};
(useRouter as jest.Mock).mockReturnValue(mockRouter)

const hasuraHeadersVersioning = {
  "Content-Type": "application/json",
  "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as String, // Adding auth header instead of using the admin secret
} as unknown as HeadersInit;

describe("Tests for configurationQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("Configuration query executed succesfully with default configuration", async () => {
    const result = await configurationQuery(
      6,
      hasuraHeadersVersioning,
      setUserConfigQueryInput,
      setDashboardNames,
      setUserConfig,
      mockRouter as unknown as NextRouter
    )

    expect(result).toEqual({ isSuccessConfig: true, configuration: defaultConfiguration });
  })

  it("Configuration query executed succesfully with new configuration", async () => {
    userConfig = {
      data: {
        user_versioned_config: [
          { config: JSON.stringify(demoConfig) },
        ]
      }
    };

    const result = await configurationQuery(
      6,
      hasuraHeadersVersioning as HeadersInit,
      setUserConfigQueryInput,
      setDashboardNames,
      setUserConfig,
      mockRouter as unknown as NextRouter
    );

    expect(result).toEqual({
      isSuccessConfig: true,
      configuration: demoConfig
    });
  });

  it("Configuration query logs an error", async () => {
    userConfig = undefined;

    const logSpy = jest.spyOn(console, 'log');

    const result = await configurationQuery(
      6,
      hasuraHeadersVersioning as HeadersInit,
      setUserConfigQueryInput,
      setDashboardNames,
      setUserConfig,
      mockRouter as unknown as NextRouter
    );

    expect(result).toEqual({ isSuccessConfig: false, configuration: null });
    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(TypeError("Cannot read properties of undefined (reading 'data')"));
    });
  });
})

describe("Tests for UpdateUserConfiguration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("User configuration is updated", async () => {
    global.fetch = jest.fn() as jest.Mock;
    updateUserConfiguration(
      6,
      hasuraProps,
      hasuraHeadersVersioning as HeadersInit,
      setUserConfigQueryInput,
      demoConfig
    );
    
    await waitFor(() => {    
      expect(setUserConfigQueryInput).toBeCalledTimes(1);
    })
  });

  it("User configuration is updated with undefined userConfig", async () => {
    global.fetch = jest.fn() as jest.Mock;
    updateUserConfiguration(
      6,
      hasuraProps,
      hasuraHeadersVersioning as HeadersInit,
      setUserConfigQueryInput,
      undefined
    );
    
    await waitFor(() => {    
      expect(setUserConfigQueryInput).toBeCalledTimes(0);
    })
  });
})

describe("Tests for tableQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  })

  it("Correctly performs an introspection query", async () => {
    const result = await tableQuery(
      hasuraHeadersVersioning,
      setSiderState
    )

    const instances = "mockInstances"
    expect(result).toEqual({ tableNames: instances });
    expect(setSiderState).toHaveBeenCalledTimes(1);
    expect(setSiderState).toHaveBeenCalledWith({tableNames: instances, tableNamesState: loadingState.READY})
  })
})