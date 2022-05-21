<<<<<<< HEAD
import React from 'react';

import {
  Layout,
  Menu,
} from 'antd';
import 'antd/dist/antd.css';
import {
  TableOutlined,
  PicCenterOutlined,
} from '@ant-design/icons';
import Link from 'next/link';

import AppHeader from '../components/AppHeader';
import AppSider from '../components/AppSider';

const {Content, Sider} = Layout;

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

export const itemsDashboard = [
  getItem('Base Tables', 'baseTables', <TableOutlined />, [
    getItem(<Link href='/table/1'>Table 1</Link>, 'table1', null, null),
    getItem(<Link href='/table/2'>Table 2</Link>, 'table2', null, null),
    getItem(<Link href='/table/3'>Table 3</Link>, 'table3', null, null),
    getItem(<Link href='/table/4'>Table 4</Link>, 'table4', null, null),
  ]),
  getItem('Dashboards', 'dashboards', <PicCenterOutlined />, [
    getItem(
        <Link href='/dashboard/1'>Dashboard 1</Link>,
        'dashboard1',
        null,
        null,
    ),
    getItem(
        <Link href='/dashboard/2'>Dashboard 2</Link>,
        'dashboard2',
        null,
        null,
    ),
    getItem(
        <Link href='/dashboard/3'>Dashboard 3</Link>,
        'dashboard3',
        null,
        null,
    ),
    getItem(
        <Link href='/dashboard/4'>Dashboard 4</Link>,
        'dashboard4',
        null,
        null,
    ),
  ]),
];

/**
 * @return {*}
 */
function App() {
  return (
    <Layout style={{
      height: '100vh',
    }}>
      <AppHeader />
      <Layout>
        <AppSider itemsDashboard={itemsDashboard} />
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
          </Content>
        </Layout>
      </Layout>
    </Layout>
=======
/* eslint-disable require-jsdoc */
import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

import logo from "../public/logo.svg";

function App() {
  // TODO: Persist user data after succesful signin.
  // eslint-disable-next-line no-unused-vars
  const { data: session, status } = useSession();

  return (
    <div className="App">
      <header className="App-header">
        <Image
          src={logo}
          alt="logo"
          className="App-logo"
          width={500}
          height={500}
        />
        <p>
          Edit <code>pages/index.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
>>>>>>> master
  );
}

// Make sure this page is protected
<<<<<<< HEAD
App.auth = false;
=======
App.auth = true;
>>>>>>> master

export default App;
