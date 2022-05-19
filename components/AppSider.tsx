import React from 'react';

import 'antd/dist/antd.css';
import {
  Layout, 
  Menu 
} from 'antd';
const {Sider} = Layout;

export function AppSider({itemsDashboard}: any) {
  return (
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
  );
}
