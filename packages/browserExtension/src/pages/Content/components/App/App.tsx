import React, { useEffect, useState } from "react";
import RewardCard from "../RewardCard";

enum EAvailableHost {
  SHRAPNEL = "www.shrapnel.com",
  CRABADA = "idle.crabada.com",
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
    image: "",
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Dismiss",
    rewardName: "Crabada 761",
  },
  {
    host: EAvailableHost.SHRAPNEL,
    title: "Claim your free NFT!",
    description:
      "Connect your Metamask wallet with our data wallet to gain free probs and NFT’s.",
    image: "",
    primaryButtonText: "Claim Reward",
    secondaryButtonText: "Dismiss",
    rewardName: "ATG-47 Pistol",
  },
];

const App = () => {
  const [rewardToDisplay, setRewardToDisplay] = useState<
    RewardItem | undefined
  >();
  const hostname = window.location.hostname;
  useEffect(() => {
    console.log("hostname: ", hostname);
    const reward = REWARD_DATA.find((i) => i.host === hostname);
    if (reward) {
      setRewardToDisplay(reward);
    }
  }, []);
  if (!rewardToDisplay) {
    return null;
  }
  return <RewardCard rewardItem={rewardToDisplay} />;
};

export default App;
