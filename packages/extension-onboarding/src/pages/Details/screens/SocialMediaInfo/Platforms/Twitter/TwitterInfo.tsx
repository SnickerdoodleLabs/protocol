import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import SocialUnlinkingModal from "@extension-onboarding/components/Modals/SocialUnlinkingModal";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { ISocialMediaPlatformProps } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Twitter/Twitter.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Button, Typography } from "@material-ui/core";
import {
  BearerAuthToken,
  ITokenAndSecret,
  SnowflakeID,
  TwitterProfile,
} from "@snickerdoodlelabs/objects";
import React, { FC, memo, useEffect, useState } from "react";

import { TwitterAccountItem } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Twitter/Items/TwitterAccountItem";

declare const window: IWindowWithSdlDataWallet;

export const TwitterInfo: FC<ISocialMediaPlatformProps> = memo(
  ({ name, icon }: ISocialMediaPlatformProps) => {
    const { twitterProvider: provider } = useAccountLinkingContext();

    const [requestToken, setRequestToken] = useState<ITokenAndSecret>(
      {} as ITokenAndSecret,
    );

    const [userProfiles, setUserProfiles] = useState<TwitterProfile[]>([]);
    const getUserProfiles = () =>
      provider.getUserProfiles().map(setUserProfiles);

    const { setAlert } = useNotificationContext();
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const [selectedProfile, setSelectedProfile] =
      useState<TwitterProfile | null>(null);

    const [requestPin, setRequestPin] = useState<boolean>(false);
    const [pinValue, setPinValue] = useState<string>();

    const initTwitterProfile = (
      requestToken: BearerAuthToken,
      oAuthVerifier: string,
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
      if (!verifier || !incomingRequestToken) {
        return;
      }
      if (incomingRequestToken != requestToken.token) {
        console.error(
          `Initial requestToken ${requestToken.token} and incoming request token ${incomingRequestToken} do not match!`,
        );
        return;
      }
      initTwitterProfile(incomingRequestToken as BearerAuthToken, verifier);
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
                  id: selectedProfile?.userObject.id as SnowflakeID,
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
              {!requestPin && (
                <Button
                  variant="outlined"
                  onClick={() =>
                    provider.getOAuth1aRequestToken().map((tokenAndSecret) => {
                      setRequestToken(tokenAndSecret);
                      window
                        .open(
                          `https://api.twitter.com/oauth/authorize?oauth_token=${tokenAndSecret.token}`,
                          "_blank",
                        )
                        ?.focus();
                      setRequestPin(true);
                    })
                  }
                >
                  Link Account
                </Button>
              )}
              {requestPin && (
                <form
                  onSubmit={(e) => {
                    if (e && e.preventDefault) {
                      e.preventDefault();
                    }
                    if (pinValue?.toString().length != 7) {
                      console.error("Pin value consists of 7 numbers");
                    } else {
                      setRequestPin(false);
                      initTwitterProfile(requestToken.token, pinValue);
                    }
                  }}
                >
                  <label>
                    PIN:
                    <input
                      type="text"
                      value={pinValue}
                      onChange={(e) => setPinValue(e.target.value)}
                      name="PIN"
                    />
                  </label>
                  <input type="submit" name="Submit" />
                </form>
              )}
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
