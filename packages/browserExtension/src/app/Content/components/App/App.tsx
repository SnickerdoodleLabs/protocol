import React, { useEffect, useMemo, useState } from "react";

import RewardCard from "../Screens/RewardCard";
import ConnectWallet from "../Screens/ConnectWallet";
import ConnectWalletPending from "../Screens/ConnectWalletPending";
import ConnectWalletSuccess from "../Screens/ConnectWalletSuccess";
import NftClaimed from "../Screens/NftClaimed";
import browser from "webextension-polyfill";
import { EAPP_STATE, IRewardItem, REWARD_DATA } from "../../constants";
import Browser from "webextension-polyfill";
import { ExternalCoreGateway } from "@app/coreGateways";
import { createBackgroundConnectors } from "app/utils";
import { IExternalState } from "@shared/objects/State";

const port = Browser.runtime.connect({ name: "SD_CONTENT_SCRIPT" });
let coreGateway: ExternalCoreGateway;
let notificationEmitter;

const connectors = createBackgroundConnectors(port);
if (connectors.isOk()) {
  coreGateway = new ExternalCoreGateway(connectors.value.rpcEngine);
  notificationEmitter = connectors.value.streamMiddleware.events;
}

const App = () => {
  const [backgroundState, setBackgroundState] = useState<IExternalState>();
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.INIT);
  const [rewardToDisplay, setRewardToDisplay] = useState<
    IRewardItem | undefined
  >();

  useEffect(() => {
    initiateBackgroundState();
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

  const initiateBackgroundState = () => {
    coreGateway.getState().map((state) => {
      setBackgroundState(state);
    });
  };

  const isScam = useMemo(
    () => backgroundState?.scamList.includes(window.location.origin),
    [backgroundState],
  );

  const isInWhiteList = useMemo(
    () => backgroundState?.whiteList.includes(window.location.origin),
    [backgroundState],
  );

  const renderScamWarning = useMemo(
    () => (isScam ? <p>scam</p> : null),
    [isScam],
  );

  const renderSafeUrlNotification = useMemo(
    () => (isInWhiteList ? <p>safe url</p> : null),
    [isInWhiteList],
  );

  const changeAppState = (state: EAPP_STATE) => {
    setAppState(state);
  };

  const initiateRewardItem = () => {
    const hostname = window.location.hostname;
    const reward = REWARD_DATA.find((i) => i.host === hostname);
    if (reward) {
      setTimeout(() => {
        setRewardToDisplay(reward);
      }, 2000);
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
    const { accounts, signature, chainId } = e.detail;
    console.log("accounts received: ", accounts);
    console.log("signature received: ", signature);
    console.log("chainId received: ", chainId);
    browser.storage.sync.set(
      {
        onChainData: {
          accountAddress: accounts[0],
          signatureValue: signature,
          chainId: chainId,
          timestamp: new Date(),
        },
      },
      // function () {
      //   console.log("Value is set to" + accounts);
      // },
    );
    browser.runtime.sendMessage({
      message: "cardData",
      onChainData: {
        accountAddress: accounts[0],
        signatureValue: signature,
        chainId: chainId,
        timestamp: new Date(),
      },
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

  return (
    <>
      {renderSafeUrlNotification}
      {renderScamWarning}
      {renderComponent}
    </>
  );
};

export default App;
