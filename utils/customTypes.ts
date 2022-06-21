import {
  elementType,
  modalType,
  workspaceType,
  loadingState,
} from "../consts/enum";
import { FormInstance } from "antd";
import { ColumnGroupType, ColumnType, Key } from "antd/lib/table/interface";

/**
 * @export
 * @interface AddDeleteRowMenuProps
 * @extends {ColumnProps}
 * @extends {GridViewToggle}
 * @extends {Translation}
 */
export interface AddDeleteRowMenuProps
  extends ColumnProps,
    GridViewToggle,
    Translation {
  setTableNameState: React.Dispatch<React.SetStateAction<string>>;
  hasuraHeaders: HeadersInit;
  hasuraProps: HasuraProps;
  columns: (ColumnGroupType<{ key: string }> | ColumnType<{ key: string }>)[];
  tableName: string;
  selectedRow: { key: string }[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  encrypt: (password: { password: string }) => Promise<any>;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertText: React.Dispatch<React.SetStateAction<string>>;
  insertable: boolean;
  deletable: boolean;
}

/**
 * @export
 * @interface AppHeaderProps
 * @extends {Translation}
 */
export interface AppHeaderProps extends Translation {
  userConfig: UserConfig;
  userRoles: Array<string>;
  setUserConfig: React.Dispatch<React.SetStateAction<UserConfig>>;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  setGlobalSettingsModalState: React.Dispatch<React.SetStateAction<boolean>>;
  workspaceState: WorkspaceState;
  toggleEditMode: () => void;
}

/**
 * @export
 * @interface AppProps
 */
export interface AppProps {
  hasuraProps: HasuraProps;
  systemProps: SystemProps;
}

/**
 * @export
 * @interface BaseTableType
 */
export interface BaseTableType {
  name: string;
  columnNames: string[];
  ordering: { by: string; direction: string };
}

/**
 * @export
 * @interface BaseTableProps
 * @extends {AppProps}
 * @extends {GridViewToggle}
 * @extends {Translation}
 */
export interface BaseTableProps extends AppProps, GridViewToggle, Translation {
  name: string;
  userConfig: UserConfig;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  hasuraHeaders: HeadersInit;
  encrypt: (password: { password: string }) => Promise<any>;
  mode: workspaceType;
}

/**
 * @export
 * @interface ColumnProps
 */
export interface ColumnProps {
  dataIndex?: string;
  defaultSortOrder?: string;
  editable?: boolean;
  key?: string;
  render?: (_: any, row: { key: string }) => JSX.Element;
  showSorterTooltip?: boolean;
  sorter?: (a: any, b: any) => number;
  title?: string | JSX.Element;
}

/**
 * @export
 * @interface CheckPermissionsProps
 */
export interface CheckPermissionsProps {
  isBaseTable: boolean;
  hasuraProps: HasuraProps;
  hasuraHeaders: HeadersInit;
  setEditable: React.Dispatch<React.SetStateAction<boolean>>;
  setInsertable: React.Dispatch<React.SetStateAction<boolean>>;
  setDeletable: React.Dispatch<React.SetStateAction<boolean>>;
  tableName: string;
  mode: workspaceType;
  gridViewToggle: boolean;
}

/**
 * @export
 * @interface DashboardType
 */
export interface DashboardType {
  name: string;
  dashboardElements: DashboardElementType[];
}

/**
 * @export
 * @interface DashboardElementType
 */
export interface DashboardElementType {
  name: string;
  ordering: { by?: string; direction?: string };
  x: number;
  y: number;
  w: number;
  h: number;
  type: elementType;
  text: string;
  query: string;
}

/**
 * @export
 * @interface DashboardProps
 * @extends {AppProps}
 * @extends {GridViewToggle}
 * @extends {Translation}
 */
export interface DashboardProps extends AppProps, GridViewToggle, Translation {
  mode: workspaceType;
  userConfig: UserConfig;
  dashboardState: DashboardState;
  setDashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
  setEditElementModalState: React.Dispatch<
    React.SetStateAction<EditElementModalState>
  >;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  hasuraHeaders: HeadersInit;
  encrypt: (password: { password: string }) => Promise<any>;
}

/**
 * @export
 * @interface DashboardState
 */
export interface DashboardState {
  dashboard: DashboardType;
}

/**
 * @export
 * @interface EditableCellType
 */
export interface EditableCellType {
  editing: boolean;
  dataIndex: string;
  title: string;
  inputType: string;
  record: string;
  index: string;
  children: string;
  restProps: string;
}

/**
 * @export
 * @interface EditElementModalProps
 * @extends {Translation}
 */
export interface EditElementModalProps extends Translation {
  state: EditElementModalState;
  setState: React.Dispatch<React.SetStateAction<EditElementModalState>>;
}

/**
 * @export
 * @interface EditElementModalState
 */
export interface EditElementModalState {
  visible: boolean;
  element: DashboardElementType;
}

/**
 * @export
 * @interface EditModeSiderProps
 * @extends {Translation}
 */
export interface EditModeSiderProps extends Translation {
  userConfig: UserConfig;
  dashboardState: DashboardState;
  loadings: boolean;
  saveDashboardChanges: (
    userConfig: UserConfig,
    dashboardState: DashboardState
  ) => void;
}

export type ErrorMessageResponse = {
  message: string;
};

/**
 * @export
 * @interface GlobalSettingsProps
 * @extends {Translation}
 */
export interface GlobalSettingsProps extends Translation {
  globalSettingsModalState: boolean;
  setGlobalSettingsModalState: React.Dispatch<React.SetStateAction<boolean>>;
  updateUserConfig: (userConfig: UserConfigSetting) => Promise<void>;
  systemProps: SystemProps;
}

/**
 * @export
 * @interface GridViewProps
 * @extends {AppProps}
 * @extends {GridViewToggle}
 * @extends {Translation}
 */
export interface GridViewProps extends AppProps, GridViewToggle, Translation {
  query: string;
  style?: React.CSSProperties;
  userConfig: UserConfig;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  name: string;
  dashboardName: string;
  hasuraHeaders: HeadersInit;
  mode: workspaceType;
  encrypt: (password: { password: string }) => Promise<any>;
}

interface GridViewToggle {
  gridViewToggle: boolean;
  setGridViewToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @export
 * @interface HasuraProps
 */
export interface HasuraProps {
  hasuraSecret: string;
  hasuraEndpoint: RequestInfo;
}

/**
 * @export
 * @interface JWTHasura
 */
export interface JWTHasura {
  sub: string;
  name: string;
  admin: boolean;
  iat: string;
  "https://hasura.io/jwt/claims": {
    "x-hasura-allowed-roles": Array<string>;
    "x-hasura-default-role": string;
  };
}

/**
 * @export
 * @interface ManageDashboardsModalProps
 * @extends {Translation}
 */
export interface ManageDashboardsModalProps extends Translation {
  type: modalType;
  isVisible: boolean;
  setVisible: (visible: boolean) => void;
  dashboardNames: string[];
  setDashboardNames: React.Dispatch<React.SetStateAction<string[]>>;
  dashboardAddKey: string;
  dashboardRemoveKey: string;
  userConfig: UserConfig;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  displayDashboard: (name: string, userConfig: UserConfig) => void;
  setWorkspaceState: React.Dispatch<React.SetStateAction<WorkspaceState>>;
  workspaceState: WorkspaceState;
  saveDashboardChanges: (
    userConfig: UserConfig,
    dashboardState: DashboardState
  ) => void;
}

export type MessageResponse = {
  message: string;
};

/**
 * @export
 * @interface NavigationSiderProps
 * @extends {Translation}
 */
export interface NavigationSiderProps extends Translation {
  baseTableNames: string[];
  dashboardNames: string[];
  selectedKeys: string;
  baseTableOnClick: (name: string) => void;
  dashboardOnClick: (name: string) => void;
}

export type PasswordEncryptRequest = {
  password: string;
};

export type PasswordResponse = {
  encryptedPassword: string;
};

/**
 * @export
 * @interface QueryTableDataProps
 * @extends {Translation}
 */
export interface QueryTableDataProps extends Translation {
  query: string;
  tableNameState: string;
  hasuraProps: HasuraProps;
  hasuraHeaders: HeadersInit;
  setTableState: React.Dispatch<React.SetStateAction<TableStateProps>>;
  isBaseTable: boolean;
  tableName: string;
  dashboardName: string;
  userConfig: UserConfig;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  mediaDisplaySetting: string;
  gridViewToggle: boolean;
  elementName: string;
}

export type RESTDataResponse = {
  data: any;
};

/**
 * @export
 * @interface StaticElementProps
 */
export interface StaticElementProps {
  style?: React.CSSProperties;
  text: string;
  mediaDisplaySetting: string;
}

/**
 * @export
 * @interface SystemProps
 */
export interface SystemProps {
  mediaDisplaySetting: string;
}

/**
 * @export
 * @interface TableDataProps
 * @extends {AppProps}
 * @extends {GridViewToggle}
 * @extends {Translation}
 */
export interface TableDataProps extends AppProps, GridViewToggle, Translation {
  isBaseTable: boolean;
  hasuraHeaders: HeadersInit;
  tableName: string;
  query: string;
  userConfig: UserConfig;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  dashboardName: string;
  style?: React.CSSProperties;
  encrypt: (password: { password: string }) => Promise<any>;
  mode: workspaceType;
}

/**
 * @export
 * @interface TableStateProps
 */
export interface TableStateProps {
  data: readonly { key: string }[] | undefined;
  columns: (ColumnGroupType<{ key: string }> | ColumnType<{ key: string }>)[];
  columnsReady: boolean;
  dataState: loadingState;
}

type Translation = {
  t: (arg0: string) => string;
};

/**
 * @export
 * @interface updateRowQueryProps
 * @extends {Translation}
 */
export interface updateRowQueryProps extends Translation {
  editRowQueryInput?: string;
  hasuraProps: HasuraProps;
  hasuraHeaders: HeadersInit;
  editRowForm: FormInstance<any>;
  setEditingKey: React.Dispatch<React.SetStateAction<string>>;
  setTableNameState: React.Dispatch<React.SetStateAction<string>>;
  setEditRowQueryInput: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setAlert: React.Dispatch<React.SetStateAction<boolean>>;
  setAlertText: React.Dispatch<React.SetStateAction<string>>;
  gridViewToggle: boolean;
  setGridViewToggle: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @export
 * @interface UserConfig
 */
export interface UserConfig {
  baseTables: BaseTableType[];
  dashboards: DashboardType[];
  uiPreferences: { language: string };
}

export type UserConfigSetting = {
  mediaDisplaySetting: string;
};

/**
 * @export
 * @interface WorkspaceProps
 * @extends {AppProps}
 * @extends {GridViewToggle}
 * @extends {Translation}
 */
export interface WorkspaceProps extends AppProps, GridViewToggle, Translation {
  workspaceState: WorkspaceState;
  userConfig: UserConfig;
  setUserConfigQueryInput: React.Dispatch<
    React.SetStateAction<UserConfig | undefined>
  >;
  dashboardState: DashboardState;
  setEditElementModalState: React.Dispatch<
    React.SetStateAction<EditElementModalState>
  >;
  setDashboardState: React.Dispatch<React.SetStateAction<DashboardState>>;
  encrypt: (password: { password: string }) => Promise<any>;
  hasuraHeaders: HeadersInit;
}

/**
 * @export
 * @interface WorkspaceState
 */
export interface WorkspaceState {
  displaying: workspaceType;
  name: string;
}
