import RewardCard from "@app/Content/components/Screens/RewardCard";
import { OnboardingProviderInjector } from "@app/Content/utils/OnboardingProviderInjector";
import { ExternalCoreGateway } from "@app/coreGateways";
import { CONTENT_SCRIPT_SUBSTREAM } from "@shared/constants/ports";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import { EPortNames } from "@shared/enums/ports";
import ConfigProvider from "@shared/utils/ConfigProvider";
import { VersionUtils } from "@shared/utils/VersionUtils";
import {
  DomainName,
  InvitationDomain,
  UUID,
  URLString,
} from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import ObjectMultiplex from "obj-multiplex";
import pump from "pump";
import React, { useEffect, useMemo, useState } from "react";
import Browser from "webextension-polyfill";

import { EAPP_STATE, IRewardItem } from "../../constants";

let coreGateway;
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

export interface IInvitationDomainWithUUID {
  domain: DomainName;
  title: string;
  description: string;
  image: URLString;
  rewardName: string;
  nftClaimedImage: URLString;
  id: UUID;
}

const App = () => {
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.INIT);
  const [rewardToDisplay, setRewardToDisplay] = useState<IRewardItem>();
  const [invitationDomain, setInvitationDomain] =
    useState<IInvitationDomainWithUUID>();

  useEffect(() => {
    initiateCohort();
  }, []);

  const initiateCohort = async () => {
    coreGateway
      .isDataWalletAddressInitialized()
      .andThen((dataWalletAddressInitialized) => {
        if (dataWalletAddressInitialized) {
          const host = window.location.hostname;
          let domainName;
          if (host.startsWith("www.")) {
            domainName = DomainName(
              host.replace("www.", "snickerdoodle-protocol."),
            );
          } else {
            domainName = DomainName(`snickerdoodle-protocol.${host}`);
          }

          coreGateway.getInvitationsByDomain(domainName).map((result) => {
            if (result !== DEFAULT_RPC_SUCCESS_RESULT) {
              setInvitationDomain(result);
              initiateRewardPopup(result);
            }
          });
        }
      });
  };

  const initiateRewardPopup = (domainDetails: InvitationDomain) => {
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

  const renderComponent = useMemo(() => {
    switch (true) {
      case !rewardToDisplay ||
        appState === EAPP_STATE.DISMISSED ||
        appState === EAPP_STATE.COMPLETED:
        return null;
      case appState === EAPP_STATE.INIT && !!rewardToDisplay:
        return (
          <RewardCard
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
