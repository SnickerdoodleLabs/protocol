import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { Social } from "@extension-onboarding/components/v2/LinkedAccountItem";
import { SocialMenu } from "@extension-onboarding/components/v2/LinkingAccountMenu";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { getResponsivePopupProperties } from "@extension-onboarding/utils";
import { Box } from "@material-ui/core";
import {
  DiscordProfile,
  EOAuthProvider,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import { SDButton } from "@snickerdoodlelabs/shared-components";
import { errAsync } from "neverthrow";
import React, { FC, useEffect, useState } from "react";

interface ISocialAccountLinkingProps {
  onComplete: () => void;
}

const SocialAccountLinking: FC<ISocialAccountLinkingProps> = ({
  onComplete,
}) => {
  const { sdlDataWallet } = useDataWalletContext();
  const { uiStateUtils } = useAppContext();
  const { setAlert } = useNotificationContext();
  const [profiles, setProfiles] = useState<DiscordProfile[]>([]);
  const connectionWindowRef = React.useRef<Window | null>(null);

  useEffect(() => {
    getProfiles();
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
              getProfiles();
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

  const getProfiles = () => {
    sdlDataWallet.discord
      .getUserProfiles()
      .map((profiles) => {
        setProfiles(profiles);
      })
      .mapErr((err) => {
        console.log(err);
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
      getProfiles();
    });
  };

  return (
    <>
      <SocialMenu onDiscordConnectClick={handleLinkAccountClick} />
      {profiles.length > 0 && (
        <>
          <Box mt={3} />
          {profiles.map((account, index) => (
            <Social
              key={index}
              account={account}
              onClick={() => handleUnlinkAccountClick(account)}
            />
          ))}
        </>
      )}

      <Box mt={6}>
        <SDButton
          variant={profiles.length > 0 ? "contained" : "outlined"}
          color="primary"
          onClick={() => {
            onComplete();
          }}
        >
          {profiles.length > 0 ? "Next" : "Skip"}
        </SDButton>
      </Box>
    </>
  );
};

export default SocialAccountLinking;