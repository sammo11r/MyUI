import React from "react";
import { useQuery } from "react-query";

import { Layout, Menu, Spin } from "antd";
import "antd/dist/antd.css";
import { TableOutlined, PicCenterOutlined } from "@ant-design/icons";
import Link from "next/link";

import AppHeader from "../components/AppHeader";
import AppSider from "../components/AppSider";
import Loader from "../components/Loader";
import Workspace from "../components/Workspace";
import QueryInput from "../components/QueryInput";

const { Content, Sider } = Layout;

/**
 * @param {*} label
 * @param {*} key
 * @param {*} icon
 * @param {*} children
 * @return {*}
 */
function getItem(label: any, key: any, icon: any, children: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}

let storedDashboardItems: any;
function getDashboardItems(tableNames: string[]) {
  //Due to queries doing wonky stuff and executing 4 times,
  //later calls to this function might end up with undefined names, hence save copy
  if (!tableNames) return storedDashboardItems;

  let dashboardItems = [
    getItem(
      "Base Tables",
      "baseTables",
      <TableOutlined />,
      tableNames.map((name: string) => getItem(name, `${name}`, null, null))
    ),
    getItem("Dashboards", "dashboards", <PicCenterOutlined />, [
      getItem(
        <Link href="/dashboard/1">Dashboard 1</Link>,
        "dashboard1",
        null,
        null
      ),
      getItem(
        <Link href="/dashboard/2">Dashboard 2</Link>,
        "dashboard2",
        null,
        null
      ),
      getItem(
        <Link href="/dashboard/3">Dashboard 3</Link>,
        "dashboard3",
        null,
        null
      ),
      getItem(
        <Link href="/dashboard/4">Dashboard 4</Link>,
        "dashboard4",
        null,
        null
      ),
    ]),
  ];
  storedDashboardItems = dashboardItems;
  return dashboardItems;
}

export enum workspaceStates {
  EMPTY,
  BASE_TABLE,
  DASHBOARD,
}

/**
 * @return {*}
 */
export default function App({ hasuraProps }: any) {
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
  const displayEmptyWorkspace = () => {
    setWorkspaceState({ displaying: workspaceStates.EMPTY, name: "" });
  };
  const refresh = (name: string) => {
    displayEmptyWorkspace();
    displayBaseTable(name);
  };

  return (
    <Layout
      style={{
        height: "100vh",
      }}
    >
      <AppHeader />
      <Layout>
        {siderState.tableNamesState == siderMenuState.LOADING ? (
          <Loader />
        ) : (
          <AppSider
            key={"sideBar "}
            itemsDashboard={getDashboardItems(tableNames)}
            baseTableOnclick={(name: string) => {
              refresh(name);
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
            />
            <QueryInput hasuraProps={hasuraProps}/>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// Make sure this page is protected
App.auth = false;

export function getServerSideProps(context: any) {
  const hasuraProps = {
    hasuraSecret: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ADMIN_SECRET as String,
    hasuraEndpoint: process.env.NEXT_PUBLIC_HASURA_GRAPHQL_ENDPOINT as
      | RequestInfo
      | URL,
  };
  return {
    props: {
      hasuraProps,
    },
  };
}
