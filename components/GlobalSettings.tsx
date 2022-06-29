import React, { SyntheticEvent } from "react";
import { Modal, Button } from "antd";
import {
  DownOutlined,
  PictureOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Dropdown, Menu, message, Space } from "antd";
import { GlobalSettingsProps, UserConfigSetting } from "../utils/customTypes";

/**
 * @export
 * @param {GlobalSettingsProps} {
 *   globalSettingsModalState,
 *   setGlobalSettingsModalState,
 *   updateUserConfig,
 *   systemProps,
 *   t
 * }
 * @return {*}  {JSX.Element}
 */
export default function GlobalSettings({
  globalSettingsModalState,
  setGlobalSettingsModalState,
  updateUserConfig,
  systemProps,
  t,
}: GlobalSettingsProps): JSX.Element {
  // JSON array with menu items with appropriate icons
  const menuItemsURL = [
    {
      label: "Media",
      key: "1",
      icon: <PictureOutlined />,
    },
    {
      label: "URL",
      key: "2",
      icon: <FileTextOutlined />,
    },
  ];

  /**
   * @param {{key: string, keyPath: string[], domEvent: SyntheticEvent}} e
   */
  const handleMenuClick: MenuProps["onClick"] = (e: {
    key: string;
    keyPath: string[];
    domEvent: SyntheticEvent;
  }) => {
    // Get selected setting from the dropdown menu
    const selectedSetting = menuItemsURL.filter((item) => {
      return item.key == e.keyPath[0];
    })[0].label;

    // Update user config file
    updateUserConfig({
      mediaDisplaySetting: selectedSetting.toUpperCase(),
    } as UserConfigSetting);

    // Notify the user
    message.info(t("globalSettings.notification"));
  };

  const menu = <Menu onClick={handleMenuClick} items={menuItemsURL} />;

  return (
    <Modal
      title={t("globalSettings.modalTitle")}
      visible={globalSettingsModalState}
      onOk={() => setGlobalSettingsModalState(false)}
      onCancel={() => setGlobalSettingsModalState(false)}
    >
      <Space className="settings-modal">
        {t("globalSettings.header")}:
        <Dropdown overlay={menu}>
          <Button>
            <Space data-testid="global-settings-dropdown">
              {systemProps.mediaDisplaySetting}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
    </Modal>
  );
}
