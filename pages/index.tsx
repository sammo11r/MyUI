import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Breadcrumb, Button, Layout, Modal, notification } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/antd.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import jwtDecode from "jwt-decode";
import yaml from "js-yaml";
import * as fs from "fs";

import AppHeader from "../components/AppHeader";
import {
  dashboardAddKey,
  dashboardRemoveKey,
} from "../components/NavigationSider";
import EditElementModal from "../components/EditElementModal";
import EditModeSider from "../components/EditModeSider";
import Loader from "../components/Loader";
import ManageDashboardsModal from "../components/ManageDashboardsModal";
import NavigationSider from "../components/NavigationSider";
import Workspace from "../components/Workspace";
import {
  configurationQuery,
  updateUserConfiguration,
  tableQuery,
  defaultConfiguration,
} from "../components/BaseQueries";
import GlobalSettings from "../components/GlobalSettings";
import { loadingState, modalType, workspaceType } from "../consts/enum";
import {
  AppProps,
  DashboardElementType,
  DashboardState,
  DashboardType,
  EditElementModalState,
  JWTHasura,
  UserConfig,
  WorkspaceState,
} from "../utils/customTypes";
import { encrypt } from "../utils/encryption";
import { updateUserConfig } from "../utils/updateUserConfig";
import { emptyElement } from "../components/StaticElement";

const { Content } = Layout;
const { confirm } = Modal;

/**
 * @export
 * @param {AppProps} { hasuraProps, systemProps }
 * @return {*}  {JSX.Element}
 */
export default function App({
  hasuraProps,
  systemProps,
}: AppProps): JSX.Element {
  const { t } = useTranslation();
  const [manageDashboardsModalState, setManageDashboardsModalState] = useState({
    visible: false,
    type: modalType.ADD,
  });

  const [globalSettingsModalState, setGlobalSettingsModalState] =
    useState<boolean>(false);
  const [editElementModalState, setEditElementModalState] =
    useState<EditElementModalState>({
      visible: false,
      element: emptyElement,
    });

  const router = useRouter();

  // Define state variables for the user configuration
  const [userConfig, setUserConfig] =
    useState<UserConfig>(defaultConfiguration);

  // Define state variables that, once set, update the user configuration file
  const [userConfigQueryInput, setUserConfigQueryInput] =
    useState<UserConfig>();

  // State variable used to toggle a gridview
  // Setting this value forces all gridviews to fetch their data again
  const [gridViewToggle, setGridViewToggle] = useState<boolean>(false);
  
  const [dashboardNames, setDashboardNames] = useState<string[]>([]);
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [isSuccessConfig, setIsSuccessConfig] = useState(false);
  const [isIntrospectionSuccess, setIsIntrospectionSuccess] = useState(false);

  /**
   * @param {modalType} type
   */
  const showModal = (type: modalType) => {
    setManageDashboardsModalState({ visible: true, type: type });
  };

  // State for the sider menu
  const [siderState, setSiderState] = useState({
    tableNames: [],
    tableNamesState: loadingState.LOADING,
  });

  // State for the workspace
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    displaying: workspaceType.EMPTY,
    name: "none",
  });

  // State for the currently active dashboard
  const [dashboardState, setDashboardState] = useState<DashboardState>({
    dashboard: { name: "", dashboardElements: [] },
  });

  // True iff in the process of saving a dashboard
  const [loadings, setLoadings] = useState(false);

  // Fetching session token from the current session
  const { data: session } = useSession();
  const jwt = session!.token as string;

  const hasuraHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${jwt}`, // Adding auth header instead of using the admin secret
  } as HeadersInit;

  const hasuraHeadersVersioning = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  const jwtTokenDecoded = jwtDecode<JWTHasura>(jwt);
  const userId = parseInt(jwtTokenDecoded.sub);
  const userRoles =
    jwtTokenDecoded["https://hasura.io/jwt/claims"]["x-hasura-allowed-roles"];

  // Get the configuration file of the currently loggged in user
  if (isSuccessConfig === false) {
    const userConfigurationQuery = configurationQuery(
      userId,
      hasuraHeadersVersioning,
      setUserConfigQueryInput,
      setDashboardNames,
      setUserConfig,
      router
    );
    userConfigurationQuery.then((res) =>
      setIsSuccessConfig(res.isSuccessConfig)
    );
  }

  // Update the user configuration versioning table on modifications
  updateUserConfiguration(
    userId,
    hasuraProps,
    hasuraHeadersVersioning,
    setUserConfigQueryInput,
    userConfigQueryInput
  );

  // Get the all base tables from hasura
  if (isIntrospectionSuccess === false) {
    const tableQueryResult = tableQuery(hasuraHeaders, setSiderState);

    tableQueryResult.then((res) => {
      let tableNames: string[] = res.tableNames;
      setTableNames(tableNames);
      setIsIntrospectionSuccess(true);
    });
  }

  /**
   * Display a base table in the workspace
   *
   * @param {string} name
   */
  const displayBaseTable = (name: string) => {
    setWorkspaceState({ displaying: workspaceType.BASE_TABLE, name: name });
    window.history.replaceState(null, name, `/basetables/${name.toLowerCase()}`)
  };

  /**
   * Display a dashboard in the workspace
   *
   * @param {string} name
   * @param {UserConfig} userConfig
   */
  const displayDashboard = (name: string, userConfig: UserConfig) => {
    if (name == dashboardAddKey) {
      showModal(modalType.ADD);
    } else if (name == dashboardRemoveKey) {
      showModal(modalType.REMOVE);
    } else {
      setWorkspaceState({
        displaying: workspaceType.DISPLAY_DASHBOARD,
        name: name,
      });
      // Get dashboard configuration by name,
      // needs to be deep copy to prevent dashboardstate becoming a reference to the dashboard stored in userConfig
      const currentDashboard = structuredClone(
        userConfig.dashboards.filter(
          (dashboard: DashboardType) => dashboard.name == name
        )[0]
      );
      setDashboardState({ dashboard: currentDashboard });
      window.history.replaceState(null, name, `/dashboards/${name.toLowerCase()}`)
    }
  };

  /**
   * Enable the edit mode on a dashboard
   */
  const toggleEditMode = () => {
    // Toggle the grid views to refresh their data
    setGridViewToggle(!gridViewToggle);

    const newState =
      workspaceState.displaying === workspaceType.DISPLAY_DASHBOARD
        ? workspaceType.EDIT_DASHBOARD
        : workspaceType.DISPLAY_DASHBOARD;

    setWorkspaceState({ displaying: newState, name: workspaceState.name });

    // Auxiliary function used to check if to dashboards are equal
    const unsavedChanges = (
      dashboardState: DashboardState,
      userConfig: UserConfig,
      name: string
    ) => {
      const editedDashboardElements: DashboardElementType[] =
        dashboardState.dashboard.dashboardElements;
      const savedDashboardElements: DashboardElementType[] =
        userConfig.dashboards.filter(
          (dashboard: DashboardType) => dashboard.name == name
        )[0].dashboardElements;

      // Check if length equal
      if (savedDashboardElements.length !== editedDashboardElements.length)
        return true;
      // Check if values are equal, keys are assumed to be equivalent
      for (let i = 0; i < savedDashboardElements.length; i++) {
        for (const key of Object.keys(savedDashboardElements[i])) {
          // If there are elements that are not equal, there are unsaved changes
          if (
            savedDashboardElements[i][key as keyof DashboardElementType] !==
            editedDashboardElements[i][key as keyof DashboardElementType]
          ) {
            return true;
          }
        }
      }
      return false;
    };

    // If leaving edit mode while there are unsaved changes,
    // ask user if they want to save changes
    if (
      newState === workspaceType.DISPLAY_DASHBOARD &&
      unsavedChanges(dashboardState, userConfig, workspaceState.name)
    ) {
      confirm({
        title: t("dashboard.saveprompt.title"),
        icon: <QuestionCircleOutlined />,
        content: (
          <div>
            <h4>{t("dashboard.saveprompt.description")}</h4>
            <Button
              onClick={() => {
                setWorkspaceState({
                  displaying: workspaceType.EDIT_DASHBOARD,
                  name: workspaceState.name,
                });
                Modal.destroyAll();
              }}
            >
              {t("table.cancel")}
            </Button>
          </div>
        ),
        okText: t("dashboard.saveprompt.savetext"),
        cancelText: t("dashboard.saveprompt.discardtext"),
        onOk() {
          saveDashboardChanges(userConfig, dashboardState);
        },
        onCancel() {
          // Display old (unchanged) dashboard
          displayDashboard(workspaceState.name, userConfig);
        },
      });
    }
  };

  /**
   * Save the dashboard changes to the user's configuration file
   */
  const saveDashboardChanges = (
    userConfig: UserConfig,
    dashboardState: DashboardState
  ) => {
    setLoadings(true);
    // Get the current table configuration
    let currentDashboardConfig = userConfig.dashboards.filter(
      (dashboard: DashboardType) =>
        dashboard.name == dashboardState.dashboard.name
    )[0];
    let indexOfDashboard = userConfig.dashboards.indexOf(
      currentDashboardConfig
    );
    // Update the grid view configuration
    userConfig.dashboards[indexOfDashboard] = dashboardState.dashboard;

    setUserConfigQueryInput(userConfig);
    setLoadings(false);
    notification.open({
      message: t("dashboard.savenotification.message"),
      duration: 3,
      placement: "bottomRight",
    });
  };

  /**
   * Display the sider
   *
   * @return {JSX.Element} The navigation or edit mode sider
   */
  const displaySider = (): JSX.Element => {
    if (workspaceState.displaying === workspaceType.EDIT_DASHBOARD) {
      return (
        <EditModeSider
          userConfig={userConfig}
          dashboardState={dashboardState}
          loadings={loadings}
          saveDashboardChanges={saveDashboardChanges}
          t={t}
        />
      );
    }
    return (
      <NavigationSider
        baseTableNames={tableNames}
        dashboardNames={dashboardNames}
        baseTableOnClick={(name: string) => {
          displayBaseTable(name);
        }}
        dashboardOnClick={(name: string) => {
          displayDashboard(name, userConfig);
        }}
        selectedKeys={workspaceState.name}
        t={t}
      />
    );
  };

  return (
    <Layout style={{ height: "100vh" }}>
      {isSuccessConfig ? (
        <>
          <AppHeader
            userConfig={userConfig}
            userRoles={userRoles}
            setUserConfig={setUserConfig}
            setUserConfigQueryInput={setUserConfigQueryInput}
            setGlobalSettingsModalState={setGlobalSettingsModalState}
            workspaceState={workspaceState}
            toggleEditMode={toggleEditMode}
            t={t}
          />
          <ManageDashboardsModal
            isVisible={manageDashboardsModalState.visible}
            setVisible={(visible: boolean) =>
              setManageDashboardsModalState({
                visible: visible,
                type: manageDashboardsModalState.type,
              })
            }
            dashboardNames={dashboardNames}
            dashboardAddKey={dashboardAddKey}
            dashboardRemoveKey={dashboardRemoveKey}
            setDashboardNames={setDashboardNames}
            type={manageDashboardsModalState.type}
            userConfig={userConfig}
            setUserConfigQueryInput={setUserConfigQueryInput}
            displayDashboard={displayDashboard}
            setWorkspaceState={setWorkspaceState}
            workspaceState={workspaceState}
            t={t}
            saveDashboardChanges={saveDashboardChanges}
          />
          {editElementModalState.visible ? (
            <EditElementModal
              state={editElementModalState}
              setState={setEditElementModalState}
              t={t}
            />
          ) : (
            <></>
          )}

          <Layout>
            {siderState.tableNamesState == loadingState.LOADING ? (
              <Loader testid="index-loader"/>
            ) : (
              displaySider()
            )}
            <Layout style={{ padding: "0 24px 24px" }}>
              <Content
                className="site-layout-background"
                style={{
                  padding: 24,
                  margin: 0,
                  minHeight: 280,
                }}
              >
                {workspaceState.name != 'none' ? (
                  <Breadcrumb>
                  {workspaceState.displaying == workspaceType.BASE_TABLE ? (
                    <Breadcrumb.Item>{t("basetable.sidebar")}</Breadcrumb.Item>
                  ) : (
                    <Breadcrumb.Item>{t("dashboard.sidebar")}</Breadcrumb.Item>
                  )}
                    <Breadcrumb.Item>{workspaceState.name}</Breadcrumb.Item>
                  </Breadcrumb>
                ) : (<></>)}
                <Workspace
                  workspaceState={workspaceState}
                  hasuraProps={hasuraProps}
                  systemProps={systemProps}
                  userConfig={userConfig}
                  dashboardState={dashboardState}
                  setDashboardState={setDashboardState}
                  setEditElementModalState={setEditElementModalState}
                  setUserConfigQueryInput={setUserConfigQueryInput}
                  hasuraHeaders={hasuraHeaders}
                  encrypt={encrypt}
                  gridViewToggle={gridViewToggle}
                  setGridViewToggle={setGridViewToggle}
                  t={t}
                />
                <GlobalSettings
                  globalSettingsModalState={globalSettingsModalState}
                  setGlobalSettingsModalState={setGlobalSettingsModalState}
                  updateUserConfig={updateUserConfig}
                  systemProps={systemProps}
                  t={t}
                />
              </Content>
            </Layout>
          </Layout>
        </>
      ) : (
        <></>
      )}
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
  // Read global config file
  const systemProps = yaml.load(
    fs.readFileSync("/app/config/globalConfig.yaml", "utf-8")
  );
  return {
    props: {
      hasuraProps,
      systemProps,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
}
