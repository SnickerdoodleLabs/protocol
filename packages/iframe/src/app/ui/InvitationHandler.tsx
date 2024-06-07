import {
  IFrameConfig,
  IFrameControlConfig,
} from "@core-iframe/interfaces/objects";
import {
  EInvitationSourceType,
  IFrameEvents,
  IInvitationDisplayRequest,
} from "@core-iframe/interfaces/objects/IFrameEvents";
import { Theme, ThemeProvider } from "@material-ui/core/styles";
import {
  EChain,
  EVMAccountAddress,
  EVMContractAddress,
  EWalletDataType,
  IDynamicRewardParameter,
  ISnickerdoodleCore,
  IUserAgreement,
  Invitation,
  IpfsCID,
  LinkedAccount,
  NewQuestionnaireAnswer,
  QueryStatus,
  Questionnaire,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  EColorMode,
  createDefaultTheme,
  createThemeWithOverrides,
} from "@snickerdoodlelabs/shared-components";
import { ResultAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import { ChildAPI } from "postmate";
import React, {
  useMemo,
  useState,
  useEffect,
  FC,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { Subscription } from "rxjs";

const LazyModalContainer = lazy(() =>
  import("@snickerdoodlelabs/shared-components").then((module) => ({
    default: module.ModalContainer,
  })),
);

const LazyConsentModal = lazy(() =>
  import("@snickerdoodlelabs/shared-components").then((module) => ({
    default: module.ConsentModal,
  })),
);

interface IInvitationHandlerProps {
  core: ISnickerdoodleCore;
  hide: () => void;
  show: () => void;
  events: IFrameEvents;
  config: IFrameControlConfig;
  coreConfig: IFrameConfig;
  awaitRender: boolean;
  requestLinkAccount: () => void;
}

export enum EAPP_STATE {
  IDLE,
  INVITATION_PREVIEW,
}

interface IInvitation {
  invitation: Invitation;
  metadata: IUserAgreement;
}

interface ICurrentInvitation {
  data: IInvitation;
  type: EInvitationSourceType;
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

export const InvitationHandler: FC<IInvitationHandlerProps> = ({
  core,
  hide,
  show,
  events,
  config,
  awaitRender,
  requestLinkAccount,
  coreConfig,
}) => {
  const [theme, setTheme] = useState<Theme>(
    config.palette
      ? createThemeWithOverrides(config.palette)
      : createDefaultTheme(EColorMode.LIGHT),
  );
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.IDLE);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const accountAddedSubscription = useRef<Subscription | null>(null);
  const invitationDisplayRequestSubscription = useRef<Subscription | null>(
    null,
  );
  const defaultConsentOptinRequestSubscription = useRef<Subscription | null>(
    null,
  );
  const evmAccountsRef = useRef<EVMAccountAddress[] | null>(null);
  const uniqueConsentAdressesRef = useRef<EVMContractAddress[]>([]);
  const [deepLinkInvitation, setDeepLinkInvitation] =
    useState<IInvitation | null>(null);

  const [domainInvitation, setDomainInvitation] = useState<IInvitation | null>(
    null,
  );

  const [consentInvitation, setConsentInvitation] =
    useState<IInvitation | null>(null);

  const [userRequestInvitation, setUserRequestInvitation] =
    useState<IInvitation | null>(null);

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

  const requestLinkAccountIfNeeded = () => {
    if (!evmAccountsRef.current) {
      requestLinkAccount();
    }
  };

  const currentInvitation: ICurrentInvitation | null = useMemo(() => {
    if (!evmAccounts) return null;
    if (userRequestInvitation) {
      return {
        data: userRequestInvitation,
        type: EInvitationSourceType.USER_REQUEST,
      };
    }
    if (awaitRender) {
      return null;
    }

    if (deepLinkInvitation) {
      return { data: deepLinkInvitation, type: EInvitationSourceType.DEEPLINK };
    }
    if (domainInvitation) {
      return { data: domainInvitation, type: EInvitationSourceType.DOMAIN };
    }
    if (consentInvitation) {
      return {
        data: consentInvitation,
        type: EInvitationSourceType.CONSENT_ADDRESS,
      };
    }
    return null;
  }, [
    deepLinkInvitation,
    domainInvitation,
    consentInvitation,
    userRequestInvitation,
    awaitRender,
    evmAccounts,
  ]);

  // length of this could be used for bagde
  const uniqueConsentAdresses = useMemo(() => {
    const adresses = [
      domainInvitation,
      deepLinkInvitation,
      consentInvitation,
    ].reduce((acc, item) => {
      if (item) {
        return acc.concat(item.invitation.consentContractAddress);
      }
      return acc;
    }, [] as EVMContractAddress[]);
    uniqueConsentAdressesRef.current = adresses;
    return adresses;
  }, [deepLinkInvitation, domainInvitation, consentInvitation]);

  useEffect(() => {
    subsribeAccountAddedEvent();
    subscribeInvitationDisplayRequestEvent();
    subscribeDefaultConsentOptinRequestEvent();
    getAccounts();
    return () => {
      accountAddedSubscription.current?.unsubscribe();
      invitationDisplayRequestSubscription.current?.unsubscribe();
      defaultConsentOptinRequestSubscription.current?.unsubscribe();
    };
  }, []);

  const getAccounts = () => {
    return core.account.getAccounts(undefined).map((accounts) => {
      setAccounts(accounts);
    });
  };

  const subsribeAccountAddedEvent = () => {
    core.getEvents().map(
      (events) =>
        (accountAddedSubscription.current = events.onAccountAdded.subscribe(
          () => {
            getAccounts();
          },
        )),
    );
  };
  const subscribeDefaultConsentOptinRequestEvent = () => {
    defaultConsentOptinRequestSubscription.current =
      events.onDefaultConsentOptinRequested.subscribe(
        handledefaultConsentOptinRequest,
      );
  };

  const handledefaultConsentOptinRequest = () => {
    if (config.defaultConsentContract) {
      core.invitation.acceptInvitation(
        new Invitation(config.defaultConsentContract, null, null, null),
      );
    }
  };

  const subscribeInvitationDisplayRequestEvent = () => {
    invitationDisplayRequestSubscription.current =
      events.onInvitationDisplayRequested.subscribe(
        invitationDisplayRequestHandler,
      );
  };

  const invitationDisplayRequestHandler = ({
    data,
    type,
  }: IInvitationDisplayRequest) => {
    console.log("invitationDisplayRequestHandler", data, type);
    requestLinkAccountIfNeeded();
    if (
      uniqueConsentAdressesRef.current.includes(
        data.invitation.consentContractAddress,
      )
    ) {
      return;
    }
    if (type === EInvitationSourceType.DEEPLINK) {
      setDeepLinkInvitation(data);
    } else if (type === EInvitationSourceType.DOMAIN) {
      setDomainInvitation(data);
    } else if (type === EInvitationSourceType.USER_REQUEST) {
      setUserRequestInvitation(data);
    } else {
      setConsentInvitation(data);
    }
  };

  const onPermissionSelected = useCallback(
    (...args) => {
      if (currentInvitation) {
        // call function as background process
        setAppState(EAPP_STATE.IDLE);
        core.invitation
          .acceptInvitation(currentInvitation.data.invitation, undefined)
          .map(() => {
            clearInvitation();
          })
          .mapErr(() => {
            clearInvitation();
          });
      }
    },
    [currentInvitation],
  );

  const optIn = useCallback(
    (params: IOptInParams) => {
      if (currentInvitation) {
        // call function as background process
        setAppState(EAPP_STATE.IDLE);
        const {
          directCall: { permissions, approvals },
          withPermissions,
        } = params;
        const queryBasedPermissions: Record<
          IpfsCID,
          { virtual: EWalletDataType[]; questionnaires: IpfsCID[] }
        > = {};
        core.invitation
          .acceptInvitation(currentInvitation.data.invitation, undefined)
          .andThen(() => {
            return ResultUtils.combine(
              Array.from(approvals.entries()).map(([cid, rewards]) => {
                return core.approveQuery(cid, rewards, null, undefined);
              }),
            );
          })
          .andThen(() => {
            return ResultUtils.combine(
              Array.from(withPermissions.entries()).map(
                ([cid, { rewardParameters, permissions }]) => {
                  return core.approveQuery(
                    cid,
                    rewardParameters,
                    {
                      questionnaires: permissions.questionnaires,
                      virtualQuestionnaires: permissions.dataTypes,
                    },
                    undefined,
                  );
                },
              ),
            );
          })
          .map(() => {
            clearInvitation();
            console.log("optIn steps success");
          })
          .mapErr((e) => {
            console.log("optIn steps error", e);
            clearInvitation();
          });
      }
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
      core.invitation
        .rejectInvitation(currentInvitation.data.invitation, rejectUntil)
        .map(() => {
          clearInvitation();
        })
        .mapErr(() => {
          clearInvitation();
        });
    },
    [currentInvitation],
  );

  const clearInvitation = useCallback(() => {
    if (currentInvitation) {
      switch (currentInvitation.type) {
        case EInvitationSourceType.DEEPLINK:
          setDeepLinkInvitation(null);
          break;
        case EInvitationSourceType.DOMAIN:
          setDomainInvitation(null);
          break;
        case EInvitationSourceType.USER_REQUEST:
          setUserRequestInvitation(null);
          break;
        case EInvitationSourceType.CONSENT_ADDRESS:
          setConsentInvitation(null);
          break;
      }
    }
  }, [currentInvitation]);

  useEffect(() => {
    if (currentInvitation) {
      return setAppState(EAPP_STATE.INVITATION_PREVIEW);
    }
    setAppState(EAPP_STATE.IDLE);
  }, [currentInvitation]);

  useEffect(() => {
    if (appState === EAPP_STATE.IDLE) {
      hide();
    }
    if (appState === EAPP_STATE.INVITATION_PREVIEW) {
      show();
    }
  }, [appState]);

  const component = useMemo(() => {
    if (currentInvitation) {
      switch (appState) {
        case EAPP_STATE.IDLE:
          return null;
        case EAPP_STATE.INVITATION_PREVIEW:
          return (
            <Suspense fallback={null}>
              <LazyConsentModal
                onClose={clearInvitation}
                key={currentInvitation.data.invitation.consentContractAddress}
                open={true}
                onOptinClicked={optIn}
                consentContractAddress={
                  currentInvitation.data.invitation.consentContractAddress
                }
                invitationData={currentInvitation.data.metadata}
                answerQuestionnaire={(
                  id: IpfsCID,
                  answers: NewQuestionnaireAnswer[],
                ) => {
                  return core.questionnaire.answerQuestionnaire(
                    id,
                    answers,
                    undefined,
                  );
                }}
                onRejectClick={() => {
                  rejectInvitation(false);
                }}
                onRejectWithTimestampClick={() => {
                  rejectInvitation(true);
                }}
                displayRejectButtons={[
                  EInvitationSourceType.CONSENT_ADDRESS,
                  EInvitationSourceType.DOMAIN,
                ].includes(currentInvitation.type)}
                getQueryStatuses={function (
                  contractAddress: EVMContractAddress,
                ): ResultAsync<QueryStatus[], unknown> {
                  return core.getQueryStatusesByContractAddress(
                    contractAddress,
                    undefined,
                  );
                }}
                evmAccounts={evmAccounts!}
                getQuestionnairesByCids={function (
                  cids: IpfsCID[],
                ): ResultAsync<Questionnaire[], unknown> {
                  return core.questionnaire.getByCIDs(cids, undefined);
                }}
              />
            </Suspense>
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }, [appState, evmAccounts, currentInvitation]);

  if (EAPP_STATE.IDLE === appState) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <>
        {component && (
          <Suspense fallback={null}>
            <LazyModalContainer>{component}</LazyModalContainer>
          </Suspense>
        )}
      </>
    </ThemeProvider>
  );
};
