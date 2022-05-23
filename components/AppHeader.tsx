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
      data-testid='header-settings-element'/>
      <UserOutlined id='header-user-profile'
      data-testid='header-profile-element' />
    </Header>
  );
}

export default AppHeader;
