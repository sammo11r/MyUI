import React from 'react';

import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import { TableOutlined, PicCenterOutlined } from '@ant-design/icons';
import {
  useSession
} from 'next-auth/react';
import Link from 'next/link';

import { AppHeader } from '../components/AppHeader';

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

const itemsDashboard = [
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
        null
    ),
    getItem(
        <Link href='/dashboard/2'>Dashboard 2</Link>,
        'dashboard2',
        null,
        null
    ),
    getItem(
        <Link href='/dashboard/3'>Dashboard 3</Link>,
        'dashboard3',
        null,
        null
    ),
    getItem(
        <Link href='/dashboard/4'>Dashboard 4</Link>,
        'dashboard4',
        null,
        null
    ),
  ]),
];

/**
 * @return {*} 
 */
function App() {
  const { data: session, status } = useSession()

  return (
    <Layout style={{
      height: '100vh'
    }}>
      <AppHeader />
      <Layout>
        <Sider width={200} className='site-layout-background'>
          <Menu
            mode='inline'
            defaultSelectedKeys={['1']}
            defaultOpenKeys={['sub1']}
            style={{
              height: '100%',
              borderRight: 0,
            }}
            items={itemsDashboard}
          />
        </Sider>
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
  );
}

// Make sure this page is protected
App.auth = true;

export default App;
