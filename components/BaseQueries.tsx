import { NextRouter } from "next/router";
import { useQuery } from "react-query";
import { loadingState } from "../consts/enum";
import { DashboardType, HasuraProps, UserConfig } from "../utils/customTypes";
import { getUserConfig } from "../utils/getUserConfig";
import { introspect } from "../utils/introspectionQuery";

// Define the default UI configuration
export const defaultConfiguration: UserConfig = {
  dashboards: [],
  uiPreferences: {
    language: "en",
  },
  baseTables: [],
};

/**
 * Retrieve configuration file
 *
 * @export
 * @param {number} userId
 * @param {HeadersInit} hasuraHeadersVersioning
 * @param {(React.Dispatch<React.SetStateAction<UserConfig | undefined>>)} setUserConfigQueryInput
 * @param {React.Dispatch<React.SetStateAction<string[]>>} setDashboardNames
 * @param {React.Dispatch<React.SetStateAction<UserConfig>>} setUserConfig
 * @param {NextRouter} router
 * @return {*}
 */
export async function configurationQuery(
  userId: number,
  hasuraHeadersVersioning: HeadersInit,
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >,
  setDashboardNames: React.Dispatch<React.SetStateAction<string[]>>,
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>,
  router: NextRouter
) {
  // Get the router variables
  const { pathname, asPath, query } = router;
  try {
    let userConfig = await getUserConfig(hasuraHeadersVersioning, userId);
    if (userConfig.data.user_versioned_config.length == 0) {
      // No user configuration found for this user
      // Set the default empty user's configuration
      userConfig = defaultConfiguration;
      setUserConfigQueryInput(userConfig);
    } else {
      // Get the user's configuration
      userConfig = userConfig.data.user_versioned_config[0].config;
      // Undo escaping of characters
      userConfig = JSON.parse(userConfig);
    }
    // Get the dashboard names to display on the sidebar
    const dashboards = userConfig.dashboards;
    let dashboardNames = dashboards.map(
      (dashboard: DashboardType) => dashboard.name
    );
    setDashboardNames(dashboardNames);
    setUserConfig(userConfig);

    // Push the language locale - needed to retrieve the correct language on startup
    router.push({ pathname, query }, asPath, {
      locale: userConfig.uiPreferences.language,
    });

    return { isSuccessConfig: true, configuration: userConfig };
  } catch (err) {
    console.log(err);
    return { isSuccessConfig: false, configuration: null };
  }
}

/**
 * Update user configuration
 *
 * @export
 * @param {number} userId
 * @param {HasuraProps} hasuraProps
 * @param {HeadersInit} hasuraHeadersVersioning
 * @param {(React.Dispatch<React.SetStateAction<UserConfig | undefined>>)} setUserConfigQueryInput
 * @param {UserConfig} userConfigQueryInput
 */
export function updateUserConfiguration(
  userId: number,
  hasuraProps: HasuraProps,
  hasuraHeadersVersioning: HeadersInit,
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >,
  userConfigQueryInput?: UserConfig
) {
  useQuery(
    ["updateUserConfiguration", userId, userConfigQueryInput],
    async () => {
      if (userConfigQueryInput != undefined) {
        console.log("User configuration file is updated...");
        // Escape double quotes
        let newUserConfig = JSON.stringify(userConfigQueryInput).replace(
          /"/g,
          '\\"'
        );

        await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
          method: "POST",
          headers: hasuraHeadersVersioning,
          body: JSON.stringify({
            query: `mutation insertUserConfig { insert_user_versioned_config_one(object: {config: "${newUserConfig}", user_id: ${userId}}) { config }}`,
          }),
        });

        // Clear the query input state variable
        setUserConfigQueryInput(undefined);
      }
    }
  );
}

/**
 * Retrieve table names the user has access to
 *
 * @export
 * @param {HeadersInit} hasuraHeaders
 * @param {React.Dispatch<React.SetStateAction<{ tableNames: never[]; tableNamesState: loadingState; }>>} setSiderState
 * @return {*}
 */
export async function tableQuery(
  hasuraHeaders: HeadersInit,
  setSiderState: React.Dispatch<
    React.SetStateAction<{ tableNames: never[]; tableNamesState: loadingState }>
  >
) {
  // Get the all base tables from backend API
  const instances = await introspect(hasuraHeaders);
  setSiderState({
    tableNames: instances,
    tableNamesState: loadingState.READY,
  });

  return { tableNames: instances };
}
