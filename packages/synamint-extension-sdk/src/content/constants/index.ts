import { DomainName, URLString } from "@snickerdoodlelabs/objects";

export enum EAppState {
  IDLE,
  AUDIENCE_PREVIEW,
  PERMISSION_SELECTION,
  SUBSCRIPTION_CONFIRMATION,
  SUBSCRIPTION_SUCCESS,
  LOADING,
  SHOPPINGDATA,
  SHOPPINGDATA_INIT,
  SHOPPINGDATA_SCRAPE_PROCESS,
  SHOPPINGDATA_SCRAPE_DONE,
}

export interface IRewardItem {
  host: DomainName;
  title: string;
  description: string;
  image: URLString;
  primaryButtonText: string;
  secondaryButtonText: string;
  rewardName: string;
  nftClaimedImage: string;
}

export const signatureMessage = `Welcome to Snickerdoodle! This transaction proves that you own this wallet so that only you benefit from the data it produces.

Signing this transaction also demonstrates acceptance of the Snickerdoodle Terms of Service: https://snickerdoodlelabs.io/`;

export const safeURLsObject = {
  "traderjoe.com": "https://traderjoexyz.com",
  "sketchy.snickerdoodle.dev": "https://www.shrapnel.com",
  "sush1.com": "https://sushi.com",
  "pancake.finance": "pancakeswap.finance",
  "cradaba.com": "crabada.com",
  "pangolin.xyz": "pangolin.exchange",
};

export const PRIVACY_POLICY_URL =
  "https://policy.snickerdoodle.com/snickerdoodle-labs-data-privacy-policy";

export const WEBSITE_URL = "https://www.snickerdoodle.com/";

export const SPA_PATHS = {
  settings: "settings",
  dataPermissions: "data-permissions",
  dashboard: "data-dashboard/transaction-history",
  shoppingData: "data-dashboard/shopping-data",
};
