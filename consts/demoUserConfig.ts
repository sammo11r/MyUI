import { UserConfig } from "../utils/customTypes";
import { dashboardState } from "./demoDashboardConfig";

export const userConfig = {
    "dashboards": [dashboardState.dashboard],
    "uiPreferences": {
        "language": "en"
    },
    "baseTables": [{}]
  } as UserConfig;