import React, { useState } from "react";
import { useQuery } from "react-query";
import {
  Form,
  Input,
  Modal
} from "antd";
import "antd/dist/antd.css";
import { InfoCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "next-i18next";

const { confirm } = Modal;

export enum modalTypes { ADD, REMOVE }

/**
 * Check if a new dashboard name is valid
 *
 * @param {string} name
 * @param {*} dashboardNames
 * @param {string} dashboardAddKey
 * @param {string} dashboardRemoveKey
 * @return {*} 
 */
const isValidDashboardName = (
  name: string,
  dashboardNames: any,
  dashboardAddKey: string,
  dashboardRemoveKey: string,
  type: modalTypes) => {
  const nameInList =
    // If the type is ADD, name should not yet exist
    (type == modalTypes.ADD && dashboardNames.includes(name)) ||
    // If type is REMOVE, name must be included
    (type == modalTypes.REMOVE && !dashboardNames.includes(name));
  return !(nameInList || name == dashboardAddKey || name == dashboardRemoveKey || name == undefined)
}

/**
 * @param {string} name
 * @param {*} dashboardNames
 * @return {*} 
 */
function addDashboard(name: string, dashboardNames: any) {
  dashboardNames.push(name);
  return dashboardNames
}

/**
 * @param {string} name
 * @param {*} dashboardNames
 */
function removeDashboard(name: string, dashboardNames: any[]) {
  dashboardNames = dashboardNames.filter((item: string) => name != item)
  return dashboardNames
}

/**
 * @export
 * @param {*} {
 *   modalType,
 *   isVisible,
 *   setVisible,
 *   dashboardNames,
 *   setDashboardNames,
 *   dashboardAddKey,
 *   dashboardRemoveKey,
 *   hasuraProps,
 *   userConfig,
 *   setUserConfig,
 *   userConfigQueryInput,
 *   setUserConfigQueryInput
 * }
 * @return {*}  {JSX.Element}
 */
export default function ManageDashboardsModal({
  modalType,
  isVisible,
  setVisible,
  dashboardNames,
  setDashboardNames,
  dashboardAddKey,
  dashboardRemoveKey,
  hasuraProps,
  userConfig,
  setUserConfig,
  userConfigQueryInput,
  setUserConfigQueryInput
}: any): JSX.Element {
  const { t } = useTranslation();
  const [hasError, setError] = useState(false);
  const [form] = Form.useForm();

  const hasuraHeaders = {
    "Content-Type": "application/json",
    "x-hasura-admin-secret": hasuraProps.hasuraSecret,
  } as HeadersInit;

  const hideModal = () => {
    // Reset the text field and hide the modal
    form.resetFields();
    setVisible(false);
    setError(false);
  }

  /**
   * @param {string} newDashboardNames
   */
  const showDeleteConfirm = (newDashboardNames: string, userConfig: any, name: string) => {
    confirm({
      title: t("dashboard.modal.removewarning.title"),
      icon: <ExclamationCircleOutlined />,
      content:  t("dashboard.modal.removewarning.description"),
      okText: t("dashboard.modal.removewarning.confirmText"),
      okType: 'danger',
      cancelText: t("dashboard.modal.removewarning.cancelText"),
      onOk() {
        setDashboardNames(newDashboardNames);
        // Remove the dashboard from the user configuration
        userConfig.dashboards = userConfig.dashboards.filter((dashboard: any) => dashboard.name !== name)
        setUserConfigQueryInput(userConfig);
        hideModal();
      },
    });
  };

  /**
   * @param {object} values
   */
  const onFinish = (values: object) => {
    let name: string = Object.values(values)[0]
    // Check if the given name is valid
    if (isValidDashboardName(name, dashboardNames, dashboardAddKey, dashboardRemoveKey, modalType)) {

      let newDashboardNames: any;
      // Finish functionality depends on modal type
      switch (modalType) {
        case (modalTypes.ADD):
          newDashboardNames = addDashboard(name, dashboardNames);

          // Push the new dashboard to the user configuration
          userConfig.dashboards.push(
            {
              "name": name,
              "dashboardElements": []
            }
          );

          setDashboardNames(newDashboardNames);
          setUserConfigQueryInput(userConfig);
          hideModal();
          break;
        case (modalTypes.REMOVE):
          newDashboardNames = removeDashboard(name, dashboardNames);
          // Show confirmation modal
          showDeleteConfirm(newDashboardNames, userConfig, name)
          break;
        default:
          newDashboardNames = []
      }
    } else {
      // Name is invalid, show error message on input
      setError(true);
    }
  };

  let modalTypeTextRef;
  switch (modalType) {
    case modalTypes.ADD:
      modalTypeTextRef = "add"
      break;
    case modalTypes.REMOVE:
      modalTypeTextRef = "remove"
      break;
  }

  return (
    <Modal
      title={t(`dashboard.modal.${modalTypeTextRef}.title`)}
      visible={isVisible}
      onOk={form.submit}
      onCancel={hideModal}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          label={t(`dashboard.modal.${modalTypeTextRef}.name`)}
          name="name"
          tooltip={{
            title: t(`dashboard.modal.${modalTypeTextRef}.tooltip`),
            icon: <InfoCircleOutlined />,
          }}
          validateStatus={hasError ? "error" : ""}
          hasFeedback
          help={hasError ? t(`dashboard.modal.${modalTypeTextRef}.error`) : ""}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
