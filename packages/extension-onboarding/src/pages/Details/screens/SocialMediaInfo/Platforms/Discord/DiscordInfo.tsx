import { Box, Button, Grid } from "@material-ui/core";
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
      <Grid container className={`${classes.accountBoxContainer}`} spacing={3}>
        <Grid item container direction="row" alignItems="center">
          <Grid item xs={1}>
            <img className={classes.providerLogo} src={icon} />
          </Grid>
          <Grid item xs={9} justifyContent="flex-start" alignItems="center">
            <p className={classes.providerText}>{name}</p>
          </Grid>

          <Grid item xs={2} justifyContent="center" alignItems="center">
            <Button
              variant="outlined"
              href={`https://discord.com/oauth2/authorize?response_type=code&client_id=1089994449830027344&scope=identify%20guilds&state=15773059ghq9183habn&redirect_uri=${window.location.origin}/data-dashboard/social-media-data&prompt=consent`}
            >
              Link Account
            </Button>
          </Grid>
        </Grid>
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
      </Grid>
    </>
  );
};

export default memo(DiscordInfo);
