import React, { useState,  } from "react";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import jwtDecode from "jwt-decode";

import AppHeader from "../components/AppHeader";
import { dashboardAddKey, dashboardRemoveKey } from "../components/NavigationSider";
import EditElementModal from "../components/EditElementModal";
import EditModeSider from "../components/EditModeSider";
import Loader from "../components/Loader";
import ManageDashboardsModal, { modalTypes } from "../components/ManageDashboardsModal";
import NavigationSider from "../components/NavigationSider";
import QueryInput from "../components/QueryInput";
import Workspace from "../components/Workspace";

const { Content, Sider } = Layout;

export enum sideBarItemTypes { BASE_TABLE, DASHBOARD }

export enum workspaceStates {
  EMPTY,
  BASE_TABLE,
  DISPLAY_DASHBOARD,
  EDIT_DASHBOARD
}

export enum elementType {
  GRIDVIEW,
  STATIC
}

/**
 * @param {*} { hasuraProps, systemProps }
 * @return {*} 
 */
export default function App({ hasuraProps, systemProps }: any) {
  const { t } = useTranslation();
  const [manageDashboardsModalState, setManageDashboardsModalState] = useState({ visible: false, type: modalTypes.ADD });
  const [editElementModalState, setEditElementModalState] = useState({ visible: false, element: {} });

  // Define state variables for the user configuration
  const [userConfig, setUserConfig] = useState();

  // Define state variables that, once set, update the user configuration file
  const [userConfigQueryInput, setUserConfigQueryInput] = useState();

  const [dashboardNames, setDashboardNames] = useState<string[]>([]);

  const showModal = (type: modalTypes) => {
    setManageDashboardsModalState({ visible: true, type: type });
  };

  enum siderMenuState {
    READY,
    LOADING,
  }

  const [siderState, setSiderState] = React.useState({
    tableNames: [],
    tableNamesState: siderMenuState.LOADING,
  });

  const [workspaceState, setWorkspaceState] = React.useState({
    displaying: workspaceStates.EMPTY,
    name: "none",
  });

  const [dashboardState, setDashboardState] = React.useState({
    dashboard: {}
  });

  // Define the default UI configuration
  const defaultConfiguration = {
    "dashboards": [],
    "uiPreferences": {
      "language": "nl"
    },
    "baseTables": []
  }

  // Fetching session token from the current session
  const { data: session } = useSession();
  const jwt = session!.token;

  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  interface JWTHasura {
    sub: number,
    name: string,
    admin: boolean,
    iat: string,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": Array<string>,
      "x-hasura-default-role": string,
    },
  };

  // @ts-ignore
  const jwtTokenDecoded = jwtDecode<JWTHasura>(jwt);

  // Get ID from currently logged in user
  // let userId = jwtTokenDecoded.sub;
  let userId = 1; // @TODO

  // Get the configuration file of the currently loggged in user
  useQuery(["configurationQuery", userId], async () => {
    let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
      method: "POST",
      headers: hasuraHeaders,
      body: JSON.stringify({
        query: `query getConfigurationFromUser { user_versioned_config(where: {user_id: {_eq: ${userId}}}, order_by: {date: desc}, limit: 1) { config }}`,
      }),
    })
      .then((userConfig) => userConfig.json())
      .then((userConfig) => {
        if (userConfig.data.user_versioned_config.length == 0) {
          // Set the default empty user's configuration
          userConfig = defaultConfiguration;
          setUserConfigQueryInput(userConfig); 
        } else {
          // Get the user's configuration        
          userConfig = userConfig.data.user_versioned_config[0].config;
          // Undo escaping of double quotes
          userConfig = JSON.parse(userConfig.replace('\"', '"'));
        }
        // Get the dashboard names to display on the sidebar
        const dashboards = userConfig.dashboards;
        let dashboardNames = dashboards.map((dashboard: any) => dashboard.name);
        setDashboardNames(dashboardNames);
        setUserConfig(userConfig);
      });

    return result;
  });

  // Update the user configuration versioning table on modifications
  useQuery(["updateUserConfiguration", userId, userConfigQueryInput], async () => {
    if (userConfigQueryInput != undefined) {
      console.log('User configuration file is updated...');
      // Escape double quotes
      let newUserConfig = JSON.stringify(userConfigQueryInput).replace(/"/g, "\\\"");

      let result = await fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
        method: "POST",
        headers: hasuraHeaders,
        body: JSON.stringify({
          query: `mutation insertUserConfig { insert_user_versioned_config_one(object: {config: "${newUserConfig}", user_id: ${userId}}) { config }}`,
        }),
      })
      // Clear the query input state variable
      setUserConfigQueryInput(undefined);
    }
  });

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
          if (tableNames) return tableNames;
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

  const displayBaseTable = (name: string) => {
    setWorkspaceState({ displaying: workspaceStates.BASE_TABLE, name: name });
  };

  const displayDashboard = (name: string) => {
    if (name == dashboardAddKey) {
      showModal(modalTypes.ADD);
    } else if (name == dashboardRemoveKey) {
      showModal(modalTypes.REMOVE);
    } else {
      setWorkspaceState({ displaying: workspaceStates.DISPLAY_DASHBOARD, name: name });
      setDashboardState({dashboard: { // TODO: Fetch dashboard from userconfig instead
        name: "Cool Dashboard",
        dashboardElements: [
          {
            name: "Cool Element",
            x: 0,
            y: 0,
            h: 9,
            w: 6,
            rowsPerPage: 5,
            query: `
            query MyQuery {
              Product {
                id
                name
                description
              }
            }
            `,
            type: elementType.GRIDVIEW // type of visualization
          },
          {
            name: "Text Element",
            x: 6,
            y: 0,
            h: 9,
            w: 6,
            text: "Dit is een klein stukje tekst. Prijs de heer, zuip wat meer!",
            type: elementType.STATIC
          },
          {
            name: "Video Element",
            x: 0,
            y: 9,
            h: 9,
            w: 6,
            text: "https://archive.org/download/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4",
            type: elementType.STATIC
          }]
      }});
    }
  };

  const displayEmptyWorkspace = () => {
    setWorkspaceState({ displaying: workspaceStates.EMPTY, name: "" });
  };

  const toggleEditMode = () => {
    const newState = workspaceState.displaying === workspaceStates.DISPLAY_DASHBOARD ?
      workspaceStates.EDIT_DASHBOARD : workspaceStates.DISPLAY_DASHBOARD
    
    if (newState == workspaceStates.EDIT_DASHBOARD) {
      setDashboardState({dashboard: { // TODO: Fetch dashboard from userconfig instead
        name: "Cool Dashboard",
        dashboardElements: [
          {
            name: "Cool Element",
            x: 0,
            y: 0,
            h: 9,
            w: 6,
            rowsPerPage: 5,
            query: `
            query MyQuery {
              Product {
                id
                name
                description
              }
            }
            `,
            type: elementType.GRIDVIEW // type of visualization
          },
          {
            name: "Text Element",
            x: 6,
            y: 0,
            h: 9,
            w: 6,
            text: "Dit is een klein stukje tekst. Prijs de heer, zuip wat meer!",
            type: elementType.STATIC
          },
          {
            name: "Video Element",
            x: 0,
            y: 9,
            h: 9,
            w: 6,
            text: "https://archive.org/download/Rick_Astley_Never_Gonna_Give_You_Up/Rick_Astley_Never_Gonna_Give_You_Up.mp4",
            type: elementType.STATIC
          }]
      }})
    }
    setWorkspaceState({ displaying: newState, name: workspaceState.name })
  }

  const displaySider = () => {
    if (workspaceState.displaying === workspaceStates.EDIT_DASHBOARD) {
      return <EditModeSider />
    }
    return <NavigationSider
      key={"sideBar"}
      baseTableNames={tableNames}
      dashboardNames={dashboardNames}
      baseTableOnClick={(name: string) => {
        displayBaseTable(name);
      }}
      dashboardOnClick={(name: string) => {
        displayDashboard(name);
      }}
    />
  }

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <AppHeader workspaceState={workspaceState} toggleEditMode={toggleEditMode} />
      <ManageDashboardsModal
        isVisible={manageDashboardsModalState.visible}
        setVisible={
          (visible: boolean) => setManageDashboardsModalState(
            { visible: visible, type: manageDashboardsModalState.type }
          )
        }
        dashboardNames={dashboardNames}
        dashboardAddKey={dashboardAddKey}
        dashboardRemoveKey={dashboardRemoveKey}
        setDashboardNames={setDashboardNames}
        tableNames={tableNames}
        modalType={manageDashboardsModalState.type}
        hasuraProps={hasuraProps}
        userConfig={userConfig}
        setUserConfig={setUserConfig}
        userConfigQueryInput={userConfigQueryInput}
        setUserConfigQueryInput={setUserConfigQueryInput}
      />
      {
        editElementModalState.visible ?
          <EditElementModal
            state={editElementModalState}
            setState={setEditElementModalState}
          /> : <></>
      }

      <Layout>
        {siderState.tableNamesState == siderMenuState.LOADING ? (
          <Loader />
        ) : (
          displaySider()
        )}
        <Layout
          style={{
            padding: "0 24px 24px",
          }}
        >
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            <Workspace
              key={"workspace"}
              workspaceState={workspaceState}
              hasuraProps={hasuraProps}
              systemProps={systemProps}
              userConfig={userConfig}
              setUserConfig={setUserConfig}
              dashboardState={dashboardState}
              setDashboardState={setDashboardState}
              setEditElementModalState={setEditElementModalState}
              userConfigQueryInput={userConfigQueryInput}
              setUserConfigQueryInput={setUserConfigQueryInput}
            />
            {/* <QueryInput hasuraProps={hasuraProps}/> */}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// Make sure this page is protected
App.auth = false; // TODO turn back on

export async function getServerSideProps(context: any) {
  const hasuraProps = {
    hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as String,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as
      | RequestInfo
      | URL,
  };
  const systemProps = {
    mediaDisplaySetting: process.env.URL_DISPLAY_SETTING as String
  };
  return {
    props: {
      hasuraProps,
      systemProps,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
}
