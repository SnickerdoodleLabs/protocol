import { ThemeProvider } from "@material-ui/core";
import {
  BaseNotification,
  BigNumberString,
  DomainName,
  EInvitationStatus,
  ELanguageCode,
  ENotificationTypes,
  EVMContractAddress,
  EWalletDataType,
  HTMLString,
  LinkedAccount,
  PageNo,
  PossibleReward,
  URLString,
  UUID,
  Year,
  IOldUserAgreement,
  IUserAgreement,
  Invitation,
  Signature,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  DescriptionWidget,
  EColorMode,
  FF_SUPPORTED_ALL_PERMISSIONS,
  ModalContainer,
  PermissionSelectionWidget,
  createDefaultTheme,
} from "@snickerdoodlelabs/shared-components";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { ResultAsync, err, errAsync, ok, okAsync } from "neverthrow";
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
  ShoppingDataDone,
  ShoppingDataINIT,
  ShoppingDataProcess,
} from "@synamint-extension-sdk/content/components/Screens";
import {
  EAppState,
  EShoppingDataState,
} from "@synamint-extension-sdk/content/constants";
import usePath from "@synamint-extension-sdk/content/hooks/usePath";
import DataWalletProxyInjectionUtils from "@synamint-extension-sdk/content/utils/DataWalletProxyInjectionUtils";
import { VersionUtils } from "@synamint-extension-sdk/extensionShared";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import {
  EPortNames,
  CONTENT_SCRIPT_POSTMESSAGE_CHANNEL_IDENTIFIER,
  CONTENT_SCRIPT_SUBSTREAM,
  ONBOARDING_PROVIDER_POSTMESSAGE_CHANNEL_IDENTIFIER,
  ONBOARDING_PROVIDER_SUBSTREAM,
  GetInvitationWithDomainParams,
  IExtensionConfig,
  PORT_NOTIFICATION,
  CheckInvitationStatusParams,
  GetInvitationMetadataByCIDParams,
  GetConsentContractCIDParams,
} from "@synamint-extension-sdk/shared";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";

// #region connection
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

// #endregion

enum EInvitationSourceType {
  DEEPLINK,
  DOMAIN,
}

interface IInvitaionData {
  invitation: Invitation;
  metadata: IOldUserAgreement | IUserAgreement;
}

interface ICurrentInvitation {
  data: IInvitaionData;
  type: EInvitationSourceType;
}

// this is really bad way to do this
// for now only place user can link an account is one of the origins below
// if user is directed to one of the origin below just because does not have an acount we should wait for user to link an account to display popup
const SDL_ORIGIN_LIST = [
  "https://datawallet.demo-01.snickerdoodle.dev",
  "https://datawallet.demo-02.snickerdoodle.dev",
  "https://datawallet.demo-03.snickerdoodle.dev",
  "https://datawallet.demo-04.snickerdoodle.dev",
  "https://datawallet.demo-05.snickerdoodle.dev",
  "https://datawallet.snickerdoodle.com",
  "https://datawallet.dev.snickerdoodle.dev",
  // those are even worse
  "https://localhost:9005",
  "http://localhost:9001",
];

const origin = window.location.origin;

const awaitAccountLinking = SDL_ORIGIN_LIST.includes(origin);

const App = () => {
  const [appState, setAppState] = useState<EAppState>(EAppState.IDLE);
  const [shoppingDataState, setShoppingDataState] =
    useState<EShoppingDataState>(EShoppingDataState.SHOPPINGDATA_IDLE);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const _path = usePath();
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const [shoppingDataScrapeStart, setShoppingDataScrapeStart] =
    useState<boolean>(false);

  // #region new flow
  const [deepLinkInvitation, setDeepLinkInvitation] =
    useState<IInvitaionData | null>(null);

  const [domainInvitation, setDomainInvitation] =
    useState<IInvitaionData | null>(null);

  useEffect(() => {
    handleURLChange();
  }, [_path]);

  const handleURLChange = useCallback(() => {
    const url = window.location.href;
    const urlObj = new URL(url);
    const queryParams = new URLSearchParams(urlObj.search);
    const path = urlObj.pathname;
    const urlInfo = parse(url);
    const domain = urlInfo.domain;
    const domainPath = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
    const domainName = DomainName(`snickerdoodle-protocol.${domain}`);
    const _consentAddress = queryParams.get("consentAddress");

    // #region deeplink invitation

    // not sure about this part, this logic cause any domain can display any invitation
    // we can make it show deep link popups only if the current domain is our domain
    if (_consentAddress) {
      // when queryID added to domain update here
      const consentAddress = EVMContractAddress(_consentAddress);
      const tokenId = queryParams.get("tokenId");
      const signature = queryParams.get("signature");
      // this function actually designed for proxy initialy
      // since we are not using it in proxy we can change
      // double check requirements for proxy
      coreGateway
        .checkInvitationStatus(
          new CheckInvitationStatusParams(
            consentAddress,
            signature ? Signature(signature) : undefined,
            tokenId ? BigNumberString(tokenId) : undefined,
          ),
        )
        .andThen((status) => {
          if (status === EInvitationStatus.New) {
            return coreGateway
              .getContractCID(new GetConsentContractCIDParams(consentAddress))
              .andThen((cid) => {
                return coreGateway
                  .getInvitationMetadataByCID(
                    new GetInvitationMetadataByCIDParams(cid),
                  )
                  .map((metadata) => {
                    setDeepLinkInvitation({
                      invitation: new Invitation(
                        consentAddress,
                        null,
                        null,
                        null,
                      ),
                      metadata,
                    });
                  });
              });
          }
          return okAsync(undefined);
        })
        .mapErr((err) => {
          console.warn(" Data Wallet:  Unable to get deeplink invitation", err);
        });
    }
    // #endregion
    // #region domain invitation
    coreGateway
      .getInvitationsByDomain(
        new GetInvitationWithDomainParams(domainName, domainPath),
      )
      .map((result) => {
        if (result) {
          setDomainInvitation({
            invitation: result.invitation,
            metadata: result.invitationMetadata,
          });
        }
      })
      .mapErr((err) => {
        console.warn(" Data Wallet:  Unable to get invitation by domain", err);
      });
    // #endregion
  }, []);

  const currentInvitation: ICurrentInvitation | null = useMemo(() => {
    if (domainInvitation) {
      return { data: domainInvitation, type: EInvitationSourceType.DOMAIN };
    }
    if (deepLinkInvitation) {
      return { data: deepLinkInvitation, type: EInvitationSourceType.DEEPLINK };
    }
    return null;
  }, [deepLinkInvitation, domainInvitation]);

  useEffect(() => {
    if (currentInvitation) {
      setAppState(EAppState.AUDIENCE_PREVIEW);
    } else {
      setAppState(EAppState.IDLE);
    }
  }, [currentInvitation]);

  const emptyReward = useCallback(() => {
    if (!currentInvitation) return;
    switch (currentInvitation.type) {
      case EInvitationSourceType.DOMAIN:
        setDomainInvitation(null);
        break;
      case EInvitationSourceType.DEEPLINK:
        setDeepLinkInvitation(null);
        break;
    }
  }, [currentInvitation]);

  const acceptInvitation = useCallback(
    (dataTypes: EWalletDataType[] | null) => {
      if (!currentInvitation) return;
      // call function as background process
      setAppState(EAppState.IDLE);
      coreGateway
        .acceptInvitation(currentInvitation.data.invitation, dataTypes)
        .map(() => {
          emptyReward();
        })
        .mapErr(() => {
          console.warn("Data Wallet:  Unable to accept invitation:", err);
          emptyReward();
        });
    },
    [currentInvitation],
  );

  const rejectInvitation = useCallback(
    (withTimestamp: boolean) => {
      if (!currentInvitation) return;
      // reject until 36 hours from the current time.
      const rejectUntil = withTimestamp
        ? UnixTimestamp(
            Math.floor(
              new Date(Date.now() + 36 * 60 * 60 * 1000).getTime() / 1000,
            ),
          )
        : undefined;
      coreGateway
        .rejectInvitation(currentInvitation.data.invitation, rejectUntil)
        .map(() => {
          emptyReward();
        })
        .mapErr(() => {
          emptyReward();
          console.warn(" Data Wallet:  Unable to reject invitation:", err);
        });
    },
    [currentInvitation],
  );

  // #endregion

  // #region multiple instance handler messaging

  useEffect(() => {
    window.postMessage(
      {
        type: "popupContentUpdated",
        id: appID,
        name: extensionConfig?.providerKey || "",
        hasContent: appState !== EAppState.IDLE,
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
  // #endregion

  // #region port notification handler
  useEffect(() => {
    eventEmitter.on(PORT_NOTIFICATION, handleNotification);
    getAccounts();
    return () => {
      eventEmitter.off(PORT_NOTIFICATION, handleNotification);
    };
  }, []);

  const getAmazonURLS = () => {
    const html = document.documentElement.outerHTML;
    let openWindowCount = 0;
    return coreGateway.scraperNavigation
      .getYears(HTMLString(html))
      .map((years) => {
        for (const year of years) {
          for (let i = 1; i <= 5; i++) {
            coreGateway.scraperNavigation
              .getOrderHistoryPageByYear(ELanguageCode.English, year, PageNo(i))
              .map(async (url) => {
                const width = 100;
                const height = 100;

                const left = (window.screen.width - width) / 2;
                const top = (window.screen.height - height) / 2;

                const windowFeatures =
                  "width=" +
                  width +
                  ",height=" +
                  height +
                  ",left=" +
                  left +
                  ",top=" +
                  top;
                const newWindow = window.open(url, "_blank", windowFeatures);
                if (newWindow) {
                  openWindowCount++;
                  await new Promise((resolve) => {
                    newWindow.onload = resolve;
                  });

                  const windowHTML =
                    newWindow.document.documentElement.outerHTML;

                  console.log("windowhtml", windowHTML);
                  coreGateway.scraper
                    .classifyURL(URLString(url), ELanguageCode.English)
                    .andThen((DomainTask) => {
                      console.log("DOMAINTASKSKKK", DomainTask);
                      return coreGateway.scraper
                        .scrape(
                          URLString(url),
                          HTMLString(windowHTML),
                          DomainTask,
                        )
                        .map((result) => console.log(result))
                        .mapErr((err) => console.log("iç", err));
                    });

                  newWindow.close();
                  openWindowCount--;
                  if (openWindowCount === 0) {
                    setShoppingDataState(
                      EShoppingDataState.SHOPPINGDATA_SCRAPE_DONE,
                    );
                  }
                }
              });
          }
        }
      });
  };

  useEffect(() => {
    checkURLAMAZON();
  }, [shoppingDataScrapeStart]);

  const checkURLAMAZON = () => {
    const url = window.location.href;
    console.log(url, "URLLL");

    if (url.includes("ShoppingDataSDL") && url.includes("amazon")) {
      setShoppingDataState(EShoppingDataState.SHOPPINGDATA_INIT);
      if (shoppingDataScrapeStart) {
        setShoppingDataState(EShoppingDataState.SHOPPINGDATA_SCRAPE_PROCESS);
        console.log("TEST1");
        getAmazonURLS();
      }
      console.log("TEST2");
    }
  };

  const exitScraper = () => {
    setShoppingDataState(EShoppingDataState.SHOPPINGDATA_INIT);
  };

  const getAccounts = () => {
    coreGateway.account.getAccounts().map((linkedAccounts) => {
      setAccounts(linkedAccounts);
    });
  };

  const handleNotification = (notification: BaseNotification) => {
    if (notification.type === ENotificationTypes.ACCOUNT_ADDED) {
      getAccounts();
    }
  };

  // #endregion

  const renderShoppingDataComponent = useMemo(() => {
    switch (true) {
      case shoppingDataState === EShoppingDataState.SHOPPINGDATA_INIT:
        return (
          <ShoppingDataINIT
            setShoppingDataScrapeStart={setShoppingDataScrapeStart}
          />
        );
      case shoppingDataState === EShoppingDataState.SHOPPINGDATA_SCRAPE_PROCESS:
        return <ShoppingDataProcess onCloseClick={exitScraper} />;
      case shoppingDataState === EShoppingDataState.SHOPPINGDATA_SCRAPE_DONE:
        return <ShoppingDataDone coreGateway={coreGateway} />;
      default:
        return null;
    }
  }, [shoppingDataState]);

  const renderComponent = useMemo(() => {
    if (!currentInvitation) return null;
    // delay showing popup until user link an account
    if (awaitAccountLinking && accounts.length === 0) return null;
    switch (true) {
      case appState === EAppState.AUDIENCE_PREVIEW:
        return (
          <DescriptionWidget
            invitationData={currentInvitation.data.metadata}
            redirectRequired={!(accounts.length > 0)}
            onRejectClick={() => {
              rejectInvitation(false);
            }}
            onRejectWithTimestampClick={() => {
              rejectInvitation(true);
            }}
            primaryButtonText={
              accounts.length > 0 ? "Continue" : "Connect and Continue"
            }
            onContinueClick={() => {
              if (accounts.length > 0) {
                acceptInvitation(FF_SUPPORTED_ALL_PERMISSIONS);
              } else {
                window.open(
                  `${extensionConfig.onboardingUrl}?consentAddress=${currentInvitation.data.invitation.consentContractAddress}`,
                  "_blank",
                );
              }
            }}
            onCancelClick={emptyReward}
            onSetPermissions={() => {
              setAppState(EAppState.PERMISSION_SELECTION);
            }}
          />
        );
      case appState === EAppState.PERMISSION_SELECTION:
        return (
          <PermissionSelectionWidget
            onCancelClick={emptyReward}
            onSaveClick={acceptInvitation}
          />
        );
      default:
        return null;
    }
  }, [accounts.length, appState, currentInvitation]);

  if (isHidden) {
    return null;
  }

  return (
    <ThemeProvider theme={createDefaultTheme(EColorMode.LIGHT)}>
      <>
        {renderComponent && <ModalContainer>{renderComponent}</ModalContainer>}
        {renderShoppingDataComponent && (
          <ModalContainer>{renderShoppingDataComponent}</ModalContainer>
        )}
      </>
    </ThemeProvider>
  );
};

export default App;
