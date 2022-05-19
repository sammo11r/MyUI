import React from 'react';

import 'antd/dist/antd.css';
import {
  UserOutlined,
  SettingFilled,
} from '@ant-design/icons';
import {
  Content,
  Header,
} from 'antd/lib/layout/layout';

/**
 * @return {*}
 */
function AppHeader() {
  return (
    <Header className='header'>
      <Content className='header-logo'>
        MyUI
      </Content>
      <SettingFilled id='header-settings'
        style={{
          position: 'relative',
          top: 16,
          float: 'right',
          right: 20,
          fontSize: '30px',
          color: 'white',
        }} />
      <UserOutlined id='header-user-profile'
        style={{
          position: 'relative',
          top: 16,
          float: 'right',
          left: 50,
          fontSize: '30px',
          color: 'white',
        }} />
    </Header>
  );
}

export default AppHeader;
