import { ThemeProvider } from "@material-ui/core/styles";
import { ObjectUtils } from "@snickerdoodlelabs/common-utils";
import {
  BaseNotification,
  BigNumberString,
  DomainName,
  EChain,
  EInvitationStatus,
  ENotificationTypes,
  EVMAccountAddress,
  EVMContractAddress,
  EWalletDataType,
  IDynamicRewardParameter,
  IOldUserAgreement,
  IPaletteOverrides,
  IUserAgreement,
  Invitation,
  IpfsCID,
  LinkedAccount,
  NewQuestionnaireAnswer,
  PagingRequest,
  ProxyError,
  QueryStatus,
  Questionnaire,
  Signature,
  TokenId,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  ConsentModal,
  EColorMode,
  ModalContainer,
  createDefaultTheme,
  createThemeWithOverrides,
} from "@snickerdoodlelabs/shared-components";
import endOfStream from "end-of-stream";
import PortStream from "extension-port-stream";
import { JsonRpcEngine } from "json-rpc-engine";
import { createStreamMiddleware } from "json-rpc-middleware-stream";
import { err, okAsync } from "neverthrow";
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
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";

import { Subscription } from "rxjs";

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
  metadata: IOldUserAgreement | IUserAgreement;
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
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const _path = usePath();
  const [isHidden, setIsHidden] = useState<boolean>(false);
  const optInRequestSubsriptionRef = useRef<Subscription>();
  const evmAccountsRef = useRef<EVMAccountAddress[] | null>(null);

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

  const evmAccounts = useMemo(() => {
    const filteredAccounts = accounts
      .filter((account) => account.sourceChain === EChain.EthereumMainnet)
      .map((account) => account.sourceAccountAddress);

    if (filteredAccounts.length > 0) {
      evmAccountsRef.current = filteredAccounts as EVMAccountAddress[];
      return filteredAccounts as EVMAccountAddress[];
    } else {
      evmAccountsRef.current = null;
      return null;
    }
  }, [accounts]);

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
                requestLinkAccountIfNeeded();
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

  const requestLinkAccountIfNeeded = () => {
    if (!evmAccountsRef.current) {
      coreGateway.requestLinkAccount();
    }
  };

  const getInvitation = (
    consentAddress: EVMContractAddress,
    signature: string | null,
    tokenId: string | null,
  ): ResultAsync<
    {
      invitation: Invitation;
      metadata: IOldUserAgreement | IUserAgreement;
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
                  requestLinkAccountIfNeeded();
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

  const currentInvitation: ICurrentInvitation | null = useMemo(() => {
    if (!evmAccounts) return null;
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
  }, [
    deepLinkInvitation,
    domainInvitation,
    userRequestedInvitation,
    evmAccounts,
  ]);

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

  const handleNotification = (notification: BaseNotification) => {
    if (notification.type === ENotificationTypes.ACCOUNT_ADDED) {
      getAccounts();
    }
  };

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
      return coreGateway.getConfig().map((config) => {
        if (config.defaulConsentContract) {
          coreGateway.acceptInvitation(
            new Invitation(config.defaulConsentContract, null, null, null),
          );
        }
      });
    }
    return getInvitation(contractAddress, null, null).map((result) => {
      if (result) {
        setUserRequestedInvitation(result);
      }
    });
  };

  // #endregion

  const getAccounts = () => {
    coreGateway.account.getAccounts().map((linkedAccounts) => {
      setAccounts(linkedAccounts);
    });
  };

  const optIn = useCallback(
    (params: IOptInParams) => {
      if (currentInvitation) {
        // call function as background process
        setAppState(EAppState.IDLE);
        const {
          directCall: { permissions, approvals },
          withPermissions,
        } = params;
        coreGateway
          .acceptInvitation(currentInvitation.data.invitation)
          .andThen(() => {
            return ResultUtils.combine(
              Array.from(approvals.entries()).map(([cid, rewardParams]) =>
                coreGateway.approveQuery(
                  new ApproveQueryParams(cid, rewardParams, null),
                ),
              ),
            );
          })
          .andThen(() => {
            return ResultUtils.combine(
              Array.from(withPermissions.entries()).map(
                ([cid, { rewardParameters, permissions }]) => {
                  return coreGateway.approveQuery(
                    new ApproveQueryParams(cid, rewardParameters, {
                      virtualQuestionnaires: permissions.dataTypes,
                      questionnaires: permissions.questionnaires,
                    }),
                  );
                },
              ),
            );
          })
          .map(() => {
            emptyReward();
            console.log("optIn steps success");
          })
          .mapErr((e) => {
            console.log("optIn steps error", e);
            emptyReward();
          });
      }
    },
    [currentInvitation],
  );

  const renderComponent = useMemo(() => {
    if (currentInvitation) {
      switch (appState) {
        case EAppState.AUDIENCE_PREVIEW:
          return (
            <ConsentModal
              key={currentInvitation.data.invitation.consentContractAddress}
              onClose={() => {
                emptyReward();
              }}
              open={true}
              onOptinClicked={optIn}
              consentContractAddress={
                currentInvitation.data.invitation.consentContractAddress
              }
              invitationData={currentInvitation.data.metadata}
              answerQuestionnaire={(
                id: IpfsCID,
                answers: NewQuestionnaireAnswer[],
              ) => coreGateway.questionnaire.answerQuestionnaire(id, answers)}
              onRejectClick={() => {
                rejectInvitation(false);
              }}
              onRejectWithTimestampClick={() => {
                rejectInvitation(true);
              }}
              displayRejectButtons={
                currentInvitation.type === EInvitationSourceType.DOMAIN
              }
              getQueryStatuses={(contractAddress: EVMContractAddress) => {
                return coreGateway.getQueryStatusesByContractAddress(
                  new GetQueryStatusesByContractAddressParams(contractAddress),
                );
              }}
              evmAccounts={evmAccounts!}
              getQuestionnairesByCids={function (
                cids: IpfsCID[],
              ): ResultAsync<Questionnaire[], unknown> {
                return coreGateway.questionnaire.getByCIDs(cids);
              }}
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }, [evmAccounts, appState, currentInvitation]);

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
