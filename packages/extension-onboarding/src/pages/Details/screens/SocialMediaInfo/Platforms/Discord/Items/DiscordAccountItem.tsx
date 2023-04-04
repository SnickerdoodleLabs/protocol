import { Box, Button } from "@material-ui/core";
import React, { FC, memo } from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Discord.style";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/types";

import DiscordMediaDataServersItem from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Items/DiscordServerItem";
import { DiscordGuildProfile } from "@snickerdoodlelabs/objects";

const DiscordAccountItem: FC<ILinkedDiscordAccount> = ({
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

export default memo(DiscordAccountItem);
