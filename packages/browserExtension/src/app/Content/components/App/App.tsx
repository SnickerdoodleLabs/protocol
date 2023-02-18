import ScamFilterComponent, {
  EScamFilterStatus,
} from "@app/Content/components/ScamFilterComponent";
import ManagePermissions from "@app/Content/components/Screens/ManagePermissions";
import PermissionSelection from "@app/Content/components/Screens/PermissionSelection";
import RewardCard from "@app/Content/components/Screens/RewardCard";
import { EAPP_STATE, IRewardItem } from "@app/Content/constants";
import usePath from "@app/Content/hooks/usePath";
import OnboardingProviderInjectionUtils from "@app/Content/utils/OnboardingProviderInjectionUtils";
import { ExternalCoreGateway } from "@app/coreGateways/index";
import {
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_SUBSTREAM,
} from "@shared/constants/ports";
import { EPortNames } from "@shared/enums/ports";
import { IInvitationDomainWithUUID } from "@shared/interfaces/actions";
import ConfigProvider from "@shared/utils/ConfigProvider";
import { VersionUtils } from "@shared/utils/VersionUtils";
import { DomainName, EWalletDataType, UUID } from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import ObjectMultiplex from "obj-multiplex";
import LocalMessageStream from "post-message-stream";
import pump from "pump";
import React, { useEffect, useMemo, useState } from "react";
import { parse } from "tldts";
import Browser, { urlbar } from "webextension-polyfill";

interface ISafeURLHistory {
  url: string;
}

let coreGateway: ExternalCoreGateway;

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

  if (
    new URL(ConfigProvider.getConfig().onboardingUrl).origin ===
    window.location.origin
  ) {
    const postMessageStream = new LocalMessageStream({
      name: CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
      target: ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
    });
    const pageMux = new ObjectMultiplex();
    pump(pageMux, postMessageStream, pageMux);
    const pageStreamChannel = pageMux.createStream(
      ONBOARDING_PROVIDER_SUBSTREAM,
    );
    const extensionStreamChannel = extensionMux.createStream(
      ONBOARDING_PROVIDER_SUBSTREAM,
    );
    pump(pageStreamChannel, extensionStreamChannel, pageStreamChannel);
    extensionMux.on("finish", () => {
      document.dispatchEvent(
        new CustomEvent("extension-stream-channel-closed"),
      );
      pageMux.destroy();
    });
  }

  if (!coreGateway) {
    coreGateway = new ExternalCoreGateway(rpcEngine);
    if (
      new URL(ConfigProvider.getConfig().onboardingUrl).origin ===
      window.location.origin
    ) {
      OnboardingProviderInjectionUtils.inject();
    }
  } else {
    coreGateway.updateRpcEngine(rpcEngine);
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
  const [scamFilterStatus, setScamFilterStatus] = useState<EScamFilterStatus>();
  const _path = usePath();

  useEffect(() => {
    initiateScamFilterStatus();
  }, []);

  const initiateScamFilterStatus = () => {
    const url = window.location.hostname.replace("www.", "");

    ResultUtils.combine([
      coreGateway.getScamFilterSettings(),
      coreGateway.checkEntity(url as DomainName),
    ]).andThen(([scamSettings, scamStatus]) => {
      if (scamSettings.isScamFilterActive) {
        if (scamSettings.showMessageEveryTime) {
          setScamFilterStatus(scamStatus as EScamFilterStatus);
        } else {
          const arr: ISafeURLHistory[] = [];
          Browser.storage.local.get("safeURLHistory").then((history) => {
            if (history?.safeURLHistory?.length > 0) {
              const isVisited = history.safeURLHistory.find(
                (value) => value.url === url,
              );
              if (!isVisited) {
                setScamFilterStatus(scamStatus as EScamFilterStatus);

                if (scamStatus === EScamFilterStatus.VERIFIED) {
                  Browser.storage.local.set({
                    safeURLHistory: [...history.safeURLHistory, { url }],
                  });
                }
              }
            } else {
              if (scamStatus === EScamFilterStatus.VERIFIED) {
                arr.push({
                  url,
                });
                Browser.storage.local.set({
                  safeURLHistory: arr,
                });
              }
            }
          });
        }
      }

      return okAsync(undefined);
    });
  };

  useEffect(() => {
    if (rewardToDisplay) {
      emptyReward();
    }
    initiateCohort();
  }, [_path]);

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
            if (result) {
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
      image: domainDetails.image,
      primaryButtonText: "Claim Rewards",
      secondaryButtonText: "Reject Rewards",
      rewardName: domainDetails.rewardName,
      nftClaimedImage: domainDetails.nftClaimedImage,
    });
  };

  const changeAppState = (state: EAPP_STATE) => {
    setAppState(state);
  };

  const emptyReward = () => {
    setRewardToDisplay(undefined);
    setAppState(EAPP_STATE.INIT);
  };

  const acceptInvitation = () => {
    coreGateway
      .acceptInvitationByUUID(null, invitationDomain?.id as UUID)
      .map(() => emptyReward());
  };

  const rejectInvitation = () => {
    coreGateway
      .rejectInvitation(invitationDomain?.id as UUID)
      .map(() => emptyReward());
  };

  const acceptInvitationWithDataTypes = (dataTypes: EWalletDataType[]) => {
    coreGateway
      .acceptInvitationByUUID(dataTypes, invitationDomain?.id as UUID)
      .map(() => emptyReward());
  };

  const renderComponent = useMemo(() => {
    switch (true) {
      case !rewardToDisplay || appState === EAPP_STATE.DISMISSED:
        return null;
      case appState === EAPP_STATE.INIT:
        return (
          <RewardCard
            emptyReward={emptyReward}
            acceptInvitation={acceptInvitation}
            changeAppState={changeAppState}
            rejectInvitation={rejectInvitation}
            rewardItem={rewardToDisplay!}
            invitationDomain={invitationDomain}
            coreGateway={coreGateway}
          />
        );
      case appState === EAPP_STATE.PERMISSION_SELECTION:
        return (
          <PermissionSelection
            emptyReward={emptyReward}
            acceptInvitation={acceptInvitation}
            changeAppState={changeAppState}
          />
        );
      case appState === EAPP_STATE.MANAGE_PERMISSIONS:
        return (
          <ManagePermissions
            emptyReward={emptyReward}
            coreGateway={coreGateway}
            onSaveClick={(dataTypes) => {
              acceptInvitationWithDataTypes(dataTypes);
            }}
          />
        );
      default:
        return null;
    }
  }, [rewardToDisplay, appState]);

  return (
    <>
      {scamFilterStatus && (
        <ScamFilterComponent
          scamFilterStatus={scamFilterStatus}
          coreGateway={coreGateway}
        />
      )}
      {renderComponent}
    </>
  );
};

export default App;
