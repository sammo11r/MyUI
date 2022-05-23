import React from 'react';

import 'antd/dist/antd.css';
import {
  Menu,
  Dropdown,
  Space,
} from 'antd';
import {
  UserOutlined,
  SettingFilled,
  ArrowRightOutlined,
} from '@ant-design/icons';
import {
  Content,
  Header,
} from 'antd/lib/layout/layout';
import {signOut} from 'next-auth/react';

const userMenu = (
  <Menu
    items={[
      {
        label:
          <Space>
            Sign out
            <ArrowRightOutlined />
          </Space>,
        onClick: () => signOut({callbackUrl: '/'}),
        key: 0,
      },
    ]}
  />
);

/**
 * @return {*}
 */
function AppHeader() {
  return (
    <Header className='header'>
      <Content className='header-logo'>
        MyUI
      </Content>
      <SettingFilled
        className='header-settings'
        data-testid='header-settings-element'
        style={{
          position: 'relative',
          top: 16,
          float: 'right',
          right: 40,
          fontSize: '30px',
          color: 'white',
        }}
      />

      <Dropdown
        overlay={userMenu}
        trigger={['click']}
        placement='bottom'
        arrow={{pointAtCenter: true}}
      >
        <a
          onClick={(e) => e.preventDefault()}
          style={{
            position: 'relative',
            top: 16,
            float: 'right',
            left: 35,
            fontSize: '30px',
            color: 'white',
          }}
        >
          <UserOutlined
            className='header-user-profile'
            data-testid='header-profile-element'
          />
        </a>
      </Dropdown>
    </Header>
  );
}

export default AppHeader;
