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
  EVMContractAddress,
  EWalletDataType,
  IOldUserAgreement,
  IPaletteOverrides,
  ISnickerdoodleCore,
  IUserAgreement,
  Invitation,
  LinkedAccount,
  UnixTimestamp,
} from "@snickerdoodlelabs/objects";
import {
  DescriptionWidget,
  FF_SUPPORTED_ALL_PERMISSIONS,
  ModalContainer,
  PermissionSelectionWidget,
  createThemeWithOverrides,
} from "@snickerdoodlelabs/shared-components";
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
}

export enum EAPP_STATE {
  IDLE,
  INVITATION_PREVIEW,
  PERMISSION_SELECTION,
}

interface IInvitation {
  invitation: Invitation;
  metadata: IOldUserAgreement | IUserAgreement;
}

interface ICurrentInvitation {
  data: IInvitation;
  type: EInvitationSourceType;
}

export const defaultLightPalette: IPaletteOverrides = {
  primary: "#000",
  primaryContrast: "#FFF",
  button: "#000",
  buttonContrast: "#FFF",
  text: "#212121",
  linkText: "#2795BD",
  background: "#FFF",
  border: "rgba(236, 236, 236, 0.30)",
};

export const defaultDarkPalette: IPaletteOverrides = {
  primary: `#FFF`,
  primaryContrast: "#212121",
  button: "#FFF",
  buttonContrast: "#212121",
  text: "#FFF",
  linkText: "#FFF",
  background: "#212121",
  border: "rgba(236, 236, 236, 0.30)",
};

export const InvitationHandler: FC<IInvitationHandlerProps> = ({
  core,
  hide,
  show,
  events,
  config,
  coreConfig,
}) => {
  const [theme, setTheme] = useState<Theme>(
    createThemeWithOverrides(config.palette ?? defaultLightPalette),
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

  const currentInvitation: ICurrentInvitation | null = useMemo(() => {
    if (accounts.length === 0) {
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
    accounts.length,
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

  const rejectInvitation = useCallback(
    (withTimestamp: boolean) => {
      if (!currentInvitation) return;
      // reject until 12 hours from the current time.
      const rejectUntil = withTimestamp
        ? UnixTimestamp(
            Math.floor(
              new Date(Date.now() + 12 * 60 * 60 * 1000).getTime() / 1000,
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
        case EInvitationSourceType.CONSENT_ADDRESS:
          setConsentInvitation(null);
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
            <DescriptionWidget
              onRejectClick={() => {
                rejectInvitation(false);
              }}
              onRejectWithTimestampClick={() => {
                rejectInvitation(true);
              }}
              invitationData={currentInvitation.data.metadata}
              onCancelClick={clearInvitation}
              onContinueClick={() => {
                onPermissionSelected(FF_SUPPORTED_ALL_PERMISSIONS);
              }}
              onSetPermissions={() => {
                setAppState(EAPP_STATE.PERMISSION_SELECTION);
              }}
            />
          );
        case EAPP_STATE.PERMISSION_SELECTION:
          return (
            <PermissionSelectionWidget
              onCancelClick={clearInvitation}
              onSaveClick={onPermissionSelected}
            />
          );
        default:
          return null;
      }
    } else {
      return null;
    }
  }, [appState, currentInvitation]);

  if (EAPP_STATE.IDLE === appState) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <>{component && <ModalContainer>{component}</ModalContainer>}</>
    </ThemeProvider>
  );
};
