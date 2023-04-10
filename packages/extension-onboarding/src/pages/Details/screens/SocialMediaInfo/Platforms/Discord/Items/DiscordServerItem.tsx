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
    <Box display="flex" alignItems="center">
      <Box mr={2}>
        {server.icon ? (
          <img
            className={classes.discordGuildImg}
            src={getDiscordGuildIcon()}
          />
        ) : (
          <Box
            bgcolor="#000"
            alignItems="center"
            justifyContent="center"
            width={57}
            height={57}
          >
            <Typography className={classes.guildIconPlaceholder}>
              {server.name[0]}
            </Typography>
          </Box>
        )}
      </Box>
      <Box>
        <Box mb={0.5}>
          <Typography className={classes.discordGuildName}>
            {server.name}
          </Typography>
        </Box>
        <Typography className={classes.discordGuildMemberText}>
          {server.isOwner ? "Owner" : "Member"}
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(DiscordServerItem);
