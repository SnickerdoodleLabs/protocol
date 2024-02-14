import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { getResponsivePopupProperties } from "@extension-onboarding/utils";
import { Box, IconButton, Menu, MenuItem, makeStyles } from "@material-ui/core";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
import React, { FC, useEffect, useState, useRef } from "react";

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

interface ISocialAccountLinkingProps {
  onComplete: () => void;
}

const SocialAccountLinking: FC<ISocialAccountLinkingProps> = ({
  onComplete,
}) => {
  const lastWidth = useRef<number>();

  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (anchorEl) {
      const width = anchorEl.offsetWidth;
      if (lastWidth.current !== width) {
        lastWidth.current = width;
      }
    }
  }, [anchorEl]);

  const { sdlDataWallet } = useDataWalletContext();
  const { uiStateUtils } = useAppContext();
  const { setModal } = useLayoutContext();
  const { setAlert } = useNotificationContext();
  const [profiles, setProfiles] = useState<DiscordProfile[]>([]);
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

  const classes = useStyles();
  return (
    <>
      <Box
        className={classes.wrapper}
        id="account-linking"
        onClick={(e) => handleClick(e)}
        borderRadius={12}
        p={3}
        borderColor="borderColor"
        border="1px solid"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SDTypography variant="bodyLg" fontWeight="bold">
          Connect Account
        </SDTypography>
        <img
          src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
          width={40}
          height={40}
        />
      </Box>
      <Menu
        elevation={0}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        anchorEl={anchorEl}
        open={anchorEl?.id === "account-linking"}
        onClose={handleClose}
        MenuListProps={{
          style: { width: anchorEl?.offsetWidth ?? lastWidth.current },
        }}
        style={{ marginTop: 16 }}
      >
        <MenuItem
          onClick={() => {
            handleLinkAccountClick();
            handleClose();
          }}
        >
          <Box display="flex" gridGap={16} alignItems="center">
            <img
              src="https://storage.googleapis.com/dw-assets/shared/icons/discord-link.png"
              width={24}
              height={24}
            />
            <SDTypography variant="bodyLg" fontWeight="bold">
              Connect Discord
            </SDTypography>
          </Box>
        </MenuItem>
      </Menu>
      {profiles.length > 0 && (
        <>
          <Box mt={3} />
          {profiles.map((account, index) => (
            <Box
              key={account.id}
              display="flex"
              borderColor="borderColor"
              border="1px solid"
              borderRadius={12}
              alignItems="center"
              p={3}
              {...(profiles.length - 1 != index && { mb: 3 })}
              gridGap={16}
              position="relative"
            >
              <Box className={classes.accountItemAction} px={2}>
                <IconButton
                  id="account-action"
                  onClick={(e) => {
                    handleClick(e);
                  }}
                >
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  elevation={0}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  anchorEl={anchorEl}
                  open={anchorEl?.id === "account-action"}
                  onClose={handleClose}
                >
                  <MenuItem
                    onClick={() => {
                      handleUnlinkAccountClick(account);
                      handleClose();
                    }}
                  >
                    <Box
                      display="flex"
                      justifyContent="center"
                      px={1}
                      py={1}
                      gridGap={8}
                    >
                      <DeleteForeverIcon color="error" />
                      <SDTypography variant="bodyLg">Disconnect</SDTypography>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
              <img src={getDiscordAvatar(account)} width={40} height={40} />
              <SDTypography variant="bodyLg" fontWeight="bold">
                {`${account.username}#${account.discriminator}`}
              </SDTypography>
            </Box>
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

const useStyles = makeStyles((theme) => ({
  wrapper: {
    cursor: "pointer",
  },
  accountItemAction: {
    width: "100%",
    height: "100%",
    position: "absolute",
    alignItems: "center",
    left: 0,
    right: 0,
    display: "flex",
    justifyContent: "flex-end",
    opacity: 0,
    transition: "opacity 0.5s",
    "&:hover": {
      opacity: 1,
    },
  },
}));

export default SocialAccountLinking;
