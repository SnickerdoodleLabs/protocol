import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC, memo } from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/Discord.style";
import { IDiscordServerItem } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms/Discord/types";

const DiscordServerItem: FC<IDiscordServerItem> = ({
  server,
}: IDiscordServerItem) => {
  const discordImageUrl = "https://cdn.discordapp.com";
  const classes = useStyles();

  const getDiscordGuildIcon = (): string => {
    return `${discordImageUrl}/icons/${server.id}/${server.icon}.png`;
  };

  return (
    <Grid
      container
      xs={6}
      className={classes.discordMediaItemLinkedAccountContainer}
    >
      <Box>
        {server.icon ? (
          <img
            className={classes.discordGuildIcon}
            src={getDiscordGuildIcon()}
          />
        ) : (
          <Box className={classes.discordGuildNoIconContainer}>
            {" "}
            <p className={classes.discordGuildNoIcon}>{server.name[0]}</p>{" "}
          </Box>
        )}
      </Box>
      <Box className={classes.discordGuildNoIconContainer}>
        <Typography variant="h5" className={classes.discordGuildName}>
          {server.name}
        </Typography>

        <Typography variant="body1" className={classes.discordGuildMemberText}>
          {server.isOwner ? "Owner" : "Member"}
        </Typography>
      </Box>
    </Grid>
  );
};

export default memo(DiscordServerItem);
