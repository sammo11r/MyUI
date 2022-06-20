import React from "react";
import "antd/dist/antd.css";
import { Layout, Menu } from "antd";
import { sideBarItemTypes } from "../consts/enum";
import {
  TableOutlined,
  PicCenterOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";

const { Sider } = Layout;
const dashboardAddKey = "dashboardAdd";
const dashboardRemoveKey = "dashboardDelete";

/**
 * @param {*} label
 * @param {*} key
 * @param {*} icon
 * @param {*} children
 * @return {*}
 */
function getItem(label: any, key: any, icon: any, children: any) {
  return {
    key,
    icon,
    children,
    label,
  };
}

let storedSideBarItems: any;

/**
 * @param {string[]} tableNames
 * @param {string[]} dashboardNames
 * @param {*} t
 * @return {*}
 */
function getSideBarItems(
  tableNames: string[],
  dashboardNames: string[],
  t: any
) {
  // Due to queries doing wonky stuff and executing 4 times,
  // later calls to this function might end up with undefined names, hence save copy
  if (!tableNames) return storedSideBarItems;

  let dashboardItems = [
    getItem(
      t("basetable.sidebar"),
      sideBarItemTypes.BASE_TABLE,
      <TableOutlined />,
      tableNames.map((name: string) => getItem(name, `${name}`, null, null))
    ),
    getItem(
      t("dashboard.sidebar"),
      sideBarItemTypes.DASHBOARD,
      <PicCenterOutlined />,
      dashboardNames
        .map((name: string) => getItem(name, `${name}`, null, null))
        .concat([
          {
            ...getItem(
              t("dashboard.new"),
              dashboardAddKey,
              <PlusCircleOutlined />,
              null
            ),
          },
          {
            ...getItem(
              t("dashboard.delete"),
              dashboardRemoveKey,
              <MinusCircleOutlined />,
              null
            ),
          },
        ])
    ),
  ];
  storedSideBarItems = dashboardItems;
  return dashboardItems;
}

/**
 * @param {*} {
 *   baseTableNames,
 *   dashboardNames,
 *   selectedKeys,
 *   openKeys,
 *   baseTableOnClick,
 *   dashboardOnClick,
 *   t
 * }
 * @return {*}
 */
function NavigationSider({
  baseTableNames,
  dashboardNames,
  selectedKeys,
  baseTableOnClick,
  dashboardOnClick,
  t,
}: any): any {
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
            case sideBarItemTypes.BASE_TABLE.toString():
              baseTableOnClick(item.key);
              break;
            case sideBarItemTypes.DASHBOARD.toString():
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
