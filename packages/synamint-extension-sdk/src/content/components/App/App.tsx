import {
  AccountAddress,
  BaseNotification,
  DomainName,
  EInvitationStatus,
  ELanguageCode,
  ENotificationTypes,
  EWalletDataType,
  HTMLString,
  LinkedAccount,
  PossibleReward,
  URLString,
  UUID,
} from "@snickerdoodlelabs/objects";
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
import {
  EPortNames,
  IInvitationDomainWithUUID,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_SUBSTREAM,
  GetInvitationWithDomainParams,
  AcceptInvitationByUUIDParams,
  RejectInvitationByUUIDParams,
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
const appID = Browser.runtime.id;

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
        // inject the proxy to any domain
        // there is no blacklist for now
        // we should have soon
        DataWalletProxyInjectionUtils.inject(config.providerKey || "");
      },
    );
  } else {
    coreGateway.updateRpcEngine(rpcEngine);
    eventEmitter.update(streamMiddleware.events);
  }

  // before creating message stream we also need to check the blacklist once we have it
  const postMessageStream = new LocalMessageStream({
    name: `${CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER}${appID}`,
    target: `${ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER}${appID}`,
  });
  const pageMux = new ObjectMultiplex();
  pump(pageMux, postMessageStream, pageMux);
  const pageStreamChannel = pageMux.createStream(ONBOARDING_PROVIDER_SUBSTREAM);
  const extensionStreamChannel = extensionMux.createStream(
    ONBOARDING_PROVIDER_SUBSTREAM,
  );
  pump(pageStreamChannel, extensionStreamChannel, pageStreamChannel);
  extensionMux.on("finish", () => {
    document.dispatchEvent(
      new CustomEvent(`extension-stream-channel-closed${appID}`),
    );
    pageMux.destroy();
  });

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
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const [invitationDomain, setInvitationDomain] =
    useState<IInvitationDomainWithUUID>();
  const [scamFilterStatus, setScamFilterStatus] = useState<EScamFilterStatus>();
  const [subscriptionPreviewData, setSubscriptionPreviewData] = useState<{
    rewardsThatCanBeAcquired: PossibleReward[];
    rewardsThatRequireMorePermission: PossibleReward[];
    dataTypes: EWalletDataType[];
  }>();
  const _path = usePath();
  const isStatusCheckRequiredRef = useRef<boolean>(false);
  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    window.postMessage(
      {
        type: "popupContentUpdated",
        id: appID,
        name: extensionConfig?.providerKey || "",
        hasContent: appState !== EAPP_STATE.INIT,
      },
      "*",
    );
  }, [appState]);

  const handleTabManagerMessage = (event: MessageEvent) => {
    if (event.data.type === "selectedTabUpdated") {
      setIsHidden(!(!event.data.id || event.data.id === appID));
    }
  };

  useEffect(() => {
    window.addEventListener("message", handleTabManagerMessage);
    return () => {
      window.removeEventListener("message", handleTabManagerMessage);
    };
  }, []);

  useEffect(() => {
    initiateScamFilterStatus();
  }, []);

  useEffect(() => {
    eventEmitter.on(PORT_NOTIFICATION, handleNotification);
    getAccounts();
    return () => {
      eventEmitter.off(PORT_NOTIFICATION, handleNotification);
    };
  }, []);

  useEffect(() => {
    checkURLAMAZON();
  }, []);

  const checkURLAMAZON = () => {
    const url = window.location.href;
    console.log(url, "URLLL");
    const html = document.documentElement.outerHTML;

    if (url.includes("order-history") && url.includes("amazon")) {
      console.log("TEST1");
      coreGateway.scraper
        .classifyURL(URLString(url), ELanguageCode.English)
        .andThen((DomainTask) => {
          console.log("DOMAINTASKSKKK", DomainTask);
          return coreGateway.scraper
            .scrape(URLString(url), HTMLString(html), DomainTask)
            .map((result) => console.log("RESULLLTTT", result))
            .mapErr((err) => console.log("iç", err));
        })
        .mapErr((err) => console.log("broooo", err));
    }
    console.log("TEST2");
  };

  const getAccounts = () => {
    coreGateway.getAccounts().map((linkedAccounts) => {
      setAccounts(linkedAccounts);
    });
  };

  const handleNotification = (notification: BaseNotification) => {
    if (notification.type === ENotificationTypes.ACCOUNT_ADDED) {
      getAccounts();
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

  // useEffect(() => {
  //   if (
  //     invitationDomain &&
  //     walletState === EWalletState.UNLOCKED &&
  //     isStatusCheckRequiredRef.current
  //   ) {
  //     coreGateway
  //       .checkInvitationStatus(
  //         new CheckInvitationStatusParams(invitationDomain.consentAddress),
  //       )
  //       .map((result) => {
  //         if (result != EInvitationStatus.New) {
  //           emptyReward();
  //         }
  //         isStatusCheckRequiredRef.current = false;
  //       });
  //   }
  // }, [JSON.stringify(invitationDomain)]);

  const initiateCohort = useCallback(async () => {
    const path = window.location.pathname;
    const urlInfo = parse(window.location.href);
    const domain = urlInfo.domain;
    const url = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
    const domainName = DomainName(`snickerdoodle-protocol.${domain}`);

    coreGateway
      .getInvitationsByDomain(
        new GetInvitationWithDomainParams(domainName, url),
      )
      .andThen((result) => {
        if (result) {
          return coreGateway
            .checkInvitationStatus(
              new CheckInvitationStatusParams(result.consentAddress),
            )
            .map((status) => {
              if (status === EInvitationStatus.New) {
                setInvitationDomain(result);
                setAppState(EAPP_STATE.INVITATION_PREVIEW);
                initiateRewardPopup(result);
              }
            });
        }
        return okAsync(undefined);
      })
      .mapErr((err) => {
        console.error("Unable to get invitation by domain", err);
      });
  }, []);

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
      .rejectInvitationByUUID(
        new RejectInvitationByUUIDParams(invitationDomain?.id as UUID),
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
      case !rewardToDisplay:
        return null;
      case appState === EAPP_STATE.INVITATION_PREVIEW:
        return (
          <RewardCard
            onJoinClick={() => {
              if (accounts.length === 0) {
                const deeplinkURL = new URL(extensionConfig.onboardingUrl);
                deeplinkURL.searchParams.append(
                  "consentAddress",
                  invitationDomain!.consentAddress,
                );
                window.open(deeplinkURL, "blank");
                return emptyReward();
              }
              setAppState(EAPP_STATE.PERMISSION_SELECTION);
            }}
            onCancelClick={() => {
              rejectInvitation();
            }}
            onCloseClick={emptyReward}
            rewardItem={rewardToDisplay!}
            linkedAccountExist={accounts.length > 0}
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
            isUnlocked={true}
            onNextClick={(
              rewardsThatCanBeAcquired: PossibleReward[],
              rewardsThatRequireMorePermission: PossibleReward[],
              dataTypes: EWalletDataType[],
            ) => {
              setSubscriptionPreviewData({
                rewardsThatCanBeAcquired,
                rewardsThatRequireMorePermission,
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
            accounts={accounts}
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
    accounts.length,
    JSON.stringify(rewardToDisplay),
    appState,
    JSON.stringify(subscriptionPreviewData),
  ]);

  if (isHidden) {
    return null;
  }

  return (
    <div>
      {scamFilterStatus && (
        <ScamFilterComponent
          scamFilterStatus={scamFilterStatus}
          coreGateway={coreGateway}
        />
      )}
      {renderComponent}
    </div>
  );
};

export default App;
