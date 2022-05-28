import React, { useState } from "react";
import { useQuery } from "react-query";
import { Layout } from "antd";
import "antd/dist/antd.css";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";

import AppHeader from "../components/AppHeader";
import AppSider, {dashboardAddKey, dashboardRemoveKey} from "../components/AppSider";
import Dashboard from "../components/Dashboard";
import ManageDashboardsModal, { modalTypes } from "../components/ManageDashboardsModal";
import Loader from "../components/Loader";
import Workspace from "../components/Workspace";
import QueryInput from "../components/QueryInput";

const { Content, Sider } = Layout;

export enum sideBarItemTypes { BASE_TABLE, DASHBOARD }

export enum workspaceStates {
  EMPTY,
  BASE_TABLE,
  DASHBOARD,
}

/**
 * @param {*} { hasuraProps, systemProps }
 * @return {*} 
 */
export default function App({ hasuraProps, systemProps }: any) {
  const { t } = useTranslation();
  const [manageDashboardsModalState, setManageDashboardsModalState] = useState({visible: false, type: modalTypes.ADD});
  const [dashboardNames, setDashboardNames] = useState(['Voetbalschool TIC', 'ESSC Football Club']); //Hardcoded

  const showModal = (type: modalTypes) => {
    setManageDashboardsModalState({ visible: true, type: type});
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


  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  //Get the all base tables from hasura
  const { isSuccess: isSuccessTable, data: tableNames }: any = useQuery(
    "tableQuery",
    () =>
      fetch(hasuraProps.hasuraEndpoint as RequestInfo, {
        method: "POST",
        headers: hasuraHeaders,
        body: JSON.stringify({
          query: `
      query LearnAboutSchema {
        __schema {
          queryType {
            fields {
              name
            }
          }
        }
      }
    `,
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
    } else if (name == dashboardRemoveKey){
      showModal(modalTypes.REMOVE);
    } else {
      setWorkspaceState({ displaying: workspaceStates.DASHBOARD, name: name });
    }
  };

  const displayEmptyWorkspace = () => {
    setWorkspaceState({ displaying: workspaceStates.EMPTY, name: "" });
  };

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <AppHeader />
      <ManageDashboardsModal
        isVisible={manageDashboardsModalState.visible}
        setVisible={ 
          (visible:boolean) => setManageDashboardsModalState(
            { visible: visible, type: manageDashboardsModalState.type }
          )
        }
        dashboardNames={dashboardNames} 
        dashboardAddKey={dashboardAddKey}
        dashboardRemoveKey={dashboardRemoveKey}
        setDashboardNames={setDashboardNames} 
        tableNames= {tableNames}
        modalType = {manageDashboardsModalState.type}
      />
      <Layout>
        {siderState.tableNamesState == siderMenuState.LOADING ? (
          <Loader />
        ) : (
          <AppSider
            key={"sideBar"}
            baseTableNames = { tableNames }
            dashboardNames = { dashboardNames }
            baseTableOnClick={(name: string) => {
              displayBaseTable(name);
            }}
            dashboardOnClick={(name: string) => {
              displayDashboard(name);
            }}
          />
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
            />
            <Dashboard/>
            {/* <QueryInput hasuraProps={hasuraProps}/> */}
          </Content>
        </Layout>
      </Layout>
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
