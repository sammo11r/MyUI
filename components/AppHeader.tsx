import React from "react";
import "antd/dist/antd.css";
import { Menu, Dropdown, Space } from "antd";
import {
  UserOutlined,
  SettingFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";

import { workspaceStates } from "../pages/index";

/**
 * @return {*}
 */
function AppHeader({ workspaceState, toggleEditMode }: any) {
  const { t } = useTranslation();
  const userMenu = (
    <Menu
      items={[
        {
          label: (
            <Space>
              {t("logout.button")}
              <ArrowRightOutlined />
            </Space>
          ),
          onClick: () => signOut({ callbackUrl: "/" }),
          key: 0,
        },
      ]}
    />
  );

  const displayGear = () => {
    switch (workspaceState.displaying) {
      case workspaceStates.DISPLAY_DASHBOARD:
      case workspaceStates.EDIT_DASHBOARD:
        return true
      default:
        return false
    }
  }

  return (
    <Header className="header">
      <Content className="header-logo">MyUI</Content>
      {displayGear() ?
        <SettingFilled
          className="header-settings"
          data-testid="header-settings-element"
          onClick={toggleEditMode}
          style={{
            position: "absolute",
            top: 16,
            float: "right",
            right: 60,
            fontSize: "30px",
            color: "white",
          }}
        /> : <></>
      }

      <Dropdown
        overlay={userMenu}
        trigger={["click"]}
        placement="bottom"
        arrow={{ pointAtCenter: true }}
      >
        <a
          onClick={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            top: 16,
            float: "right",
            right: 20,
            fontSize: "30px",
            color: "white",
          }}
        >
          <UserOutlined
            className="header-user-profile"
            data-testid="header-profile-element"
          />
        </a>
      </Dropdown>
    </Header>
  );
}

export default AppHeader;
