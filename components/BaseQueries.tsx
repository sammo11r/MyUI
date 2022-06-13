import { useQuery } from "react-query";

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
export function configurationQuery(
  userId: number,
  hasuraProps: any,
  hasuraHeadersVersioning: any,
  setUserConfigQueryInput: any,
  setDashboardNames: any,
  setUserConfig: any,
  router: any
): any {
  // Get the router variables
  const { pathname, asPath, query } = router;

  const { isSuccess: isSuccessConfig, data: configuration } = useQuery(
    ["configurationQuery", userId],
    async () => {
      let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
        method: "POST",
        headers: hasuraHeadersVersioning,
        body: JSON.stringify({
          query: `query getConfigurationFromUser { user_versioned_config(where: {user_id: {_eq: ${userId}}}, order_by: {date: desc}, limit: 1) { config }}`,
        }),
      })
        .then((userConfig) => userConfig.json())
        .then((userConfig) => {
          // Check if the user has a user configuration saved in the database
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
        });
      return result;
    }
  );

  return { isSuccessConfig, configuration };
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
 * @param {*} hasuraProps
 * @param {*} hasuraHeaders
 * @param {*} setSiderState
 * @param {*} siderMenuState
 * @return {*}
 */
export function tableQuery(
  hasuraProps: any,
  hasuraHeaders: any,
  setSiderState: any,
  siderMenuState: any
) {
  // Get the all base tables from hasura
  const { isSuccess: isSuccessTable, data: tableNames }: any = useQuery(
    "tableQuery",
    () =>
      fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
        method: "POST",
        headers: hasuraHeaders,
        body: JSON.stringify({
          query: `query LearnAboutSchema { __schema { queryType { fields { name }}}}`,
        }),
      })
        .then((res) => res.json())
        .then((res) => {
          const data = res.data.__schema.queryType.fields;
          let instances = data.map((instance: any) => instance.name);
          // For every table hasura has query types for aggregate functions and functions on the primary key.
          // We are not intrested in those tables, only the base table, so we filter them.
          instances = instances.filter((name: string) => {
            return !name.endsWith("_aggregate") && !name.endsWith("_by_pk");
          });
          setSiderState({
            tableNames: instances,
            tableNamesState: siderMenuState.READY,
          });
          return instances;
        })
  );

  return { isSuccessTable, tableNames };
}
