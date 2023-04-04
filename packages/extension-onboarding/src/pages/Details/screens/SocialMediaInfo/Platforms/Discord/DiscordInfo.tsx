import { Box, Button } from "@material-ui/core";
import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordProfile,
  OAuthAuthorizationCode,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import React, { FC, memo, useEffect, useState } from "react";

import DiscordUnlinkingModal from "@extension-onboarding/components/Modals/DiscordUnlinkingModal";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { ISocialMediaPlatformProps } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Discord.style";
import DiscordAccountItem from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Items/DiscordAccountItem";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/types";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { IDiscordAuthResponse } from "@extension-onboarding/services/socialMediaProviders/interfaces";

declare const window: IWindowWithSdlDataWallet;

const DiscordInfo: FC<ISocialMediaPlatformProps> = ({
  name,
  icon,
}: ISocialMediaPlatformProps) => {
  const [discordProfiles, setDiscordProfiles] = useState<DiscordProfile[]>([]);
  const [linkedDiscordAccount, setLinkedDiscordAccount] = useState<
    ILinkedDiscordAccount[]
  >([]);
  const { discordMediaDataProvider: provider } = useAccountLinkingContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedAccountName, setSelectedAccountName] = useState<string>("");

  const getGuildProfiles = (discordProfiles: DiscordProfile[]) =>
    provider.getGuildProfiles().map((guildProfiles) =>
      setLinkedDiscordAccount(
        discordProfiles.reduce<ILinkedDiscordAccount[]>(
          (profiles, discordProfile) => [
            ...profiles,
            {
              name: discordProfile.username,
              userId: discordProfile.id,
              avatar: discordProfile.avatar,
              discriminator: discordProfile.discriminator,
              servers: guildProfiles.filter(
                (profile) => profile.discordUserProfileId === discordProfile.id,
              ),
              openUnlinkModal: setIsModalOpen,
              setAccountIdToRemove: setSelectedAccountId,
              setAccountNameToRemove: setSelectedAccountName,
            },
          ],
          [],
        ),
      ),
    );

  const initializeUser = (code: string) => {
    console.log("DiscordMediaData: initializeUser with code", code);
    provider
      .initializeUserWithAuthorizationCode({
        code: OAuthAuthorizationCode(code),
      })
      .map(() => {
        window.history.replaceState(null, "", window.location.pathname);
        getUserProfiles();
      });
    // provider.getOauthTokenFromDiscord(code).then((res) => {
    //   res.json().then((data: IDiscordAuthResponse) => {
    //     if (data.access_token) {
    //       provider
    //         .initializeUser({
    //           discordAuthToken: BearerAuthToken(data.access_token),
    //         })
    //         .map(() => {
    //           window.history.replaceState(null, "", window.location.pathname);
    //           getUserProfiles();
    //         });
    //     }
    //   });
    // });
  };

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      return;
    }
    initializeUser(code);
  }, [JSON.stringify(window.location.search)]);

  const getUserProfiles = () =>
    provider
      .getUserProfiles()
      .map((discordProfiles) => setDiscordProfiles(discordProfiles));

  useEffect(() => {
    getUserProfiles();
  }, []);

  useEffect(() => {
    if (!discordProfiles) return;
    getGuildProfiles(discordProfiles);
  }, [JSON.stringify(discordProfiles)]);

  const classes = useStyles();
  return (
    <>
      {isModalOpen && (
        <DiscordUnlinkingModal
          profileName={selectedAccountName}
          closeModal={() => {
            setIsModalOpen(false);
          }}
          unlinkAccount={() => {
            provider.unlink(SnowflakeID(selectedAccountId)).map(() => {
              getUserProfiles();
              setIsModalOpen(false);
            });
          }}
        />
      )}
      <Box className={classes.accountBoxContainer}>
        <Box className={`${classes.providerContainer} ${classes.mainProvider}`}>
          <Box>
            <img className={classes.providerLogo} src={icon} />
          </Box>
          <Box>
            <p className={classes.providerText}>{name} testing</p>
          </Box>

          <Box className={classes.linkAccountContainer}>
            <Button
              className={classes.linkAccountButton}
              href={`https://discord.com/oauth2/authorize?response_type=code&client_id=1089994449830027344&scope=identify%20guilds&state=15773059ghq9183habn&redirect_uri=${window.location.origin}/data-dashboard/social-media-data&prompt=consent`}
            >
              Link Account
            </Button>
          </Box>
        </Box>
        {linkedDiscordAccount.map((discordProfile) => {
          return (
            <DiscordAccountItem
              openUnlinkModal={setIsModalOpen}
              name={discordProfile.name}
              servers={discordProfile.servers}
              avatar={discordProfile.avatar}
              discriminator={discordProfile.discriminator}
              userId={discordProfile.userId}
              setAccountIdToRemove={setSelectedAccountId}
              setAccountNameToRemove={setSelectedAccountName}
            />
          );
        })}
      </Box>
    </>
  );
};

export default memo(DiscordInfo);
