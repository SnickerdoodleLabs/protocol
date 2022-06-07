import React, { useEffect, useState } from "react";
import RewardCard from "../RewardCard";

enum EAvailableHost {
  SHRAPNEL = "www.shrapnel.com",
  CRABADA = "market.crabada.com",
}

export enum APP_STATE {
  INIT = 0,
  DISMISSED = 1,
  CONNECT_METAMASK = 2,
  CONNECT_METAMASK_PENDING = 3,
  CONNECT_METAMASK_SUCCESS = 4,
  FREE_NFT_CLAIMED = 5,
}
export interface RewardItem {
  host: EAvailableHost;
  title: string;
  description: string;
  image: string;
  primaryButtonText: string;
  secondaryButtonText: string;
  rewardName: string;
}

export const REWARD_DATA: Array<RewardItem> = [
  {
    host: EAvailableHost.CRABADA,
    title: "Claim your free NFT!",
    description:
      "Connect your Metamask wallet with our data wallet to gain free probs and NFT’s.",
    image: chrome.runtime.getURL("assets/img/crabada-item.png"),
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Back to Game",
    rewardName: "Crabada 761",
  },
  {
    host: EAvailableHost.SHRAPNEL,
    title: "Claim your free NFT!",
    description:
      "Connect your Metamask wallet with our data wallet to gain free probs and NFT’s.",
    image: chrome.runtime.getURL("assets/img/sharapnel-item.png"),
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Back to Game",
    rewardName: "ATG-36 Helmet",
  },
];

// const renderCurrentState() {
// }
const App = () => {
  //const [dismiss, setDissmiss] = useState<boolean>(false);
  const [appState, setAppState] = useState<APP_STATE>(APP_STATE.INIT);

  document.addEventListener(
    "SD_WALLET_CONNECTION_COMPLETED",
    async function (e) {
      // @ts-ignore
      const { accounts, signature } = e.detail;
      console.log("accounts received: ", accounts);
      chrome.storage.sync.set({ accountAddress: accounts }, function () {
        console.log("Value is set to" + accounts);
      });
    },
  );

  const [rewardToDisplay, setRewardToDisplay] = useState<
    RewardItem | undefined
  >();
  const hostname = window.location.hostname;
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    console.log("hostname: ", hostname);
    const reward = REWARD_DATA.find((i) => i.host === hostname);
    if (reward) {
      timeout = setTimeout(() => {
        setRewardToDisplay(reward);
      }, 1500);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, []);
  if (!rewardToDisplay) {
    return null;
  }
  return (() => {
    switch (appState) {
      case APP_STATE.INIT:
        return (
          <RewardCard rewardItem={rewardToDisplay} setAppState={setAppState} />
        );
      case APP_STATE.DISMISSED:
        return <></>;
    }
  })();
};

export default App;
