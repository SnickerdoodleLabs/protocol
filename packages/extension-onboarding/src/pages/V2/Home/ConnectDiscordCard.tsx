import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import Card from "@extension-onboarding/pages/V2/Home/Card";
import { getResponsivePopupProperties } from "@extension-onboarding/utils";
import { Collapse } from "@material-ui/core";
import {
  EOAuthProvider,
  OAuthAuthorizationCode,
  DiscordProfile,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  colors,
  useResponsiveValue,
} from "@snickerdoodlelabs/shared-components";
import { errAsync } from "neverthrow";
import React, { FC, useCallback, useEffect, useMemo, useState } from "react";

export default () => {
  const { uiStateUtils } = useAppContext();
  const { setAlert } = useNotificationContext();
  const connectionWindowRef = React.useRef<Window | null>(null);
  const { sdlDataWallet } = useDataWalletContext();
  const [discordAccounts, setDiscordAccounts] = useState<DiscordProfile[]>();
  useEffect(() => {
    fetchDiscordAccounts();
  }, []);

  const fetchDiscordAccounts = useCallback(() => {
    sdlDataWallet.discord.getUserProfiles().map((profiles) => {
      setDiscordAccounts(profiles);
    });
  }, [sdlDataWallet]);

  useEffect(() => {
    const receiveMessage = (event: MessageEvent) => {
      if (event.source && event.source === connectionWindowRef.current) {
        const { provider, code } = event.data as {
          provider: EOAuthProvider;
          code: string;
        };
        if (provider === EOAuthProvider.DISCORD && code) {
          connectionWindowRef.current?.close();
          handleCode(code)
            .map(() => {
              fetchDiscordAccounts();
            })
            .mapErr((err) => {
              console.log(err);
            });
        }
      }
    };
    window.addEventListener("message", receiveMessage);
    return () => {
      window.removeEventListener("message", receiveMessage);
    };
  }, []);

  const handleCode = (code: string) => {
    if (!code) {
      return errAsync(new Error("No code provided"));
    }
    return sdlDataWallet.discord
      .initializeUserWithAuthorizationCode(OAuthAuthorizationCode(code))
      .map(() => {
        uiStateUtils.onSocialAccountLinked();
        setAlert({
          severity: EAlertSeverity.SUCCESS,
          message: "Your account has successfully been linked. ",
        });
      });
  };

  const handleLinkAccountClick = () => {
    sdlDataWallet.discord
      .installationUrl()
      .map((url) => {
        const windowPropeperies = getResponsivePopupProperties();
        connectionWindowRef.current = window.open(
          url,
          "Connect Discord",
          windowPropeperies,
        );
      })
      .mapErr((err) => {
        console.log(err);
      });
  };

  return (
    <Collapse
      timeout={250}
      collapsedSize={0}
      in={discordAccounts && discordAccounts.length === 0}
      unmountOnExit
    >
      <Card
        image="https://storage.googleapis.com/dw-assets/spa/images-v2/card-link-discord.svg"
        title="Connect Discord"
        description="Share your social presence without divulging your full social account information."
        cardBgColor={colors.MAINPURPLE400}
        cardColor={colors.WHITE}
        renderAction={
          <SDButton
            color="inherit"
            variant="outlined"
            onClick={handleLinkAccountClick}
          >
            Connect Discord
          </SDButton>
        }
      />
    </Collapse>
  );
};
