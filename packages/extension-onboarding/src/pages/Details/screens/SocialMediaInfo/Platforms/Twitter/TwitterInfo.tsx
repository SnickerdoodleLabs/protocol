import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import SocialUnlinkingModal from "@extension-onboarding/components/Modals/SocialUnlinkingModal";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { ISocialMediaPlatformProps } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Twitter/Twitter.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Button, Typography } from "@material-ui/core";
import {
  OAuth1RequstToken,
  TokenAndSecret,
  OAuthVerifier,
  TwitterID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import React, { FC, memo, useEffect, useState } from "react";

import { TwitterAccountItem } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Twitter/Items/TwitterAccountItem";

declare const window: IWindowWithSdlDataWallet;

export const TwitterInfo: FC<ISocialMediaPlatformProps> = memo(
  ({ name, icon }: ISocialMediaPlatformProps) => {
    const { twitterProvider: provider } = useAccountLinkingContext();

    const [userProfiles, setUserProfiles] = useState<TwitterProfile[]>([]);
    const getUserProfiles = () =>
      provider.getUserProfiles().map(setUserProfiles);

    const { setAlert } = useNotificationContext();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [selectedProfile, setSelectedProfile] =
      useState<TwitterProfile | null>(null);

    const [requestPin, setRequestPin] = useState<boolean>(false);

    const initTwitterProfile = (
      requestToken: OAuth1RequstToken,
      oAuthVerifier: OAuthVerifier,
    ) => {
      provider
        .initTwitterProfile({
          requestToken,
          oAuthVerifier,
        })
        .map(() => {
          window.history.replaceState(null, "", window.location.pathname);
          setAlert({
            severity: EAlertSeverity.SUCCESS,
            message: "Your account has successfully been linked. ",
          });
          getUserProfiles();
        });
    };

    useEffect(() => {
      const incomingRequestToken = new URLSearchParams(
        window.location.search,
      ).get("oauth_token");
      const verifier = new URLSearchParams(window.location.search).get(
        "oauth_verifier",
      );
      !!verifier &&
        !!incomingRequestToken &&
        initTwitterProfile(
          incomingRequestToken as OAuth1RequstToken,
          verifier as OAuthVerifier,
        );
    }, [JSON.stringify(window.location.search)]);

    useEffect(() => {
      getUserProfiles();
    }, []);

    const classes = useStyles();
    return (
      <>
        {isModalOpen && (
          <SocialUnlinkingModal
            profileName={`${selectedProfile?.userObject.username}#${selectedProfile?.userObject.id}`}
            closeModal={() => setIsModalOpen(false)}
            unlinkAccount={() =>
              provider
                .unlinkProfile({
                  id: selectedProfile?.userObject.id as TwitterID,
                })
                .map(() => {
                  getUserProfiles();
                  setIsModalOpen(false);
                })
            }
          />
        )}
        <Box
          p={3}
          display="flex"
          border="1px solid #ECECEC"
          borderRadius={12}
          flexDirection="column"
        >
          <Box
            alignItems="center"
            display="flex"
            width="100%"
            justifyContent="space-between"
          >
            <Box alignItems="center" display="flex">
              <img className={classes.providerLogo} src={icon} />
              <Box ml={2} justifyContent="flex-start" alignItems="center">
                <Typography className={classes.providerName}>{name}</Typography>
              </Box>
            </Box>
            <Box justifyContent="center" alignItems="center">
              <Button
                variant="outlined"
                className={classes.linkAccountButton}
                onClick={() =>
                  provider.getOAuth1aRequestToken().map((tokenAndSecret) => {
                    window.open(
                      `https://api.twitter.com/oauth/authorize?oauth_token=${tokenAndSecret.token}&oauth_token_secret=${tokenAndSecret.secret}&oauth_callback_confirmed=true`,
                      `_self`,
                    );
                  })
                }
              >
                Link Account
              </Button>
            </Box>
          </Box>
          {userProfiles.map((twitterProfile, index) => {
            return (
              <TwitterAccountItem
                key={index}
                handleUnlinkClick={() => {
                  setIsModalOpen(true);
                  setSelectedProfile(twitterProfile);
                }}
                item={twitterProfile}
              />
            );
          })}
        </Box>
      </>
    );
  },
);
