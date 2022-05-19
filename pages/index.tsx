import React from 'react';

import { Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
import { TableOutlined, PicCenterOutlined } from '@ant-design/icons';
import {
  signIn,
  signOut,
  useSession
} from 'next-auth/react';

import { AppHeader } from '../components/AppHeader'

const { Content, Sider } = Layout;

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
    getItem('Table 1', 'table1', null, null),
    getItem('Table 2', 'table2', null, null),
    getItem('Table 3', 'table3', null, null),
    getItem('Table 4', 'table4', null, null),
  ]),
  getItem('Dashboards', 'dashboards', <PicCenterOutlined />, [
    getItem('Dashboard 1', 'dashboard1', null, null),
    getItem('Dashboard 2', 'dashboard2', null, null),
    getItem('Dashboard 3', 'dashboard3', null, null),
    getItem('Dashboard 4', 'dashboard4', null, null),
  ]),
];

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
            Dashboard
          </Content>
        </Layout>
      </Layout>

    </Layout>
  );
}

// Make sure this page is protected
App.auth = true

export default App;
