import { Button, Box } from "@material-ui/core";
import { DiscordGuildProfile, SnowflakeID } from "@snickerdoodlelabs/objects";
import React, { FC, memo, useState } from "react";

import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import DiscordMediaDataServersItem from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataServersItem";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";

const DiscordMediaDataItem: FC<ILinkedDiscordAccount> = ({
  name,
  servers,
  avatar,
  discriminator,
  userId,
  openUnlinkModal,
  setAccountIdToRemove,
  setAccountNameToRemove,
}: ILinkedDiscordAccount) => {
  const discordImageUrl = "https://cdn.discordapp.com";
  const classes = useStyles();

  const getDiscordAvatar = (): string => {
    return avatar === null
      ? `${discordImageUrl}/embed/avatars/${Number(discriminator) % 5}.png`
      : `${discordImageUrl}/avatars/${userId}/${avatar}.png`;
  };

  const getDiscordGuildRow = (guildProfiles: DiscordGuildProfile[]) => {
    const discordGuildRows: React.ReactElement[] = [];
    for (let i = 0; i < guildProfiles.length; i += 2) {
      if (i + 1 >= guildProfiles.length) {
        discordGuildRows.push(
          <Box className={classes.discordGuildsContainerRow}>
            <DiscordMediaDataServersItem server={guildProfiles[i]} />
          </Box>,
        );
      } else {
        discordGuildRows.push(
          <Box className={classes.discordGuildsContainerRow}>
            <DiscordMediaDataServersItem server={guildProfiles[i]} />
            <DiscordMediaDataServersItem server={guildProfiles[i + 1]} />
          </Box>,
        );
      }
    }
    return discordGuildRows;
  };

  return (
    <Box className={classes.discordMediaItemProviderContainer}>
      <Box className={classes.discordMediaItemLinkedAccountContainer}>
        <Box>
          <img className={classes.discordIcon} src={getDiscordAvatar()} />
        </Box>
        <Box>
          <p className={classes.providerText}>{`${name}#${discriminator}`}</p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            onClick={() => {
              setAccountNameToRemove(`${name}#${discriminator}`);
              setAccountIdToRemove(userId);
              openUnlinkModal(true);
            }}
            className={classes.unlinkAccountButton}
          >
            Unlink Account
          </Button>
        </Box>
      </Box>
      <Box>
        <p className={classes.serversText}>Servers</p>
      </Box>

      <Box className={classes.discordGuildsContainerRow}>
        {getDiscordGuildRow(servers)}
      </Box>
    </Box>
  );
};

export default memo(DiscordMediaDataItem);
