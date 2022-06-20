import React, { useState } from "react";
import { Form, Input, Modal, Button } from "antd";
import "antd/dist/antd.css";
import {
  InfoCircleOutlined,
  ExclamationCircleOutlined,
  UploadOutlined
} from "@ant-design/icons";

import { isAllowed } from "../consts/inputSanitizer";

const { confirm } = Modal;

export enum modalTypes {
  ADD,
  REMOVE,
}

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
  type: modalTypes
): any => {
  const nameInList =
    // If the type is ADD, name should not yet exist
    (type == modalTypes.ADD && dashboardNames.includes(name)) ||
    // If type is REMOVE, name must be included
    (type == modalTypes.REMOVE && !dashboardNames.includes(name));
  return !(
    nameInList ||
    name == dashboardAddKey ||
    name == dashboardRemoveKey ||
    name == undefined ||
    name.trim().length == 0 ||
    !isAllowed(name)
  );
};

/**
 * @param {string} name
 * @param {*} dashboardNames
 * @return {*}
 */
function addDashboard(name: string, dashboardNames: any): any {
  dashboardNames.push(name);
  return dashboardNames;
}

/**
 * @param {string} name
 * @param {*} dashboardNames
 */
function removeDashboard(name: string, dashboardNames: any[]) {
  dashboardNames = dashboardNames.filter((item: string) => name != item);
  return dashboardNames;
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
  userConfig,
  setUserConfigQueryInput,
  displayDashboard,
  setWorkspaceState,
  workspaceState,
  workspaceStates,
  t,
  saveDashboardChanges,
}: any): JSX.Element {
  const [hasError, setError] = useState(false);
  const [manageDashboardForm] = Form.useForm();

  // Close the modal
  const hideModal = () => {
    // Reset the text field and hide the modal
    manageDashboardForm.resetFields();
    setVisible(false);
    setError(false);
  };

  /**
   * @param {string} newDashboardNames
   */
  const showDeleteConfirm = (
    newDashboardNames: string,
    userConfig: any,
    name: string
  ) => {
    confirm({
      title: t("dashboard.modal.removewarning.title"),
      icon: <ExclamationCircleOutlined />,
      content: t("dashboard.modal.removewarning.description"),
      okText: t("dashboard.modal.removewarning.confirmText"),
      okType: "danger",
      cancelText: t("dashboard.modal.removewarning.cancelText"),
      onOk() {
        setDashboardNames(newDashboardNames);
        // Remove the dashboard from the user configuration
        userConfig.dashboards = userConfig.dashboards.filter(
          (dashboard: any) => dashboard.name !== name
        );
        setUserConfigQueryInput(userConfig);

        if (workspaceState.name == name) {
          // If the deleted dashboard was currently displayed, set the working space back to empty
          setWorkspaceState({
            displaying: workspaceStates.EMPTY,
            name: "none",
          });
        }

        hideModal();
      },
    });
  };

  // Define variables for uploading a dashboard
  var update;
  const defaultDashboard = {"dashboard":{"name":"","dashboardElements":[]}}
  const [uploadState, setUploadState] = useState(defaultDashboard);

  /**
   * Handle the uploading of a dahsboard JSON
   * 
   * @param e 
   * @return {} 
   */
  const handleChange = (e: any) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = e => {
      // @ts-ignore
      update = e.target.result;
      // @ts-ignore
      const obj = JSON.parse(update);
      setUploadState(obj);
    };
  };

  /**
   * @param {object} values
   */
  const onFinish = (values: object) => {
    let name = Object.values(values)[0];

    // Check if the given name is valid
    if (
      isValidDashboardName(
        name,
        dashboardNames,
        dashboardAddKey,
        dashboardRemoveKey,
        modalType
      )
    ) {
      let newDashboardNames: any;
      name = name.trim();
      // Finish functionality depends on modal type
      switch (modalType) {
        case modalTypes.ADD:
          uploadState.dashboard.name = name;
          newDashboardNames = addDashboard(name, dashboardNames);

          // Push the new dashboard to the user configuration
          userConfig.dashboards.push({
            name: name,
            dashboardElements: [],
          });

          setDashboardNames(newDashboardNames);
          setUserConfigQueryInput(userConfig);
          
          hideModal();
          saveDashboardChanges(userConfig, uploadState);
          setUploadState(defaultDashboard);

          // Display the newly created dashboard in the working space
          displayDashboard(name, userConfig);

          //@ts-ignore
          (document.getElementsByClassName("upload-json") as HTMLInputElement)[0].value = null;
          break;
        case modalTypes.REMOVE:
          newDashboardNames = removeDashboard(name, dashboardNames);
          // Show confirmation modal
          showDeleteConfirm(newDashboardNames, userConfig, name);
          break;
        default:
          newDashboardNames = [];
      }
    } else {
      // Name is invalid, show error message on input
      setError(true);
    }
  };

  let modalTypeTextRef;
  switch (modalType) {
    case modalTypes.ADD:
      modalTypeTextRef = "add";
      break;
    case modalTypes.REMOVE:
      modalTypeTextRef = "remove";
      break;
  }

  return (
    <Modal
      title={t(`dashboard.modal.${modalTypeTextRef}.title`)}
      visible={isVisible}
      onOk={manageDashboardForm.submit}
      onCancel={hideModal}
    >
      <Form form={manageDashboardForm} layout="vertical" onFinish={onFinish}>
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
        {modalTypeTextRef == "add" ? (
          <Form.Item
            label={t('dashboard.modal.add.config')}
            tooltip={{
              title: t('dashboard.modal.add.popup'),
              icon: <InfoCircleOutlined />,
            }}
          >
            <input type="file" accept=".json" onChange={handleChange} className="upload-json" />
          </Form.Item>
        ) : (
          <></>
        )}
      </Form>
    </Modal>
  );
}
