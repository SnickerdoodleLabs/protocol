import {
  IFrameConfig,
  IFrameControlConfig,
} from "@core-iframe/interfaces/objects";
import {
  EInvitationSourceType,
  IFrameEvents,
  IInvitationDisplayRequest,
} from "@core-iframe/interfaces/objects/IFrameEvents";
import { Theme, ThemeProvider } from "@material-ui/core";
import {
  DataPermissions,
  EChain,
  EVMAccountAddress,
  EVMContractAddress,
  EWalletDataType,
  IDynamicRewardParameter,
  IOldUserAgreement,
  ISnickerdoodleCore,
  IUserAgreement,
  Invitation,
  IpfsCID,
  LinkedAccount,
  NewQuestionnaireAnswer,
  PagingRequest,
  QueryStatus,
  Questionnaire,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  ConsentModal,
  EColorMode,
  ModalContainer,
  createDefaultTheme,
  createThemeWithOverrides,
} from "@snickerdoodlelabs/shared-components";
import { ResultAsync, okAsync } from "neverthrow";
import { ResultUtils } from "neverthrow-result-utils";
import React, {
  useMemo,
  useState,
  useEffect,
  FC,
  useRef,
  useCallback,
} from "react";
import { Subscription } from "rxjs";

interface IInvitationHandlerProps {
  core: ISnickerdoodleCore;
  hide: () => void;
  show: () => void;
  events: IFrameEvents;
  config: IFrameControlConfig;
  coreConfig: IFrameConfig;
  awaitRender: boolean;
}

export enum EAPP_STATE {
  IDLE,
  INVITATION_PREVIEW,
}

interface IInvitation {
  invitation: Invitation;
  metadata: IOldUserAgreement | IUserAgreement;
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

    return filteredAccounts.length > 0
      ? (filteredAccounts as EVMAccountAddress[])
      : null;
  }, [accounts]);

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
    getAccounts();
    return () => {
      accountAddedSubscription.current?.unsubscribe();
      invitationDisplayRequestSubscription.current?.unsubscribe();
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
    (dataTypes: EWalletDataType[]) => {
      if (currentInvitation) {
        // call function as background process
        setAppState(EAPP_STATE.IDLE);
        core.invitation
          .acceptInvitation(
            currentInvitation.data.invitation,
            DataPermissions.createWithPermissions(dataTypes),
            undefined,
          )
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
        core.invitation
          .acceptInvitation(currentInvitation.data.invitation, null, undefined)
          .andThen(() => {
            // set consent permissions here
            return okAsync(undefined);
          })
          .andThen(() => {
            return ResultUtils.combine(
              Array.from(approvals.entries()).map(([cid, rewards]) =>
                core.approveQuery(cid, rewards, undefined),
              ),
            );
          })
          .andThen(() => {
            return ResultUtils.executeSerially(
              Array.from(withPermissions.entries()).map(
                ([cid, { permissions, rewardParameters }]) =>
                  () =>
                    // set consent permissions here
                    okAsync(undefined).andThen(() => {
                      return core.approveQuery(
                        cid,
                        rewardParameters,
                        undefined,
                      );
                    }),
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
            <ConsentModal
              onClose={clearInvitation}
              open={true}
              onOptinClicked={(params) => {
                optIn(params);
                onPermissionSelected([]);
              }}
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
      <>{component && <ModalContainer>{component}</ModalContainer>}</>
    </ThemeProvider>
  );
};
