/* eslint-disable require-jsdoc */
import React from 'react';
import logo from '../public/logo.svg';
import Image from 'next/image';
import { Breadcrumb, Layout, Menu } from 'antd';
import 'antd/dist/antd.css';
// import './styles/index.css';
import { UserOutlined, LaptopOutlined, NotificationOutlined } from '@ant-design/icons';
import {
  signIn,
  signOut,
  useSession
} from 'next-auth/react';

// import { Content, Footer, Header } from 'antd/lib/layout/layout';
// import Sider from 'antd/lib/layout/Sider';
import { icons } from 'antd/lib/image/PreviewGroup';

const { Header, Content, Sider } = Layout;
const items1 = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));
const items2 = [UserOutlined, LaptopOutlined, NotificationOutlined].map((icon, index) => {
  const key = String(index + 1);
  return {
    key: `sub${key}`,
    icon: React.createElement(icon),
    label: `subnav ${key}`,
    children: new Array(4).fill(null).map((_, j) => {
      const subKey = index * 4 + j + 1;
      return {
        key: subKey,
        label: `option${subKey}`,
      };
    }),
  };
});

function App() {

  const { data: session, status } = useSession()

  return (
    <Layout>
      <Header className="header">
        <Content className="header-logo">
          MyUI
        </Content>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1}/>
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
            items={items2}
          />
        </Sider>
        <Layout
          style={{
            padding: '0 24px 24px',
          }}
        >
          <Breadcrumb
            style={{
              margin: '16px 0',
            }}
          >
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>List</Breadcrumb.Item>
            <Breadcrumb.Item>App</Breadcrumb.Item>
          </Breadcrumb>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
            }}
          >
            Content
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}

// Make sure this page is protected
App.auth = true

export default App;
