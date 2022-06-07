import React, { useEffect, useMemo, useState } from "react";

import RewardCard from "../Screens/RewardCard";
import ConnectWallet from "../Screens/ConnectWallet";
import ConnectWalletPending from "../Screens/ConnectWalletPending";
import ConnectWalletSuccess from "../Screens/ConnectWalletSuccess";
import NftClaimed from "../Screens/NftClaimed";

import { EAPP_STATE, IRewardItem, REWARD_DATA } from "../../constants";

const App = () => {
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.INIT);
  const [rewardToDisplay, setRewardToDisplay] = useState<
    IRewardItem | undefined
  >();

  useEffect(() => {
    initiateRewardItem();
    addEventListeners();
    return () => {
      removeEventListeners();
    };
  }, []);

  useEffect(() => {
    if (appState === EAPP_STATE.CONNECT_WALLET_SUCCESS) {
      setTimeout(() => {
        setAppState(EAPP_STATE.FREE_NFT_CLAIMED);
      }, 1000);
    }
  }, [appState]);

  const changeAppState = (state: EAPP_STATE) => {
    setAppState(state);
  };

  const initiateRewardItem = () => {
    const hostname = window.location.hostname;
    const reward = REWARD_DATA.find((i) => i.host === hostname);
    if (reward) {
      setRewardToDisplay(reward);
    }
  };

  // Event Listeners
  const addEventListeners = () => {
    document.addEventListener(
      "SD_WALLET_CONNECTION_COMPLETED",
      onWalletConnectionCompleted,
    );

    document.addEventListener(
      "SD_WALLET_CONNECTION_PENDING",
      onWalletConnectionPending,
    );
  };

  const removeEventListeners = () => {
    document.removeEventListener(
      "SD_WALLET_CONNECTION_COMPLETED",
      onWalletConnectionCompleted,
    );

    document.removeEventListener(
      "SD_WALLET_CONNECTION_PENDING",
      onWalletConnectionPending,
    );
  };

  // Event handlers
  const onWalletConnectionCompleted = (e: Event) => {
    // @ts-ignore
    const { accounts, signature } = e.detail;
    console.log("accounts received: ", accounts);
    chrome.storage.sync.set({ accountAddress: accounts }, function () {
      console.log("Value is set to" + accounts);
    });
    setAppState(EAPP_STATE.CONNECT_WALLET_SUCCESS);
  };

  const onWalletConnectionPending = (e: Event) => {
    setAppState(EAPP_STATE.CONNECT_WALLET_PENDING);
  };

  const renderComponent = useMemo(() => {
    switch (true) {
      case !rewardToDisplay || appState === EAPP_STATE.DISMISSED:
        return null;
      case appState === EAPP_STATE.INIT:
        return (
          <RewardCard
            rewardItem={rewardToDisplay!}
            changeAppState={changeAppState}
          />
        );
      case appState === EAPP_STATE.CONNECT_WALLET:
        return <ConnectWallet changeAppState={changeAppState} />;
      case appState === EAPP_STATE.CONNECT_WALLET_PENDING:
        return <ConnectWalletPending changeAppState={changeAppState} />;
      case appState === EAPP_STATE.CONNECT_WALLET_SUCCESS:
        return <ConnectWalletSuccess changeAppState={changeAppState} />;
      case appState === EAPP_STATE.FREE_NFT_CLAIMED:
        return (
          <NftClaimed
            rewardItem={rewardToDisplay!}
            changeAppState={changeAppState}
          />
        );
      default:
        return null;
    }
  }, [rewardToDisplay, appState]);

  return <>{renderComponent}</>;
};

export default App;
