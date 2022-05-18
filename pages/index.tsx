/* eslint-disable require-jsdoc */
import React from 'react';
import logo from '../public/logo.svg';
import Image from 'next/image';
import { Breadcrumb, Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
// import './styles/index.css';
import { UserOutlined, TableOutlined, NotificationOutlined, SettingFilled, PicCenterOutlined } from '@ant-design/icons';
import {
  signIn,
  signOut,
  useSession
} from 'next-auth/react';

// import { Header, Content } from 'antd/lib/layout/layout';
// import Sider from 'antd/lib/layout/Sider';
import { icons } from 'antd/lib/image/PreviewGroup';

const { Header, Content, Sider } = Layout;

// Commented lines are from online template

// const items1 = ['1', '2', '3'].map((key) => ({
//   key,
//   label: `nav ${key}`,
// }));
// const items2 = [TableOutlined, PicCenterOutlined].map((icon, index) => {
//   const key = String(index + 1);
//   return {
//     key: `sub${key}`,
//     icon: React.createElement(icon),
//     label: `Dashboard ${key}`,
//     children: new Array(4).fill(null).map((_, j) => {
//       const subKey = index * 4 + j + 1;
//       return {
//         key: subKey,
//         label: `option${subKey}`,
//       };
//     }),
//   };
// });

function getItem(label: any, key: any, icon: any, children: any) {
  return {
    key,
    icon,
    children,
    label,
    };
}

const itemsDashboard= [
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
    <Layout>
      <Header className="header">
        <Content className="header-logo">
          MyUI
        </Content>
        {/* <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1}/> */}
        <SettingFilled id='dashboard-settings'
          style={{ 
            position: 'relative',
            top: 16,
            float: 'right',
            right: 20,
            fontSize: "30px", 
            color: "white" 
            }}/>
            <UserOutlined id='dashboard-user-profile'
          style={{ 
            position: 'relative',
            top: 16,
            float: 'right',
            left: 50,
            fontSize: "30px",
            color: "white" 
            }}/>
          
      </Header>

      <Layout>
        <Sider width={200} className="site-layout-background">
          <Menu
            mode="inline"
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
          {/* <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb> */}
          <Content
            className="site-layout-background"
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
