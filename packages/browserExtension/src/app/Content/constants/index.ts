import { DomainName, URLString } from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";

export enum EAPP_STATE {
  INIT,
  PERMISSION_SELECTION,
  MANAGE_PERMISSIONS,
  DISMISSED,
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

export const rewardItemQMarkImg = Browser.runtime.getURL(
  "assets/img/reward-item-qmark.png",
);
export const rewardItemToClaim01Img = Browser.runtime.getURL(
  "assets/img/reward-item-to-claim01.png",
);
export const rewardItemToClaim02Img = Browser.runtime.getURL(
  "assets/img/reward-item-to-claim02.png",
);
export const rewardItemToClaim03Img = Browser.runtime.getURL(
  "assets/img/reward-item-to-claim03.png",
);
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
