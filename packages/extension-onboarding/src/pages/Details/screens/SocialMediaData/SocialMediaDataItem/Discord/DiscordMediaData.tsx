import { Button, Box } from "@material-ui/core";
import React, { FC, memo, useState, useEffect } from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";
import DiscordUnlinkingModal from "@extension-onboarding/components/Modals/DiscordUnlinkingModal";
import DiscordMediaDataItem from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataItem";

import {
  ILinkedDiscordAccount,
  ISocialMediaDataItemProps,
} from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";
import {
  IDiscordAuthResponse,
} from "@extension-onboarding/services/socialMediaDataProviders/interfaces";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";

declare const window: IWindowWithSdlDataWallet;

const DiscordMediaData: FC<ISocialMediaDataItemProps> = ({
  name,
  icon,
}: ISocialMediaDataItemProps) => {
  const [requestData, setRequestData] = useState<boolean>();
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
            openUnlinkModal : setIsModalOpen,
            setAccountIdToRemove : setSelectedAccountId,
            setAccountNameToRemove : setSelectedAccountName
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
    provider.getOauthTokenFromDiscord(code).then((res) => {
      res.json().then((data: IDiscordAuthResponse) => {
        if (data.access_token) {
          provider
            .initializeUser({
              discordAuthToken: BearerAuthToken(data.access_token),
            })
            .map(() => {
              setRequestData(!requestData);
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
  }, [requestData]);

  useEffect(() => {
    if (!discordProfiles) return;
    getGuildProfiles(discordProfiles);
  }, [discordProfiles ]);

  const classes = useStyles();
  return (
    <>
    {isModalOpen && (
      <DiscordUnlinkingModal
      profileName={selectedAccountName}
        closeModal={() => {
          setIsModalOpen(false);
        }}
        unlinkAccount={
          () => {
            provider.unlink(SnowflakeID(selectedAccountId))
          }
        }

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
            href="https://discord.com/oauth2/authorize?response_type=code&client_id=1089994449830027344&scope=identify%20guilds&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Flocalhost:9005/data-dashboard/social-media-data&prompt=consent"
          >
            Link Account
          </Button>
        </Box>
      </Box>
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
    </Box>
    </>
  );
};

export default memo(DiscordMediaData);
