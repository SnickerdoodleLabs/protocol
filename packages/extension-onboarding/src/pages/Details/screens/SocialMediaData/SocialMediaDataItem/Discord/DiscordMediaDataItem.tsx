import { Button, Box, Grid, Avatar, Typography } from "@material-ui/core";
import { DiscordGuildProfile } from "@snickerdoodlelabs/objects";
import React, { FC, memo } from "react";

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
    <Grid
      container
      direction="row"
      className={classes.discordMediaItemProviderContainer}
    >
      <Grid
        item
        xs={12}
        container
        direction="row"
        className={classes.discordMediaItemLinkedAccountContainer}
      >
        <Grid item xs={10}>
          <Box display="flex" alignItems="center">
            <Avatar>
              <img alt="Natacha" src={getDiscordAvatar()} height={40} />
            </Avatar>
            <Typography
              variant="body1"
              className={classes.providerText}
            >{`${name}#${discriminator}`}</Typography>
          </Box>
        </Grid>
        <Grid item xs={2}>
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
        </Grid>
      </Grid>
      <Grid item container>
        <Grid item xs={12}>
          <Box
            display="flex"
            alignItems="center"
            className={classes.serversTextBox}
          >
            {servers ? (
              <Typography variant="h5" className={classes.serversText}>
                Servers
              </Typography>
            ) : (
              <p></p>
            )}
          </Box>
        </Grid>
        <Grid item className={classes.discordGuildRow}>
          {getDiscordGuildRow(servers)}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default memo(DiscordMediaDataItem);
