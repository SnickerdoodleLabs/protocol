import {
  BigNumberString,
  DomainName,
  EInvitationStatus,
  EWalletDataType,
  LinkedAccount,
  PageInvitation,
} from "@snickerdoodlelabs/objects";
import { RootContainer } from "@web-integration/implementations/app/ui/components/Container/index.js";
import { permissions } from "@web-integration/implementations/app/ui/constants.js";
import { usePath } from "@web-integration/implementations/app/ui/hooks/usePath.js";
import {
  ThemeProvider,
  ITheme,
  defaultLightTheme,
  IPaletteOverrides,
  generateTheme,
} from "@web-integration/implementations/app/ui/lib/index.js";
import { Description } from "@web-integration/implementations/app/ui/widgets/Description/index.js";
import { InvitationCard } from "@web-integration/implementations/app/ui/widgets/InvitationCard/index.js";
import { Loading } from "@web-integration/implementations/app/ui/widgets/Loading/index.js";
import { PermissionSelection } from "@web-integration/implementations/app/ui/widgets/PermissionSelection/index.js";
import { SubscriptionFail } from "@web-integration/implementations/app/ui/widgets/SubscriptionFail/index.js";
import { SubscriptionSuccess } from "@web-integration/implementations/app/ui/widgets/SubscriptionSuccess/index.js";
import { ISnickerdoodleIFrameProxy } from "@web-integration/interfaces/proxy/index.js";
import { okAsync } from "neverthrow";
import React, { useMemo, useState, useEffect, FC, useRef } from "react";
import { Subscription } from "rxjs";
import { parse } from "tldts";

interface IAppProps {
  proxy: ISnickerdoodleIFrameProxy;
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

export const App: FC<IAppProps> = ({ proxy, palette }) => {
  const _pathName = usePath();
  const [theme, setTheme] = useState<ITheme>(
    palette ? generateTheme(palette) : defaultLightTheme,
  );
  const [appState, setAppState] = useState<EAPP_STATE>(EAPP_STATE.IDLE);
  const [pageInvitation, setPageInvitation] = useState<PageInvitation>();
  const [invitaitonStatus, setInvitationStatus] = useState<EInvitationStatus>();
  const [accounts, setAccounts] = useState<LinkedAccount[]>([]);
  const accountAddedSubscription = useRef<Subscription | null>(null);

  useEffect(() => {
    if (accounts.length > 0) {
      const path = window.location.pathname;
      const urlInfo = parse(window.location.href);
      const domain = urlInfo.domain;
      const url = `${urlInfo.hostname}${path.replace(/\/$/, "")}`;
      const domainName = DomainName(`snickerdoodle-protocol.${domain}`);
      getDomainInvitation(domainName, url);
    }
  }, [_pathName, accounts.length]);

  const getDomainInvitation = (domain: DomainName, path: string) => {
    return proxy
      .getInvitationByDomain(domain, path)
      .andThen((_pageInvitation) => {
        if (_pageInvitation) {
          setPageInvitation(_pageInvitation);
          return proxy
            .checkInvitationStatus(
              _pageInvitation.invitation.consentContractAddress,
            )
            .map((status) => {
              setInvitationStatus(status);
            });
        }
        return okAsync(undefined);
      });
  };

  useEffect(() => {
    subsribeAccountAddedEvent();
    getAccounts();
    return () => {
      accountAddedSubscription.current?.unsubscribe();
    };
  }, []);

  const getAccounts = () => {
    proxy.getAccounts().map((accounts) => {
      setAccounts(accounts);
    });
  };

  const clearInvitation = () => {
    setAppState(EAPP_STATE.IDLE);
    setPageInvitation(undefined);
    setInvitationStatus(undefined);
  };

  const subsribeAccountAddedEvent = () => {
    accountAddedSubscription.current = proxy.events.onAccountAdded.subscribe(
      () => {
        getAccounts();
      },
    );
  };

  const onPermissionSelected = (dataTypes: EWalletDataType[]) => {
    if (pageInvitation) {
      setAppState(EAPP_STATE.LOADING);
      proxy
        .acceptInvitation(
          dataTypes,
          pageInvitation.invitation.consentContractAddress,
          pageInvitation?.invitation.tokenId
            ? BigNumberString(pageInvitation.invitation.tokenId.toString())
            : undefined,
          pageInvitation?.invitation.businessSignature ?? undefined,
        )
        .map(() => {
          setAppState(EAPP_STATE.SUBSCRIPTION_SUCCESS);
        })
        .mapErr((err) => {
          clearInvitation();
          setAppState(EAPP_STATE.SUBSCRIPTION_FAILURE);
        });
    }
  };

  const onRejectClick = () => {
    if (pageInvitation) {
      proxy
        .rejectInvitation(
          pageInvitation.invitation.consentContractAddress,
          pageInvitation?.invitation.tokenId
            ? BigNumberString(pageInvitation.invitation.tokenId.toString())
            : undefined,
          pageInvitation?.invitation.businessSignature ?? undefined,
        )
        .map(() => {
          clearInvitation();
        })
        .mapErr((err) => {
          console.log(err);
          clearInvitation();
        });
    }
  };

  const onCancelClick = () => {
    clearInvitation();
  };

  useEffect(() => {
    if (pageInvitation && invitaitonStatus === EInvitationStatus.New) {
      setAppState(EAPP_STATE.INVITATION_PREVIEW);
    }
  }, [pageInvitation, invitaitonStatus]);

  const handleContinueClick = () => {
    setAppState(EAPP_STATE.PERMISSION_SELECTION);
  };

  const component = useMemo(() => {
    if (pageInvitation && invitaitonStatus === EInvitationStatus.New) {
      switch (appState) {
        case EAPP_STATE.IDLE:
          return null;
        case EAPP_STATE.INVITATION_PREVIEW:
          return (
            <Description
              pageInvitation={pageInvitation}
              onCancelClick={onCancelClick}
              onSetPermissions={handleContinueClick}
              onContinueClick={() => {
                onPermissionSelected(permissions.map((item) => item.key));
              }}
            />
          );
        case EAPP_STATE.PERMISSION_SELECTION:
          return (
            <PermissionSelection
              onCancelClick={onCancelClick}
              pageInvitation={pageInvitation}
              onSaveClick={onPermissionSelected}
            />
          );
        case EAPP_STATE.LOADING:
          return <Loading />;
        case EAPP_STATE.SUBSCRIPTION_SUCCESS:
          return (
            <SubscriptionSuccess
              pageInvitation={pageInvitation}
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
  }, [appState, pageInvitation, invitaitonStatus]);

  if (EAPP_STATE.IDLE === appState) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <RootContainer>{component}</RootContainer>
    </ThemeProvider>
  );
};
