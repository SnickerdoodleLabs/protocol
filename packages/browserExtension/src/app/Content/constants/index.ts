import { DomainName, URLString } from "@snickerdoodlelabs/objects";
import Browser from "webextension-polyfill";

export enum EAPP_STATE {
  INIT,
  DISMISSED,
  CONNECT_WALLET,
  CONNECT_WALLET_PENDING,
  CONNECT_WALLET_SUCCESS,
  FREE_NFT_CLAIMED,
  CONNECT_WALLET_ERROR,
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
