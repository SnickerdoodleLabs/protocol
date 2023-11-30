export enum EShoppingDataState {
  SHOPPINGDATA_IDLE,
  SHOPPINGDATA_INIT,
  SHOPPINGDATA_SCRAPE_PROCESS,
  SHOPPINGDATA_SCRAPE_DONE,
}

export const SPA_PATHS = {
  settings: "settings",
  dataPermissions: "data-permissions",
  dashboard: "data-dashboard/transaction-history",
  shoppingData: "data-dashboard/shopping-data",
};

export const PRIVACY_POLICY_URL =
  "https://policy.snickerdoodle.com/snickerdoodle-labs-data-privacy-policy";

export const WEBSITE_URL = "https://www.snickerdoodle.com/";

const width = 100;
const height = 100;

const left = (window.screen.width - width) / 2;
const top = (window.screen.height - height) / 2;

export const windowFeatures =
  "width=" + width + ",height=" + height + ",left=" + left + ",top=" + top;
