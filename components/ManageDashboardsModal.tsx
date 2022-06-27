import React, { BaseSyntheticEvent, useState } from "react";
import { Form, Input, Modal } from "antd";
import "antd/dist/antd.css";
import {
  InfoCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";

import { isAllowed } from "../consts/inputSanitizer";
import { modalType, workspaceType } from "../consts/enum";
import {
  DashboardType,
  ManageDashboardsModalProps,
  UserConfig,
} from "../utils/customTypes";

const { confirm } = Modal;

/**
 * Check if a new dashboard name is valid
 *
 * @param {string} name
 * @param {string[]} dashboardNames
 * @param {string} dashboardAddKey
 * @param {string} dashboardRemoveKey
 * @param {modalType} type
 * @return {*}  {boolean}
 */
const isValidDashboardName = (
  name: string,
  dashboardNames: string[],
  dashboardAddKey: string,
  dashboardRemoveKey: string,
  type: modalType
): boolean => {
  const nameInList =
    // If the type is ADD, name should not yet exist
    (type == modalType.ADD && dashboardNames.includes(name)) ||
    // If type is REMOVE, name must be included
    (type == modalType.REMOVE && !dashboardNames.includes(name));
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
 * Add a dashboard
 *
 * @param {string[]} dashboardNames
 * @param {string} name
 * @return {*}  {string[]}
 */
function addDashboard(name: string, dashboardNames: string[]): string[] {
  dashboardNames.push(name);
  return dashboardNames;
}

/**
 * Delete a dashboard
 *
 * @param {string} name
 * @param {string[]} dashboardNames
 * @return {*}  {string[]}
 */
function removeDashboard(name: string, dashboardNames: string[]): string[] {
  dashboardNames = dashboardNames.filter((item: string) => name != item);
  return dashboardNames;
}

/**
 * @export
 * @param {ManageDashboardsModalProps} {
 *   type,
 *   isVisible,
 *   setVisible,
 *   dashboardNames,
 *   setDashboardNames,
 *   dashboardAddKey,
 *   dashboardRemoveKey,
 *   userConfig,
 *   setUserConfigQueryInput,
 *   displayDashboard,
 *   setWorkspaceState,
 *   workspaceState,
 *   t,
 *   saveDashboardChanges,
 * }
 * @return {*}  {JSX.Element}
 */
export default function ManageDashboardsModal({
  type,
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
  t,
  saveDashboardChanges,
}: ManageDashboardsModalProps): JSX.Element {
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
   * @param {string[]} newDashboardNames
   */
  const showDeleteConfirm = (
    newDashboardNames: string[],
    userConfig: UserConfig,
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
          (dashboard: DashboardType) => dashboard.name !== name
        );
        setUserConfigQueryInput(userConfig);

        if (workspaceState.name == name) {
          // If the deleted dashboard was currently displayed, set the working space back to empty
          setWorkspaceState({
            displaying: workspaceType.EMPTY,
            name: "none",
          });
          window.history.replaceState(null, "", "/")
        }

        hideModal();
      },
    });
  };

  // Define variables for uploading a dashboard
  var update;
  const defaultDashboard = { dashboard: { name: "", dashboardElements: [] } };
  const [uploadState, setUploadState] = useState(defaultDashboard);

  /**
   * Handle the uploading of a dahsboard JSON
   *
   * @param {BaseSyntheticEvent} e
   */
  const handleChange = (e: BaseSyntheticEvent): void => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], "UTF-8");
    fileReader.onload = (e) => {
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
        type
      )
    ) {
      let newDashboardNames: string[];
      name = name.trim();
      // Finish functionality depends on modal type
      switch (type) {
        case modalType.ADD:
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
          (
            document.getElementsByClassName("upload-json") as HTMLInputElement
          )[0].value = null;
          break;
        case modalType.REMOVE:
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
  switch (type) {
    case modalType.ADD:
      modalTypeTextRef = "add";
      break;
    case modalType.REMOVE:
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
            label={t("dashboard.modal.add.config")}
            tooltip={{
              title: t("dashboard.modal.add.popup"),
              icon: <InfoCircleOutlined />,
            }}
          >
            <input
              type="file"
              accept=".json"
              onChange={handleChange}
              className="upload-json"
            />
          </Form.Item>
        ) : (
          <></>
        )}
      </Form>
    </Modal>
  );
}
