import React, { useState } from "react";
import { useQuery } from "react-query";
import { useSession } from "next-auth/react";
import { Layout, Modal, notification } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { i18n, useTranslation } from "next-i18next";
import { useRouter } from 'next/router'
import jwtDecode from "jwt-decode";

import AppHeader from "../components/AppHeader";
import { dashboardAddKey, dashboardRemoveKey } from "../components/NavigationSider";
import EditElementModal from "../components/EditElementModal";
import EditModeSider from "../components/EditModeSider";
import Loader from "../components/Loader";
import ManageDashboardsModal, { modalTypes } from "../components/ManageDashboardsModal";
import NavigationSider from "../components/NavigationSider";
import Workspace from "../components/Workspace";
import { 
  configurationQuery,
  updateUserConfiguration,
  tableQuery
} from "../components/BaseQueries"

const { Content, Sider } = Layout;
const { confirm } = Modal;

export enum sideBarItemTypes { BASE_TABLE, DASHBOARD }

export enum workspaceStates {
  EMPTY,
  BASE_TABLE,
  DISPLAY_DASHBOARD,
  EDIT_DASHBOARD
}

export enum elementType { GRIDVIEW, STATIC }

/**
 * @param {*} { hasuraProps, systemProps }
 * @return {*} 
 */
export default function App({ hasuraProps, systemProps }: any) {
  const { t } = useTranslation();
  const [manageDashboardsModalState, setManageDashboardsModalState] = useState({ visible: false, type: modalTypes.ADD });
  const [editElementModalState, setEditElementModalState] = useState({ visible: false, element: {} });
  const router = useRouter();

  // Define state variables for the user configuration
  const [userConfig, setUserConfig] = useState();

  // Define state variables that, once set, update the user configuration file
  const [userConfigQueryInput, setUserConfigQueryInput] = useState();

  const [dashboardNames, setDashboardNames] = useState<string[]>([]);

  const showModal = (type: modalTypes) => {
    setManageDashboardsModalState({ visible: true, type: type });
  };

  enum siderMenuState { READY, LOADING}

  const [siderState, setSiderState] = useState({
    tableNames: [],
    tableNamesState: siderMenuState.LOADING,
  });

  const [workspaceState, setWorkspaceState] = useState({
    displaying: workspaceStates.EMPTY,
    name: "none",
  });

  const [dashboardState, setDashboardState] = useState({ dashboard: {} });

  // True iff in the process of saving a dashboard
  const [loadings, setLoadings] = useState(false);

  // Fetching session token from the current session
  const { data: session } = useSession();
  const jwt = session!.token;

  const hasuraHeaders = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${jwt}`, // Adding auth header instead of using the admin secret
  } as HeadersInit;

  const hasuraHeadersVersioning = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret, // Adding auth header instead of using the admin secret
  } as HeadersInit;

  interface JWTHasura {
    sub: string,
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
  const userId = parseInt(jwtTokenDecoded.sub);

  // Get the configuration file of the currently loggged in user
  const { isSuccessConfig, configuration } = configurationQuery(userId, hasuraProps, hasuraHeadersVersioning, setUserConfigQueryInput, setDashboardNames, setUserConfig, router);
  
  // Update the user configuration versioning table on modifications
  updateUserConfiguration(userId, hasuraProps, hasuraHeadersVersioning, setUserConfigQueryInput, userConfigQueryInput);

  // Get the all base tables from hasura
  const { isSuccessTable, tableNames } = tableQuery(hasuraProps, hasuraHeaders, setSiderState, siderMenuState);

  /**
   * Display a base table in the workspace
   *
   * @param {string} name
   */
  const displayBaseTable = (name: string) => {
    setWorkspaceState({ displaying: workspaceStates.BASE_TABLE, name: name });
  };

  /**
   * Display a dashboard in the workspace
   *
   * @param {string} name
   * @param {*} userConfig
   */
  const displayDashboard = (name: string, userConfig: any) => {
    if (name == dashboardAddKey) {
      showModal(modalTypes.ADD);
    } else if (name == dashboardRemoveKey) {
      showModal(modalTypes.REMOVE);
    } else {
      setWorkspaceState({ displaying: workspaceStates.DISPLAY_DASHBOARD, name: name });
      // Get dashboard configuration by name, 
      // needs to be deep copy to prevent dashboardstate becoming a reference to the dashboard stored in userConfig
      const currentDashboard = structuredClone(userConfig.dashboards.filter((dashboard: any) => dashboard.name == name)[0]);
      setDashboardState({ dashboard: currentDashboard });
    }
  };

  /**
   * Enable the edit mode on a dashboard
   */
  const toggleEditMode = () => {
    const newState = workspaceState.displaying === workspaceStates.DISPLAY_DASHBOARD ?
      workspaceStates.EDIT_DASHBOARD : workspaceStates.DISPLAY_DASHBOARD;

    setWorkspaceState({ displaying: newState, name: workspaceState.name })

    // Auxiliary function used to check if to dashboards are equal
    const unsavedChanges = (dashboardState: any, userConfig: any, name: string) => {
      const editedDashboardElements = dashboardState.dashboard.dashboardElements;
      const savedDashboardElements = userConfig.dashboards
        .filter((dashboard: any) => dashboard.name == name)[0].dashboardElements;
      // Check if length equal
      if (savedDashboardElements.length !== editedDashboardElements.length) return true;
      // Check if values are equal, keys are assumed to be equivalent
      for (let i = 0; i < savedDashboardElements.length; i++) {
        for (const key of Object.keys(savedDashboardElements[i])) {
          if (savedDashboardElements[i][key] !== editedDashboardElements[i][key]) {
            return true;
          }
        }
      }
      return false;
    }

    // If leaving edit mode while there are unsaved changes,
    // ask user if they want to save changes
    if (
      newState === workspaceStates.DISPLAY_DASHBOARD &&
      unsavedChanges(dashboardState, userConfig, workspaceState.name)
    ) {
      confirm({
        title: t("dashboard.saveprompt.title"),
        icon: <QuestionCircleOutlined />,
        content: t("dashboard.saveprompt.description"),
        okText: t("dashboard.saveprompt.savetext"),
        cancelText: t("dashboard.saveprompt.discardtext"),
        onOk() {
          saveDashboardChanges(userConfig, dashboardState);
        },
        onCancel() {
          // Display old (unchanged) dashboard
          displayDashboard(workspaceState.name, userConfig);
        }
      });
    }
  }

  /**
   * Save the dashboard changes to the user's configuration file
   */
  const saveDashboardChanges = (userConfig: any, dashboardState: any) => {
    setLoadings(true);
    // Remove the old dashboard from the user config
    let otherDashboards = userConfig.dashboards.filter((dashboard: any) => dashboard.name != dashboardState.dashboard.name);

    // Add the edited dashboard to the user config
    otherDashboards.push(dashboardState.dashboard);
    userConfig.dashboards = otherDashboards;

    setUserConfigQueryInput(userConfig);
    setLoadings(false);
    notification.open({
      message: t("dashboard.savenotification.message"),
      duration: 3,
      placement: "bottomRight"
    });
  }

  const displaySider = () => {
    if (workspaceState.displaying === workspaceStates.EDIT_DASHBOARD) {
      return <EditModeSider
        userConfig={userConfig}
        setUserConfig={setUserConfig}
        userConfigQueryInput={userConfigQueryInput}
        setUserConfigQueryInput={setUserConfigQueryInput}
        dashboardState={dashboardState}
        setDashboardState={setDashboardState}
        loadings={loadings}
        saveDashboardChanges={saveDashboardChanges}
      />
    }
    return <NavigationSider
      key={"sideBar"}
      baseTableNames={tableNames}
      dashboardNames={dashboardNames}
      baseTableOnClick={(name: string) => {
        displayBaseTable(name);
      }}
      dashboardOnClick={(name: string) => {
        displayDashboard(name, userConfig);
      }}
    />
  }

  return (
    <Layout
      style={{ height: "100vh" }}
    >
      {isSuccessConfig ? (
        <>
          <AppHeader
            userConfig={userConfig}
            setUserConfig={setUserConfig}
            userConfigQueryInput={userConfigQueryInput}
            setUserConfigQueryInput={setUserConfigQueryInput}
            workspaceState={workspaceState}
            toggleEditMode={toggleEditMode}
          />
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
            displayDashboard={displayDashboard}
            setWorkspaceState={setWorkspaceState}
            workspaceStates={workspaceStates}
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
            <Layout style={{ padding: "0 24px 24px", }}>
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
              </Content>
            </Layout>
          </Layout>
        </>
      ) : <></>}
    </Layout>
  );
}

// Make sure this page is protected
App.auth = true;

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
