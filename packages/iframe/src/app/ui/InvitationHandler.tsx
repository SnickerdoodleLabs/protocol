import { RootContainer } from "@core-iframe/app/ui/components/Container";
import { permissions } from "@core-iframe/app/ui/constants";
import {
  ThemeProvider,
  ITheme,
  defaultLightTheme,
  IPaletteOverrides,
  generateTheme,
} from "@core-iframe/app/ui/lib";
import { Description } from "@core-iframe/app/ui/widgets/Description";
import { Loading } from "@core-iframe/app/ui/widgets/Loading";
import { PermissionSelection } from "@core-iframe/app/ui/widgets/PermissionSelection";
import { SubscriptionFail } from "@core-iframe/app/ui/widgets/SubscriptionFail";
import { SubscriptionSuccess } from "@core-iframe/app/ui/widgets/SubscriptionSuccess";
import {
  CoreListenerEvents,
  EInvitationType,
} from "@core-iframe/implementations/objects/CoreListenerEvents";
import {
  BigNumberString,
  DataPermissions,
  EWalletDataType,
  IOpenSeaMetadata,
  ISnickerdoodleCore,
  Invitation,
  LinkedAccount,
} from "@snickerdoodlelabs/objects";
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
  events: CoreListenerEvents;
  palette?: IPaletteOverrides;
}

export enum EAPP_STATE {
  IDLE,
  INVITATION_PREVIEW,
  PERMISSION_SELECTION,
  SUBSCRIPTION_CONFIRMATION,
  SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_FAILURE,
  LOADING,
}

interface IInvitation {
  invitation: Invitation;
  metadata: IOpenSeaMetadata;
}

interface ICurrentInvitation {
  data: IInvitation;
  type: EInvitationType;
}

export const InvitationHandler: FC<IInvitationHandlerProps> = ({
  core,
  hide,
  show,
  events,
  palette,
}) => {
  const [theme, setTheme] = useState<ITheme>(
    palette ? generateTheme(palette) : defaultLightTheme,
  );
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.IDLE);
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const accountAddedSubscription = useRef<Subscription | null>(null);
  const invitationDisplayRequestSubscription = useRef<Subscription | null>(
    null,
  );
  const [deepLinkInvitation, setDeepLinkInvitation] = useState<{
    invitation: Invitation;
    metadata: IOpenSeaMetadata;
  } | null>(null);

  const [domainInvitation, setDomainInvitation] = useState<{
    invitation: Invitation;
    metadata: IOpenSeaMetadata;
  } | null>(null);

  const currentInvitation: ICurrentInvitation | null = useMemo(() => {
    if (accounts.length === 0) {
      return null;
    }
    if (deepLinkInvitation) {
      return { data: deepLinkInvitation, type: EInvitationType.DEEPLINK };
    }
    if (domainInvitation) {
      return { data: domainInvitation, type: EInvitationType.DOMAIN };
    }
    return null;
  }, [deepLinkInvitation, domainInvitation, accounts.length]);

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
      events.onInvitationDisplayRequested.subscribe(({ data, type }) => {
        console.log("UI: Invitation Display Requested", data, type);
        if (type === EInvitationType.DEEPLINK) {
          setDeepLinkInvitation(data);
        } else {
          setDomainInvitation(data);
        }
      });
  };

  const onPermissionSelected = useCallback(
    (dataTypes: EWalletDataType[]) => {
      if (currentInvitation) {
        setAppState(EAPP_STATE.LOADING);
        core.invitation
          .acceptInvitation(
            currentInvitation.data.invitation,
            DataPermissions.createWithPermissions(dataTypes),
            undefined,
          )
          .map(() => {
            setAppState(EAPP_STATE.SUBSCRIPTION_SUCCESS);
          })
          .mapErr((err) => {
            clearInvitation();
            setAppState(EAPP_STATE.SUBSCRIPTION_FAILURE);
          });
      }
    },
    [currentInvitation],
  );

  console.log("UI: Invitation Handler", currentInvitation, appState);

  const onRejectClick = () => {};

  const handleContinueClick = () => {
    setAppState(EAPP_STATE.PERMISSION_SELECTION);
  };

  const clearInvitation = useCallback(() => {
    if (currentInvitation) {
      switch (currentInvitation.type) {
        case EInvitationType.DEEPLINK:
          setDeepLinkInvitation(null);
          break;
        case EInvitationType.DOMAIN:
          setDomainInvitation(null);
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
            <Description
              pageInvitation={currentInvitation.data.metadata}
              onCancelClick={clearInvitation}
              onSetPermissions={handleContinueClick}
              onContinueClick={() => {
                onPermissionSelected(permissions.map((item) => item.key));
              }}
            />
          );
        case EAPP_STATE.PERMISSION_SELECTION:
          return (
            <PermissionSelection
              onCancelClick={clearInvitation}
              pageInvitation={currentInvitation.data.metadata}
              onSaveClick={onPermissionSelected}
            />
          );
        case EAPP_STATE.LOADING:
          return <Loading />;
        case EAPP_STATE.SUBSCRIPTION_SUCCESS:
          return (
            <SubscriptionSuccess
              pageInvitation={currentInvitation.data.metadata}
              onClick={clearInvitation}
            />
          );
        case EAPP_STATE.SUBSCRIPTION_FAILURE:
          return <SubscriptionFail onClick={clearInvitation} />;
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
      <RootContainer>{component}</RootContainer>
    </ThemeProvider>
  );
};
