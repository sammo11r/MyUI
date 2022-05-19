import React from 'react';

import 'antd/dist/antd.css';
import {
  Layout, 
  Menu 
} from 'antd';
const {Sider} = Layout;

function AppSider({itemsDashboard, selectedKeys, openKeys}: any) {
  return (
    <Sider width={200} className='site-layout-background'>
      <Menu
        mode='inline'
        defaultSelectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
        style={{
          height: '100%',
          borderRight: 0,
        }}
        items={itemsDashboard}
      />
    </Sider>
  );
}

export default AppSider;
