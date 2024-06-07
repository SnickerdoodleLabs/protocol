import { ThemeProvider } from "@material-ui/core/styles";
import {
  BaseNotification,
  CohortJoinedNotification,
  BigNumberString,
  DomainName,
  EInvitationStatus,
  ENotificationTypes,
  EVMContractAddress,
  EWalletDataType,
  IDynamicRewardParameter,
  IPaletteOverrides,
  IUserAgreement,
  Invitation,
  IpfsCID,
  ProxyError,
  Signature,
  TokenId,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  Consent,
  EColorMode,
  ModalContainer,
  createDefaultTheme,
  createThemeWithOverrides,
} from "@snickerdoodlelabs/shared-components";
import { EAppState } from "@synamint-extension-sdk/content/constants";
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
  GetQueryStatusesByContractAddressParams,
  ApproveQueryParams,
  AcceptInvitationParams,
} from "@synamint-extension-sdk/shared";
import { UpdatableEventEmitterWrapper } from "@synamint-extension-sdk/utils";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { err, okAsync, ResultAsync } from "neverthrow";
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
  FC,
} from "react";
import { parse } from "tldts";
import Browser from "webextension-polyfill";

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
  USER_REQUEST,
}

interface IInvitaionData {
  invitation: Invitation;
  metadata: IUserAgreement;
}

interface ICurrentInvitation {
  data: IInvitaionData;
  type: EInvitationSourceType;
}
interface IAppProps {
  paletteOverrides?: IPaletteOverrides;
}

interface IOptInParams {
  directCall: {
    permissions: {
      dataTypes: EWalletDataType[];
      questionnaires: IpfsCID[];
    };
    approvals: Map<IpfsCID, IDynamicRewardParameter[]>;
  };
  withPermissions: Map<
    IpfsCID,
    {
      permissions: {
        dataTypes: EWalletDataType[];
        questionnaires: IpfsCID[];
      };
      rewardParameters: IDynamicRewardParameter[];
    }
  >;
}

const App: FC<IAppProps> = ({ paletteOverrides }) => {
  const [appState, setAppState] = useState<EAppState>(EAppState.IDLE);
  const _path = usePath();
  const [isHidden, setIsHidden] = useState<boolean>(false);

  // #region new flow
  const [deepLinkInvitation, setDeepLinkInvitation] =
    useState<IInvitaionData | null>(null);

  const [domainInvitation, setDomainInvitation] =
    useState<IInvitaionData | null>(null);

  const [userRequestedInvitation, setUserRequestedInvitation] =
    useState<IInvitaionData | null>(null);

  useEffect(() => {
    handleURLChange();
  }, [_path]);

  const currentInvitation: ICurrentInvitation | null = useMemo(() => {
    if (userRequestedInvitation) {
      return {
        data: userRequestedInvitation,
        type: EInvitationSourceType.USER_REQUEST,
      };
    }
    if (domainInvitation) {
      return { data: domainInvitation, type: EInvitationSourceType.DOMAIN };
    }
    if (deepLinkInvitation) {
      return { data: deepLinkInvitation, type: EInvitationSourceType.DEEPLINK };
    }
    return null;
  }, [deepLinkInvitation, domainInvitation, userRequestedInvitation]);

  // #region default -sign up- contract data
  const [acceptedInvitations, setAcceptedInvitations] =
    useState<EVMContractAddress[]>();
  const acceptedInvitationsRef = useRef<EVMContractAddress[]>();

  // we are using default contract info as sign up contract info
  // in consent modal we are showing default contract info if user is not opted in to the default contract
  // if it is null that means there is no default contract exists either user has already opted in
  const [signUpContractInfo, setSignUpContractInfo] = useState<{
    address: EVMContractAddress;
    metadata: IUserAgreement;
  } | null>();

  const isDefaultContractOptedIn = useMemo(() => {
    if (signUpContractInfo === undefined) {
      return undefined;
    }
    if (signUpContractInfo === null) {
      return true;
    }
    return acceptedInvitations?.includes(signUpContractInfo.address);
  }, [acceptedInvitations, signUpContractInfo]);

  const getAcceptedInvitations = () => {
    coreGateway.getAcceptedInvitationsCID().map((res) => {
      const initialAcceptedInvitations = Array.from(res.keys());
      acceptedInvitationsRef.current = initialAcceptedInvitations;
      setAcceptedInvitations(initialAcceptedInvitations);
    });
  };
  const getDefaultContractInfo = () => {
    return coreGateway.getConfig().andThen((config) => {
      const defaultContractAddress = config.defaulConsentContract;
      if (defaultContractAddress) {
        return coreGateway
          .getContractCID(
            new GetConsentContractCIDParams(defaultContractAddress),
          )
          .andThen((cid) => {
            return coreGateway
              .getInvitationMetadataByCID(
                new GetInvitationMetadataByCIDParams(cid),
              )
              .map((metadata) => {
                const info = {
                  address: defaultContractAddress,
                  metadata,
                };
                setSignUpContractInfo(info);
                return info;
              });
          });
      } else {
        setSignUpContractInfo(null);
        return okAsync(null);
      }
    });
  };

  useEffect(() => {
    if (currentInvitation && signUpContractInfo === undefined) {
      getDefaultContractInfo();
    }
  }, [currentInvitation, signUpContractInfo]);

  useEffect(() => {
    eventEmitter.on(PORT_NOTIFICATION, handleNotification);
    getAcceptedInvitations();
    return () => {
      eventEmitter.off(PORT_NOTIFICATION, handleNotification);
    };
  }, []);

  const handleNotification = (notification: BaseNotification) => {
    if (notification.type === ENotificationTypes.COHORT_JOINED) {
      acceptedInvitationsRef.current = [
        (notification as CohortJoinedNotification).data,
        ...(acceptedInvitationsRef.current ?? []),
      ];
      setAcceptedInvitations(acceptedInvitationsRef.current);
    }
  };

  // #endregion

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
      getInvitation(consentAddress, signature, tokenId).map((result) => {
        if (result) {
          setDeepLinkInvitation(result);
        }
      });
    }
    // #endregion
    // #region domain invitation
    coreGateway
      .getInvitationsByDomain(
        new GetInvitationWithDomainParams(domainName, domainPath),
      )
      .andThen((result) => {
        if (result) {
          const {
            invitation: { tokenId, consentContractAddress, businessSignature },
          } = result;
          return coreGateway
            .checkInvitationStatus(
              new CheckInvitationStatusParams(
                consentContractAddress,
                businessSignature ?? undefined,
                tokenId ? BigNumberString(tokenId.toString()) : undefined,
              ),
            )
            .map((status) => {
              if (status === EInvitationStatus.New) {
                setDomainInvitation({
                  invitation: result.invitation,
                  metadata: result.invitationMetadata,
                });
              }
            });
        }
        return okAsync(undefined);
      })
      .mapErr((err) => {});
    // #endregion
  }, []);

  const getInvitation = (
    consentAddress: EVMContractAddress,
    signature: string | null,
    tokenId: string | null,
  ): ResultAsync<
    {
      invitation: Invitation;
      metadata: IUserAgreement;
    } | null,
    ProxyError
  > => {
    const invitation = new Invitation(
      consentAddress,
      tokenId != null ? TokenId(BigInt(tokenId)) : null,
      null,
      signature != null ? Signature(signature) : null,
    );

    return coreGateway
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
                  return {
                    invitation,
                    metadata,
                  };
                });
            });
        }
        return okAsync(null);
      })
      .mapErr((err) => {
        console.warn(" Data Wallet:  Unable to get deeplink invitation", err);
        return err;
      });
  };

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
      case EInvitationSourceType.USER_REQUEST:
        setUserRequestedInvitation(null);
        break;
      case EInvitationSourceType.DEEPLINK:
        setDeepLinkInvitation(null);
        break;
    }
  }, [currentInvitation]);

  const acceptInvitation = useCallback(
    (...args) => {
      if (!currentInvitation) return;
      // call function as background process
      setAppState(EAppState.IDLE);
      coreGateway
        .acceptInvitation(currentInvitation.data.invitation)
        .map(() => {
          emptyReward();
        })
        .mapErr(() => {
          console.warn("Data Wallet:  Unable to accept invitation:", err);
          emptyReward();
        });
      if (isDefaultContractOptedIn === false) {
        optInToSignUpContract();
      }
    },
    [currentInvitation, isDefaultContractOptedIn],
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

  // #region handle user request
  useEffect(() => {
    window.addEventListener("message", catchRequestOptIn);
    return () => {
      window.removeEventListener("message", catchRequestOptIn);
    };
  }, []);

  const catchRequestOptIn = (event: MessageEvent) => {
    if (event?.data?.type === "requestOptIn") {
      handleOptInRequest(event.data.consentContractAddress);
    }
  };

  const handleOptInRequest = (contractAddress?: EVMContractAddress) => {
    if (!contractAddress) {
      return optInToSignUpContract();
    }
    return getInvitation(contractAddress, null, null).map((result) => {
      if (result) {
        setUserRequestedInvitation(result);
      }
    });
  };

  const optInToSignUpContract = useCallback(() => {
    return coreGateway.getConfig().map((config) => {
      if (config.defaulConsentContract) {
        coreGateway.acceptInvitation(
          new Invitation(config.defaulConsentContract, null, null, null),
        );
      }
    });
  }, []);

  // #endregion

  const renderComponent = useMemo(() => {
    if (isDefaultContractOptedIn === undefined) {
      return null;
    }
    if (currentInvitation) {
      switch (appState) {
        case EAppState.AUDIENCE_PREVIEW:
          return (
            <Consent
              open
              onClose={() => {
                emptyReward();
              }}
              onTrustClick={acceptInvitation}
              defaultConsentData={
                isDefaultContractOptedIn
                  ? undefined
                  : signUpContractInfo?.metadata
              }
              consentData={currentInvitation.data.metadata}
              displayRejectButtons={
                currentInvitation.type === EInvitationSourceType.DOMAIN
              }
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }, [appState, currentInvitation, isDefaultContractOptedIn]);

  if (isHidden) {
    return null;
  }

  return (
    <ThemeProvider
      theme={
        paletteOverrides
          ? createThemeWithOverrides(paletteOverrides)
          : createDefaultTheme(EColorMode.LIGHT)
      }
    >
      <>
        {renderComponent && <ModalContainer>{renderComponent}</ModalContainer>}
      </>
    </ThemeProvider>
  );
};

export default App;
