import { Box, Button, Typography } from "@material-ui/core";
import {
  DiscordID,
  DiscordProfile,
  OAuthAuthorizationCode,
} from "@snickerdoodlelabs/objects";
import React, { FC, memo, useEffect, useState } from "react";

import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";
import { ISocialMediaPlatformProps } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Discord.style";
import { DiscordAccountItem } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Items/DiscordAccountItem";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/types";
import Card from "@extension-onboarding/components/v2/Card";
export const DiscordInfo: FC<ISocialMediaPlatformProps> = memo(
  ({ name, icon }: ISocialMediaPlatformProps) => {
    const [discordProfiles, setDiscordProfiles] = useState<DiscordProfile[]>(
      [],
    );
    const [linkedDiscordAccount, setLinkedDiscordAccount] = useState<
      ILinkedDiscordAccount[]
    >([]);
    const { discordProvider: provider } = useAccountLinkingContext();

    const getGuildProfiles = (discordProfiles: DiscordProfile[]) => {
      provider.getGuildProfiles().map((guildProfiles) =>
        setLinkedDiscordAccount(
          discordProfiles.map((discordProfile) => ({
            name: discordProfile.username,
            userId: discordProfile.id,
            avatar: discordProfile.avatar,
            discriminator: discordProfile.discriminator,
            servers: guildProfiles.filter(
              (profile) => profile.discordUserProfileId === discordProfile.id,
            ),
          })),
        ),
      );
    };

    const getUserProfiles = () => {
      provider
        .getUserProfiles()
        .map((discordProfiles) => setDiscordProfiles(discordProfiles));
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
      <Card>
        <Box display="flex" flexDirection="column">
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
          </Box>
          {linkedDiscordAccount.map((discordProfile, index) => {
            return <DiscordAccountItem key={index} item={discordProfile} />;
          })}
        </Box>
      </Card>
    );
  },
);
