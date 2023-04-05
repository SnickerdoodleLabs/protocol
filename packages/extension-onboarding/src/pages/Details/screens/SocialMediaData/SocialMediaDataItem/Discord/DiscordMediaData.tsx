import { Button, Box, Grid, Typography } from "@material-ui/core";
import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import React, { FC, memo, useState, useEffect } from "react";

import DiscordUnlinkingModal from "@extension-onboarding/components/Modals/DiscordUnlinkingModal";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import DiscordMediaDataItem from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataItem";
import {
  ILinkedDiscordAccount,
  ISocialMediaDataItemProps,
} from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { IDiscordAuthResponse } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";

declare const window: IWindowWithSdlDataWallet;

const DiscordMediaData: FC<ISocialMediaDataItemProps> = ({
  name,
  icon,
}: ISocialMediaDataItemProps) => {
  const [discordProfiles, setDiscordProfiles] = useState<DiscordProfile[]>([]);
  const [linkedDiscordAccount, setLinkedDiscordAccount] = useState<
    ILinkedDiscordAccount[]
  >([]);
  const { discordMediaDataProvider: provider } = useAccountLinkingContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [selectedAccountName, setSelectedAccountName] = useState<string>("");

  const getGuildProfiles = (discordProfiles: DiscordProfile[]) => {
    provider.getGuildProfiles().map((guildProfiles) => {
      const profiles = discordProfiles.reduce<ILinkedDiscordAccount[]>(
        (profiles, discordProfile) => {
          profiles.push({
            name: discordProfile.username,
            userId: discordProfile.id,
            avatar: discordProfile.avatar,
            discriminator: discordProfile.discriminator,
            servers: getDiscordUserProfiles(guildProfiles, discordProfile.id),
            openUnlinkModal: setIsModalOpen,
            setAccountIdToRemove: setSelectedAccountId,
            setAccountNameToRemove: setSelectedAccountName,
          });
          return profiles;
        },
        [],
      );
      setLinkedDiscordAccount(profiles);
    });
  };

  const getDiscordUserProfiles = (
    guildProfiles: DiscordGuildProfile[],
    discordProfileId: SnowflakeID,
  ): DiscordGuildProfile[] => {
    return guildProfiles.filter((guildProfile) => {
      return guildProfile.discordUserProfileId === discordProfileId;
    });
  };

  const initializeUser = (code: string) => {
    console.log("DiscordMediaData: initializeUser with code", code);
    provider.getOauthTokenFromDiscord(code).then((res) => {
      res.json().then((data: IDiscordAuthResponse) => {
        if (data.access_token) {
          provider
            .initializeUser({
              discordAuthToken: BearerAuthToken(data.access_token),
            })
            .map(() => {
              window.history.replaceState(null, "", window.location.pathname);
              getUserProfiles();
            });
        }
      });
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    if (code) {
      initializeUser(code);
    }
  }, [JSON.stringify(window.location.search)]);

  const getUserProfiles = () => {
    provider.getUserProfiles().map((discordProfiles) => {
      setDiscordProfiles(discordProfiles);
    });
  };

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
        <Grid item xs={12}>
          {linkedDiscordAccount.map((discordProfile) => {
            return (
              <DiscordMediaDataItem
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
      </Grid>
    </>
  );
};

export default memo(DiscordMediaData);
