import usePath from "@app/Content/hooks/usePath";
import { OnboardingProviderInjector } from "@app/Content/utils/OnboardingProviderInjector";
import { ExternalCoreGateway } from "@app/coreGateways";
import { CONTENT_SCRIPT_SUBSTREAM } from "@shared/constants/ports";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import { EPortNames } from "@shared/enums/ports";

import ConnectWalletSuccess from "../Screens/ConnectWalletSuccess";
import NftClaimed from "../Screens/NftClaimed";
import { EAPP_STATE, IRewardItem } from "../../constants";
import Browser from "webextension-polyfill";
import pump from "pump";
import ObjectMultiplex from "obj-multiplex";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import ConfigProvider from "@shared/utils/ConfigProvider";
import { VersionUtils } from "@shared/utils/VersionUtils";
import endOfStream from "end-of-stream";
import { DomainName, URLString } from "@snickerdoodlelabs/objects";
import React, { useEffect, useMemo, useState } from "react";
import ConnectWallet from "../Screens/ConnectWallet";
import ConnectWalletPending from "../Screens/ConnectWalletPending";
import RewardCard from "../Screens/RewardCard";
import { IInvitationDomainWithUUID } from "@shared/interfaces/actions";
import { parse } from "tldts";

let coreGateway: ExternalCoreGateway;
let notificationEmitter;

const connect = () => {
  const port = Browser.runtime.connect({ name: EPortNames.SD_CONTENT_SCRIPT });
  const extensionStream = new PortStream(port);
  const extensionMux = new ObjectMultiplex();
  extensionMux.setMaxListeners(25);
  pump(extensionMux, extensionStream, extensionMux);
  const streamMiddleware = createStreamMiddleware();
  pump(
    streamMiddleware.stream,
    extensionMux.createStream(CONTENT_SCRIPT_SUBSTREAM),
    streamMiddleware.stream,
  );
  const rpcEngine = new JsonRpcEngine();
  rpcEngine.push(streamMiddleware.middleware);

  coreGateway = new ExternalCoreGateway(rpcEngine);
  notificationEmitter = streamMiddleware.events;

  if (
    new URL(ConfigProvider.getConfig().onboardingUrl).origin ===
    window.location.origin
  ) {
    const injector = new OnboardingProviderInjector(extensionMux);
    injector.startPipeline();
  }
  // keep service worker alive
  if (VersionUtils.isManifest3) {
    port.onDisconnect.addListener(connect);
  }
  endOfStream(extensionStream, () => {
    extensionMux.destroy();
  });
};

connect();

const App = () => {
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.INIT);
  const [rewardToDisplay, setRewardToDisplay] = useState<
    IRewardItem | undefined
  >();
  const [invitationDomain, setInvitationDomain] =
    useState<IInvitationDomainWithUUID>();

  const _path = usePath();

  useEffect(() => {
    if (rewardToDisplay) {
      emptyReward();
    }
    initiateCohort();
  }, [_path]);

  useEffect(() => {
    if (appState === EAPP_STATE.CONNECT_WALLET_SUCCESS) {
      setTimeout(() => {
        setAppState(EAPP_STATE.FREE_NFT_CLAIMED);
      }, 1000);
    }
  }, [appState]);

  const initiateCohort = async () => {
    coreGateway
      .isDataWalletAddressInitialized()
      .map((dataWalletAddressInitialized) => {
        if (dataWalletAddressInitialized) {
          const path = window.location.pathname;
          const urlInfo = parse(window.location.href);
          const domain = urlInfo.domain;
          const url = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
          const domainName = DomainName(`snickerdoodle-protocol.${domain}`);
          coreGateway.getInvitationsByDomain(domainName, url).map((result) => {
            if (
              result !== DEFAULT_RPC_SUCCESS_RESULT &&
              typeof result !== "string"
            ) {
              setInvitationDomain(result);
              initiateRewardPopup(result);
            }
          });
        }
      });
  };

  const initiateRewardPopup = (domainDetails: IInvitationDomainWithUUID) => {
    setRewardToDisplay({
      host: domainDetails.domain,
      title: domainDetails.title,
      description: domainDetails.description,
      image: URLString(
        domainDetails.image.replace(
          "ipfs://",
          ConfigProvider.getConfig().ipfsFetchBaseUrl,
        ),
      ),
      primaryButtonText: "Claim Rewards",
      secondaryButtonText: "Reject Rewards",
      rewardName: domainDetails.rewardName,
      nftClaimedImage: URLString(
        domainDetails.nftClaimedImage.replace(
          "ipfs://",
          ConfigProvider.getConfig().ipfsFetchBaseUrl,
        ),
      ),
    });
  };

  const changeAppState = (state: EAPP_STATE) => {
    setAppState(state);
  };

  const emptyReward = () => {
    setRewardToDisplay(undefined);
  };

  const renderComponent = useMemo(() => {
    switch (true) {
      case !rewardToDisplay || appState === EAPP_STATE.DISMISSED:
        return null;
      case appState === EAPP_STATE.INIT:
        return (
          <RewardCard
            emptyReward={emptyReward}
            rewardItem={rewardToDisplay!}
            invitationDomain={invitationDomain}
            coreGateway={coreGateway}
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
            invitationDomain={invitationDomain}
            changeAppState={changeAppState}
            coreGateway={coreGateway}
          />
        );
      default:
        return null;
    }
  }, [rewardToDisplay, appState]);

  return <>{renderComponent}</>;
};

export default App;
