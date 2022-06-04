import React, { useState } from "react";
import "antd/dist/antd.css";
import { Menu, Dropdown, Space, Radio } from "antd";
import {
  UserOutlined,
  SettingFilled,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { Content, Header } from "antd/lib/layout/layout";
import { signOut } from "next-auth/react";
import { useTranslation } from "next-i18next";

import i18next from "i18next";
import type { RadioChangeEvent } from 'antd';
import { useRouter } from 'next/router'

/**
 * Update the language in i18next
 * 
 * @param {string} lan
 * @return {*} 
 */
function languageUpdate(lan: string) {
  i18next.init();
  i18next.changeLanguage(lan, (err) => {
    if (err) return console.log('Something went wrong while loading the language', err);
  });
}

/**
 * @param {*} { 
 *   userConfig,
 *   setUserConfig,
 *   userConfigQueryInput,
 *   setUserConfigQueryInput
 * }
 * @return {*} 
 */
export default function AppHeader({
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput
}: any): JSX.Element {
  const { t } = useTranslation();

  const router = useRouter();
  const { pathname, asPath, query } = router;

  // Update the locale
  const changeLocale = (e: RadioChangeEvent) => {
    // Update the language in i18next
    const localeValue = e.target.value;
    languageUpdate(localeValue);

    // Update the language in userConfig
    userConfig.uiPreferences.language = e.target.value;
    setUserConfig(userConfig);
    setUserConfigQueryInput(userConfig);

    // Push the changes
    router.push({ pathname, query }, asPath, { locale: localeValue })
  };

  // Define the default user menu configuration
  const userMenu = (
    <Menu
      items={[
        // Logout button
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
        // Change language buttons
        {
          label: (
            <div>
              <span>{t("logout.language")}</span>
              <div>
                <Radio.Group defaultValue={userConfig ? userConfig.uiPreferences.language : 'en'} onChange={changeLocale}>
                  <Space direction="vertical">
                    <Radio.Button value='en'>
                      {t("logout.english")} <span role="img" aria-label="enFlag">🇺🇸</span>
                    </Radio.Button>
                    <Radio.Button value='nl'>
                      {t("logout.dutch")}  <span role="img" aria-label="nlFLag">🇳🇱</span>
                    </Radio.Button>
                  </Space>
                </Radio.Group>
              </div>
            </div>
          ),
          key: 1,
        },
      ]}
    />
  );

  return (
    <Header className="header">
      <Content className="header-logo">MyUI</Content>
      <SettingFilled
        className="header-settings"
        data-testid="header-settings-element"
        style={{
          position: "relative",
          top: 16,
          float: "right",
          right: 40,
          fontSize: "30px",
          color: "white",
        }}
      />

      <Dropdown
        overlay={userMenu}
        trigger={["click"]}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
      >
        <a
          onClick={(e) => e.preventDefault()}
          style={{
            position: "relative",
            top: 16,
            float: "right",
            left: 35,
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
