import ScamFilterComponent, {
  EScamFilterStatus,
} from "@app/Content/components/ScamFilterComponent";
import ManagePermissions from "@app/Content/components/Screens/ManagePermissions";
import PermissionSelection from "@app/Content/components/Screens/PermissionSelection";
import RewardCard from "@app/Content/components/Screens/RewardCard";
import { EAPP_STATE, IRewardItem } from "@app/Content/constants";
import usePath from "@app/Content/hooks/usePath";
import { OnboardingProviderInjector } from "@app/Content/utils/OnboardingProviderInjector";
import { ExternalCoreGateway } from "@app/coreGateways/index";
import { CONTENT_SCRIPT_SUBSTREAM } from "@shared/constants/ports";
import { DEFAULT_RPC_SUCCESS_RESULT } from "@shared/constants/rpcCall";
import { EPortNames } from "@shared/enums/ports";
import { IInvitationDomainWithUUID } from "@shared/interfaces/actions";
import ConfigProvider from "@shared/utils/ConfigProvider";
import { VersionUtils } from "@shared/utils/VersionUtils";
import { DomainName, EWalletDataType, UUID } from "@snickerdoodlelabs/objects";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import ObjectMultiplex from "obj-multiplex";
import pump from "pump";
import React, { useEffect, useMemo, useState } from "react";
import { parse } from "tldts";
import Browser from "webextension-polyfill";

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

  const [scamFilterStatus, setScamFilterStatus] = useState<EScamFilterStatus>();
  const _path = usePath();

  useEffect(() => {
    initiateScamFilterStatus();
  }, []);
  const initiateScamFilterStatus = () => {
    coreGateway
      .checkURL(window.location.hostname.replace("www.", "") as DomainName)
      .map((result) => {
        setScamFilterStatus(result as EScamFilterStatus);
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
      .acceptInvitation(null, invitationDomain?.id as UUID)
      .map(() => emptyReward());
  };

  const rejectInvitation = () => {
    coreGateway
      .rejectInvitation(invitationDomain?.id as UUID)
      .map(() => emptyReward());
  };

  const acceptInvitationWithDataTypes = (dataTypes: EWalletDataType[]) => {
    coreGateway
      .acceptInvitation(dataTypes, invitationDomain?.id as UUID)
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
        <ScamFilterComponent scamFilterStatus={scamFilterStatus} />
      )}
      {renderComponent}
    </>
  );
};

export default App;
