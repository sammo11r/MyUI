import React from 'react';
<<<<<<< HEAD
import { useQuery } from "react-query";
=======
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc

import {
  Layout,
  Menu,
<<<<<<< HEAD
  Spin
=======
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
} from 'antd';
import 'antd/dist/antd.css';
import {
  TableOutlined,
  PicCenterOutlined,
} from '@ant-design/icons';
<<<<<<< HEAD
import Link from 'next/link';


import AppHeader from '../components/AppHeader';
import AppSider from '../components/AppSider';
import BaseTable from '../components/BaseTable';
import { readSync } from 'fs';
import Workspace from '../components/Workspace';

const { Content, Sider } = Layout;
=======
import {useSession} from 'next-auth/react';
import Link from 'next/link';

import AppHeader from '../components/AppHeader';
import AppSider from '../components/AppSider';

const {Content, Sider} = Layout;
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc

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

<<<<<<< HEAD



let storedDashboardItems: any;
function getDashboardItems(tableNames: string[]) {
  //Due to queries doing wonky stuff and executing 4 times, 
  //later calls to this function might end up with undefined names, hence save copy
  if (!tableNames) return storedDashboardItems

  let dashboardItems = [
    getItem('Base Tables', 'baseTables', <TableOutlined />,
      tableNames.map((name: string) => getItem(name, `${name}`, null, null))
    ),
    getItem('Dashboards', 'dashboards', <PicCenterOutlined />, [
      getItem(
=======
export const itemsDashboard = [
  getItem('Base Tables', 'baseTables', <TableOutlined />, [
    getItem(<Link href='/table/1'>Table 1</Link>, 'table1', null, null),
    getItem(<Link href='/table/2'>Table 2</Link>, 'table2', null, null),
    getItem(<Link href='/table/3'>Table 3</Link>, 'table3', null, null),
    getItem(<Link href='/table/4'>Table 4</Link>, 'table4', null, null),
  ]),
  getItem('Dashboards', 'dashboards', <PicCenterOutlined />, [
    getItem(
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
        <Link href='/dashboard/1'>Dashboard 1</Link>,
        'dashboard1',
        null,
        null,
<<<<<<< HEAD
      ),
      getItem(
=======
    ),
    getItem(
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
        <Link href='/dashboard/2'>Dashboard 2</Link>,
        'dashboard2',
        null,
        null,
<<<<<<< HEAD
      ),
      getItem(
=======
    ),
    getItem(
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
        <Link href='/dashboard/3'>Dashboard 3</Link>,
        'dashboard3',
        null,
        null,
<<<<<<< HEAD
      ),
      getItem(
=======
    ),
    getItem(
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
        <Link href='/dashboard/4'>Dashboard 4</Link>,
        'dashboard4',
        null,
        null,
<<<<<<< HEAD
      ),
    ]),
  ]
  storedDashboardItems = dashboardItems;
  return dashboardItems;

};


export enum workspaceStates { EMPTY, BASE_TABLE, DASHBOARD }
=======
    ),
  ]),
];
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc

/**
 * @return {*}
 */
<<<<<<< HEAD
function App({ hasuraProps }: any) {

  enum siderMenuState { READY, LOADING };
  const [siderState, setSiderState] =
    React.useState({ tableNames: [], tableNamesState: siderMenuState.LOADING })

  const [workspaceState, setWorkspaceState] =
    React.useState({ displaying: workspaceStates.EMPTY, name: "none" })

  const hasuraHeaders = {
    'Content-Type': 'application/json',
    'x-hasura-admin-secret': hasuraProps.hasuraSecret,
  } as HeadersInit;

  //Get the all base tables from hasura
  const { isSuccess: isSuccessTable, data: tableNames }: any = useQuery("tableQuery", () =>
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
          return !name.endsWith('_aggregate') && !name.endsWith('_by_pk')
        })
        setSiderState({ tableNames: instances, tableNamesState: siderMenuState.READY })
        return instances
      })
  );

  const displayBaseTable = (name: string) => { setWorkspaceState({ displaying: workspaceStates.BASE_TABLE, name: name }) }
  const displayEmptyWorkspace = () => { setWorkspaceState({ displaying: workspaceStates.EMPTY, name: "" }) }
  const refresh = (name: string) => { displayEmptyWorkspace(); displayBaseTable(name)}
=======
function App() {
  // TODO: Persist user data after succesful signin.
  // eslint-disable-next-line no-unused-vars
  const { data: session, status } = useSession();
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc

  return (
    <Layout style={{
      height: '100vh',
    }}>
      <AppHeader />
      <Layout>
<<<<<<< HEAD
        {siderState.tableNamesState == siderMenuState.LOADING ?
          <Spin /> :
          <AppSider 
            key = { 'sideBar '}
            itemsDashboard={getDashboardItems(tableNames)}
            baseTableOnclick = {
              (name: string) => {
                refresh(name);
              }
            } />
        }
=======
        <AppSider itemsDashboard={itemsDashboard} />
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Content
            className='site-layout-background'
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
<<<<<<< HEAD
            <Workspace
              key = { 'workspace' }
              workspaceState={ workspaceState } 
              hasuraProps={ hasuraProps }
            />
=======
>>>>>>> 996f586c89c88c17918bf01439a67a321a61babc
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// Make sure this page is protected
App.auth = true;

export default App;

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
