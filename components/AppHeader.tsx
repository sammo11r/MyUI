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

  const rotateGear = () => {
    if (workspaceState.displaying === workspaceStates.EDIT_DASHBOARD) {
      return "gear"
    }
    return ""
  }

  return (
    <Header className="header">
      <Content className="header-logo">MyUI</Content>
      {displayGear() ?
        <SettingFilled
          className={rotateGear()}
          data-testid="header-settings-element"
          onClick={toggleEditMode}
          style={{
            position: "absolute",
            top: 16,
            float: "right",
            right: 80,
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
        <UserOutlined
          data-testid="header-profile-element"
          onClick={(e) => e.preventDefault()}
          style={{
            position: "absolute",
            top: 16,
            float: "right",
            right: 40,
            fontSize: "30px",
            color: "white",
          }}
        />
      </Dropdown>
    </Header>
  );
}

export default AppHeader;
