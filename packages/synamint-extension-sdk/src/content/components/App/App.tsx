import {
  AccountAddress,
  DomainName,
  EInvitationStatus,
  ENotificationTypes,
  EWalletDataType,
  PossibleReward,
  TNotification,
  UUID,
} from "@snickerdoodlelabs/objects";
import ScamFilterComponent, {
  EScamFilterStatus,
} from "@synamint-extension-sdk/content/components/ScamFilterComponent";
import Loading from "@synamint-extension-sdk/content/components/Screens/Loading";
import Permissions from "@synamint-extension-sdk/content/components/Screens/Permissions";
import RewardCard from "@synamint-extension-sdk/content/components/Screens/RewardCard";
import SubscriptionConfirmation from "@synamint-extension-sdk/content/components/Screens/SubscriptionConfirmation";
import SubscriptionSuccess from "@synamint-extension-sdk/content/components/Screens/SubscriptionSuccess";
import {
  EAPP_STATE,
  IRewardItem,
} from "@synamint-extension-sdk/content/constants";
import usePath from "@synamint-extension-sdk/content/hooks/usePath";
import DataWalletProxyInjectionUtils from "@synamint-extension-sdk/content/utils/DataWalletProxyInjectionUtils";
import { VersionUtils } from "@synamint-extension-sdk/extensionShared";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import ObjectMultiplex from "obj-multiplex";
import LocalMessageStream from "post-message-stream";
import pump from "pump";
import React, {
  useEffect,
  useMemo,
  useState,
  useCallback,
  useRef,
} from "react";
import { parse } from "tldts";
import Browser from "webextension-polyfill";

import {
  EPortNames,
  IInvitationDomainWithUUID,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_SUBSTREAM,
  GetInvitationWithDomainParams,
  AcceptInvitationByUUIDParams,
  RejectInvitationParams,
  CheckURLParams,
  SetReceivingAddressParams,
  IExtensionConfig,
  PORT_NOTIFICATION,
  CheckInvitationStatusParams,
} from "@synamint-extension-sdk/shared";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";

enum EWalletState {
  UNKNOWN,
  UNLOCKED,
  LOCKED,
}

interface ISafeURLHistory {
  url: string;
}

let coreGateway: ExternalCoreGateway;
let extensionConfig: IExtensionConfig;
let eventEmitter: UpdatableEventEmitterWrapper;

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

  if (!coreGateway) {
    coreGateway = new ExternalCoreGateway(rpcEngine);
    eventEmitter = new UpdatableEventEmitterWrapper(
      streamMiddleware.events,
      PORT_NOTIFICATION,
    );
    (extensionConfig ? okAsync(extensionConfig) : coreGateway.getConfig()).map(
      (config) => {
        if (!extensionConfig) {
          extensionConfig = config;
        }
        if (new URL(config.onboardingUrl).origin === window.location.origin) {
          DataWalletProxyInjectionUtils.inject();
        }
      },
    );
  } else {
    coreGateway.updateRpcEngine(rpcEngine);
    eventEmitter.update(streamMiddleware.events);
  }

  (extensionConfig ? okAsync(extensionConfig) : coreGateway.getConfig()).map(
    (config) => {
      if (!extensionConfig) {
        extensionConfig = config;
      }
      if (new URL(config.onboardingUrl).origin === window.location.origin) {
        {
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
      }
    },
  );
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
  const [walletState, setWalletState] = useState<EWalletState>(
    EWalletState.UNKNOWN,
  );
  const [invitationDomain, setInvitationDomain] =
    useState<IInvitationDomainWithUUID>();
  const [scamFilterStatus, setScamFilterStatus] = useState<EScamFilterStatus>();
  const [subscriptionPreviewData, setSubscriptionPreviewData] = useState<{
    eligibleRewards: PossibleReward[];
    missingRewards: PossibleReward[];
    dataTypes: EWalletDataType[];
  }>();
  const _path = usePath();

  const isStatusCheckRequiredRef = useRef<boolean>(false);

  useEffect(() => {
    initiateScamFilterStatus();
  }, []);

  useEffect(() => {
    if (walletState === EWalletState.LOCKED) {
      eventEmitter.on(PORT_NOTIFICATION, handleNotification);
    }
    return () => {
      eventEmitter.off(PORT_NOTIFICATION, handleNotification);
    };
  }, [walletState]);

  const handleNotification = (notification: TNotification) => {
    if (notification.type === ENotificationTypes.ACCOUNT_INITIALIZED) {
      setWalletState(EWalletState.UNLOCKED);
    }
  };

  const initiateScamFilterStatus = () => {
    const url = window.location.hostname.replace("www.", "");

    ResultUtils.combine([
      coreGateway.getScamFilterSettings(),
      coreGateway.checkURL(new CheckURLParams(url as DomainName)),
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

  useEffect(() => {
    if (
      invitationDomain &&
      walletState === EWalletState.UNLOCKED &&
      isStatusCheckRequiredRef.current
    ) {
      coreGateway
        .checkInvitationStatus(
          new CheckInvitationStatusParams(invitationDomain.consentAddress),
        )
        .map((result) => {
          if (result != EInvitationStatus.New) {
            emptyReward();
          }
          isStatusCheckRequiredRef.current = false;
        });
    }
  }, [JSON.stringify(invitationDomain), walletState]);

  const initiateCohort = useCallback(async () => {
    (walletState === EWalletState.UNKNOWN
      ? coreGateway.isDataWalletAddressInitialized()
      : okAsync(walletState === EWalletState.UNLOCKED)
    ).map((isInitialized) => {
      setWalletState(
        isInitialized ? EWalletState.UNLOCKED : EWalletState.LOCKED,
      );
      const path = window.location.pathname;
      const urlInfo = parse(window.location.href);
      const domain = urlInfo.domain;
      const url = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
      const domainName = DomainName(`snickerdoodle-protocol.${domain}`);
      coreGateway
        .getInvitationsByDomain(
          new GetInvitationWithDomainParams(domainName, url),
        )
        .map((result) => {
          if (result) {
            (isInitialized
              ? coreGateway.checkInvitationStatus(
                  new CheckInvitationStatusParams(result.consentAddress),
                )
              : okAsync(EInvitationStatus.New)
            ).map((status) => {
              if (status === EInvitationStatus.New) {
                setInvitationDomain(result);
                initiateRewardPopup(result);
                if (!isInitialized) {
                  isStatusCheckRequiredRef.current = true;
                }
              }
            });
          }
        });
    });
  }, [walletState]);

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

  const emptyReward = () => {
    setSubscriptionPreviewData(undefined);
    setRewardToDisplay(undefined);
    setAppState(EAPP_STATE.INIT);
  };

  const rejectInvitation = () => {
    coreGateway
      .rejectInvitation(
        new RejectInvitationParams(invitationDomain?.id as UUID),
      )
      .map(() => emptyReward());
  };

  const acceptInvitation = (receivingAccount: AccountAddress | undefined) => {
    setAppState(EAPP_STATE.LOADING);
    coreGateway
      .setReceivingAddress(
        new SetReceivingAddressParams(
          invitationDomain!.consentAddress,
          receivingAccount ?? null,
        ),
      )
      .map(() => {
        coreGateway
          .acceptInvitationByUUID(
            new AcceptInvitationByUUIDParams(
              subscriptionPreviewData!.dataTypes,
              invitationDomain?.id as UUID,
            ),
          )
          .map(() => {
            setAppState(EAPP_STATE.SUBSCRIPTION_SUCCESS);
          });
      })
      .mapErr(() => {
        emptyReward();
      });
  };

  const renderComponent = useMemo(() => {
    switch (true) {
      case !rewardToDisplay || walletState === EWalletState.UNKNOWN:
        return null;
      case appState === EAPP_STATE.INIT:
        return (
          <RewardCard
            onJoinClick={() => {
              setAppState(EAPP_STATE.PERMISSION_SELECTION);
            }}
            onCancelClick={rejectInvitation}
            onCloseClick={emptyReward}
            rewardItem={rewardToDisplay!}
          />
        );
      case appState === EAPP_STATE.PERMISSION_SELECTION:
        return (
          <Permissions
            config={extensionConfig}
            domainDetails={invitationDomain!}
            onCancelClick={emptyReward}
            coreGateway={coreGateway}
            eventEmitter={eventEmitter}
            isUnlocked={walletState === EWalletState.UNLOCKED}
            onNextClick={(
              eligibleRewards: PossibleReward[],
              missingRewards: PossibleReward[],
              dataTypes: EWalletDataType[],
            ) => {
              setSubscriptionPreviewData({
                eligibleRewards,
                missingRewards,
                dataTypes,
              });
              setAppState(EAPP_STATE.SUBSCRIPTION_CONFIRMATION);
            }}
          />
        );
      case subscriptionPreviewData &&
        appState === EAPP_STATE.SUBSCRIPTION_CONFIRMATION:
        return (
          <SubscriptionConfirmation
            {...subscriptionPreviewData!}
            config={extensionConfig}
            coreGateway={coreGateway}
            domainDetails={invitationDomain!}
            onCancelClick={emptyReward}
            onConfirmClick={(receivingAccount) => {
              acceptInvitation(receivingAccount);
            }}
          />
        );
      case appState === EAPP_STATE.SUBSCRIPTION_SUCCESS:
        return (
          <SubscriptionSuccess
            domainDetails={invitationDomain!}
            onCancelClick={emptyReward}
          />
        );
      case appState === EAPP_STATE.LOADING:
        return <Loading />;
      default:
        return null;
    }
  }, [
    walletState,
    JSON.stringify(rewardToDisplay),
    appState,
    JSON.stringify(subscriptionPreviewData),
  ]);

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
