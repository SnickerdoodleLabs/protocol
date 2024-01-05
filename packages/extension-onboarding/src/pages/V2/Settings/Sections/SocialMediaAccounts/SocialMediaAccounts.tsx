import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { getResponsivePopupProperties } from "@extension-onboarding/utils";
import { Box } from "@material-ui/core";
import {
  DiscordProfile,
  EOAuthProvider,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import {
  SDButton,
  SDTypography,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import { errAsync } from "neverthrow";
import React, { useEffect, useState } from "react";

const discordImageUrl = "https://cdn.discordapp.com";

const getDiscordAvatar = ({
  avatar,
  discriminator,
  id,
}: DiscordProfile): string => {
  return avatar === null
    ? `${discordImageUrl}/embed/avatars/${Number(discriminator) % 5}.png`
    : `${discordImageUrl}/avatars/${id}/${avatar}.png`;
};

// only discord for now
const SocialMediaAccounts = () => {
  const { sdlDataWallet } = useDataWalletContext();
  const { setModal } = useLayoutContext();
  const { setAlert } = useNotificationContext();
  const [profiles, setProfiles] = useState<DiscordProfile[]>();
  const currentBreakPoint = useMedia();
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
    setModal({
      modalSelector: EModalSelectors.OTP_MODAL,
      onPrimaryButtonClick: () => {
        sdlDataWallet.discord
          .unlink(profile.id)
          .map(() => {
            setAlert({
              severity: EAlertSeverity.SUCCESS,
              message: "Your account has successfully been unlinked. ",
            });
            getProfiles();
          })
          .mapErr((err) => {
            console.log(err);
          });
      },
      customProps: {
        title: "Unlink Account",
        subtitle: "This will permanently unlink your account",
        description: (
          <span>
            Are you sure want to unlink your
            <span style={{ textTransform: "uppercase" }}>
              <strong>{` ${profile.username}#${profile.discriminator} `}</strong>
            </span>
            account?
            <br />
            If you are sure, you can continue the process by entering the code
            below.
          </span>
        ),
        actionText: "Unlink",
      },
    });
  };

  return (
    <Card>
      <CardTitle
        title="Social Media"
        subtitle="Share what kinds of Discord channels you are subscribed to. No one will ever know your discord handle."
      />
      <Box mt={3} />
      <Box
        p={3}
        display="flex"
        flexDirection="column"
        border="1px solid"
        borderColor="borderColor"
        borderRadius={12}
      >
        <Box
          display="flex"
          alignItems={{ xs: undefined, sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          width="100%"
        >
          <Box
            display="flex"
            alignItems="center"
            mb={{ xs: 1.5, sm: undefined }}
          >
            <img
              src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
              width={40}
              height={40}
            />
            <Box ml={2} />
            <SDTypography
              variant="bodyLg"
              fontWeight="medium"
              color="textHeading"
            >
              Discord
            </SDTypography>
          </Box>
          <Box ml={{ xs: undefined, sm: "auto" }}>
            <SDButton
              fullWidth={currentBreakPoint === "xs"}
              variant="outlined"
              onClick={handleLinkAccountClick}
            >
              Link Acount
            </SDButton>
          </Box>
        </Box>
        {profiles?.map((profile) => {
          return (
            <Box
              mt={3}
              key={profile.id}
              p={3}
              display="flex"
              width="100%"
              justifyContent="space-between"
              border="1px solid"
              borderColor="borderColor"
              borderRadius={12}
              alignItems={{ xs: undefined, sm: "center" }}
              flexDirection={{ xs: "column", sm: "row" }}
            >
              <Box
                display="flex"
                alignItems="center"
                mb={{ xs: 1.5, sm: undefined }}
              >
                <img
                  src={getDiscordAvatar(profile)}
                  height={32}
                  style={{ borderRadius: "50%" }}
                />
                <Box ml={1} />
                <SDTypography variant="bodyMd">{`${profile.username}#${profile.discriminator}`}</SDTypography>
              </Box>
              <Box ml={{ xs: undefined, sm: "auto" }}>
                <SDButton
                  fullWidth={currentBreakPoint === "xs"}
                  variant="outlined"
                  color="danger"
                  onClick={() => {
                    handleUnlinkAccountClick(profile);
                  }}
                >
                  Unlink Account
                </SDButton>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Card>
  );
};

export default SocialMediaAccounts;
