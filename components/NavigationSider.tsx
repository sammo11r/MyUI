import React, { ReactNode } from "react";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import {
  TableOutlined,
  PicCenterOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

import { sideBarItemType } from "../consts/enum";
import { NavigationSiderProps } from "../utils/customTypes";
import { MenuItemType } from "rc-menu/lib/interface";

const { Sider } = Layout;
const dashboardAddKey = "dashboardAdd";
const dashboardRemoveKey = "dashboardDelete";

let storedSideBarItems: MenuItemType[];

/**
 * @param {string[]} tableNames
 * @param {string[]} dashboardNames
 * @param {*} t
 * @return {*}
 */
function getSideBarItems(
  tableNames: string[],
  dashboardNames: string[],
  t: (arg0: string) => string
) {
  if (!tableNames) return storedSideBarItems;

  /**
   * @param {sideBarItemType} key
   * @param {string} label
   * @param {ReactNode} icon
   * @param {string[]} children
   * @return {*}  {({key: sideBarItemType, label: string, icon: ReactNode, children: { key: string; label: string; icon: JSX.Element|null; }[] })}
   */
  function getItem(
    key: sideBarItemType,
    label: string,
    icon: ReactNode,
    children: string[]
  ): {
    key: sideBarItemType;
    label: string;
    icon: ReactNode;
    children: { key: string; label: string; icon: JSX.Element | null }[];
  } {
    return {
      key: key,
      label: label,
      icon: icon,
      children: children.map(getChildren),
    };
  }

  /**
   * @param {string} name
   * @return {*}  {({ key: string; label: string; icon: JSX.Element|null; })}
   */
  function getChildren(name: string): {
    key: string;
    label: string;
    icon: JSX.Element | null;
  } {
    switch (name) {
      case dashboardAddKey:
        return {
          key: dashboardAddKey,
          label: t("dashboard.new"),
          icon: <PlusCircleOutlined data-testid="dash-plus"/>,
        };
      case dashboardRemoveKey:
        return {
          key: dashboardRemoveKey,
          label: t("dashboard.delete"),
          icon: <MinusCircleOutlined data-testid="dash-minus"/>,
        };
      default:
        return {
          key: name,
          label: name,
          icon: null,
        };
    }
  }

  let dashboardItems = [
    getItem(
      sideBarItemType.BASE_TABLE,
      t("basetable.sidebar"),
      <TableOutlined />,
      tableNames
    ),
    getItem(
      sideBarItemType.DASHBOARD,
      t("dashboard.sidebar"),
      <PicCenterOutlined />,
      dashboardNames.concat(dashboardAddKey, dashboardRemoveKey)
    ),
  ];
  storedSideBarItems = dashboardItems;
  return dashboardItems;
}

/**
 * @param {NavigationSiderProps} {
 *   baseTableNames,
 *   dashboardNames,
 *   selectedKeys,
 *   baseTableOnClick,
 *   dashboardOnClick,
 *   t,
 * }
 * @return {*}  {JSX.Element}
 */
function NavigationSider({
  baseTableNames,
  dashboardNames,
  selectedKeys,
  baseTableOnClick,
  dashboardOnClick,
  t,
}: NavigationSiderProps): JSX.Element {
  return (
    <Sider width={200} className="site-layout-background" data-testid="sider">
      <Menu
        mode="inline"
        selectedKeys={[selectedKeys]}
        style={{
          height: "100%",
          borderRight: 0,
        }}
        items={getSideBarItems(baseTableNames, dashboardNames, t)}
        onClick={(item) => {
          // Get type of item
          const itemType: string = item.keyPath[1];

          switch (itemType) {
            case sideBarItemType.BASE_TABLE.toString():
              baseTableOnClick(item.key);
              break;
            case sideBarItemType.DASHBOARD.toString():
              dashboardOnClick(item.key);
              break;
          }
        }}
      />
    </Sider>
  );
}

export default NavigationSider;
export { dashboardAddKey, dashboardRemoveKey };
