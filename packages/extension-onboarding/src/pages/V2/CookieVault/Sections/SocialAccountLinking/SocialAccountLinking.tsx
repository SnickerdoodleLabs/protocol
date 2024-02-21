import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import { Social } from "@extension-onboarding/components/v2/LinkedAccountItem";
import { SocialMenu } from "@extension-onboarding/components/v2/LinkingAccountMenu";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { useCookieVaultContext } from "@extension-onboarding/pages/V2/CookieVault/CookieVault.context";
import { getResponsivePopupProperties } from "@extension-onboarding/utils";
import { Box } from "@material-ui/core";
import {
  DiscordProfile,
  EOAuthProvider,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import { errAsync } from "neverthrow";
import React, { FC, useEffect } from "react";

interface ISocialAccountLinkingProps {}

const SocialAccountLinking: FC<ISocialAccountLinkingProps> = ({}) => {
  const { sdlDataWallet } = useDataWalletContext();
  const { uiStateUtils } = useAppContext();
  const { setAlert } = useNotificationContext();
  const connectionWindowRef = React.useRef<Window | null>(null);
  const { discordAccounts, fetchDiscordAccounts } = useCookieVaultContext();

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

  const handleUnlinkAccountClick = (profile: DiscordProfile) => {
    sdlDataWallet.discord.unlink(profile.id).map(() => {
      setAlert({
        severity: EAlertSeverity.SUCCESS,
        message: "Your account has successfully been unlinked. ",
      });
      fetchDiscordAccounts();
    });
  };

  return (
    <>
      <Card>
        <CardTitle
          title="Social Accounts"
          subtitle="Connect and share your social presence without divulging your full social account information"
          titleVariant="headlineMd"
          subtitleVariant="bodyLg"
        />
        <Box mt={4} />
        <SocialMenu onDiscordConnectClick={handleLinkAccountClick} />
        {discordAccounts.length > 0 && (
          <>
            <Box mt={3} />
            {discordAccounts.map((account, index) => (
              <Social
                key={index}
                account={account}
                onClick={() => handleUnlinkAccountClick(account)}
              />
            ))}
          </>
        )}
      </Card>
    </>
  );
};

export default SocialAccountLinking;
