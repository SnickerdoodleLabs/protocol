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
}

export const REWARD_DATA: Array<IRewardItem> = [
  {
    host: EAVAILABLE_HOSTS.CRABADA,
    title: "Claim your free NFT!",
    description:
      "Connect your Metamask wallet with our data wallet to gain free probs and NFT’s.",
    image: chrome.runtime.getURL("assets/img/crabada-item.png"),
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Back to Game",
    rewardName: "Crabada 761",
  },
  {
    host: EAVAILABLE_HOSTS.SHRAPNEL,
    title: "Claim your free NFT!",
    description:
      "Connect your Metamask wallet with our data wallet to gain free probs and NFT’s.",
    image: chrome.runtime.getURL("assets/img/sharapnel-item.png"),
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Back to Game",
    rewardName: "ATG-36 Helmet",
  },
];
