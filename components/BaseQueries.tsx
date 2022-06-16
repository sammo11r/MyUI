import { NextRouter } from "next/router";
import { useQuery } from "react-query";
import { getUserConfig } from "../utils/getUserConfig";
import { introspect } from "../utils/introspectionQuery";

// Define the default UI configuration
const defaultConfiguration = {
  dashboards: [],
  uiPreferences: { // @TODO this is hardcoded
    language: "en",
  },
  baseTables: [],
};

/**
 * Retrieve configuration file
 *
 * @export
 * @param {string} userId
 * @param {*} hasuraProps
 * @param {*} hasuraHeadersVersioning
 * @param {*} setUserConfigQueryInput
 * @param {*} setDashboardNames
 * @param {*} setUserConfig
 * @param {*} router
 * @return {*}
 */
export async function configurationQuery(
  userId: number,
  hasuraHeadersVersioning: HeadersInit,
  setUserConfigQueryInput: React.Dispatch<React.SetStateAction<undefined>>,
  setDashboardNames: React.Dispatch<React.SetStateAction<string[]>>,
  setUserConfig: React.Dispatch<React.SetStateAction<undefined>>,
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
      (dashboard: any) => dashboard.name
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
 * @param {*} hasuraProps
 * @param {*} hasuraHeadersVersioning
 * @param {*} setUserConfigQueryInput
 * @param {*} userConfigQueryInput
 */
export function updateUserConfiguration(
  userId: number,
  hasuraProps: any,
  hasuraHeadersVersioning: any,
  setUserConfigQueryInput: any,
  userConfigQueryInput: any
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

        let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
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
 * @param {*} hasuraHeaders
 * @param {*} setSiderState
 * @param {*} siderMenuState
 * @return {*}
 */
export async function tableQuery(
  hasuraHeaders: any,
  setSiderState: any,
  siderMenuState: any
) {
  // Get the all base tables from backend API
  const instances = await introspect(hasuraHeaders);
  setSiderState({
    tableNames: instances,
    tableNamesState: siderMenuState.READY,
  });

  return { tableNames: instances }
}
