enum EAVAILABLE_HOSTS {
  SHRAPNEL = "www.shrapnel.com",
  CRABADA = "market.crabada.com",
}

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
  host: EAVAILABLE_HOSTS;
  title: string;
  description: string;
  image: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  rewardName: string;
  nftClaimedImage: string;
}

export const REWARD_DATA: Array<IRewardItem> = [
  {
    host: EAVAILABLE_HOSTS.CRABADA,
    title: "Claim your NFT!",
    description:
      "Connect your wallet with the Snickerdoodle Data Wallet to gain NFTs or other rewards!",
    image: chrome.runtime.getURL("assets/img/crabada-item.png"),
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Back to Game",
    rewardName: "Crabada 761",
    nftClaimedImage: chrome.runtime.getURL(
      "assets/img/crabada-item-claimed.png",
    ),
  },
  {
    host: EAVAILABLE_HOSTS.SHRAPNEL,
    title: "Claim your NFT!",
    description:
      "Connect your wallet with the Snickerdoodle Data Wallet to gain NFTs or other rewards!",
    image: chrome.runtime.getURL("assets/img/sharapnel-item.png"),
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Back to Game",
    rewardName: "ATG-36 Helmet",
    nftClaimedImage: chrome.runtime.getURL(
      "assets/img/sharapnel-item-claimed.png",
    ),
  },
];

export const rewardItemQMarkImg = chrome.runtime.getURL(
  "assets/img/reward-item-qmark.png",
);
export const rewardItemToClaim01Img = chrome.runtime.getURL(
  "assets/img/reward-item-to-claim01.png",
);
export const rewardItemToClaim02Img = chrome.runtime.getURL(
  "assets/img/reward-item-to-claim02.png",
);
export const rewardItemToClaim03Img = chrome.runtime.getURL(
  "assets/img/reward-item-to-claim03.png",
);
export const signatureMessage = `Welcome to Snickerdoodle! This transaction proves that you own this wallet so that only you benefit from the data it produces.

Signing this transaction also demonstrates acceptance of the Snickerdoodle Terms of Service: https://snickerdoodlelabs.io/`;
