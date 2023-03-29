import { Button, Box } from "@material-ui/core";
import React, { FC, memo } from "react";

import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import { IDiscordMediaDataServerItem } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";

const DiscordMediaDataItem: FC<IDiscordMediaDataServerItem> = ({
  server
}: IDiscordMediaDataServerItem) => {
  const discordImageUrl = "https://cdn.discordapp.com";
  const classes = useStyles();

  return (
    <Box className={classes.discordMediaItemLinkedAccountContainer}>
        <Box >
        <img
        className={classes.discordGuildIcon}
        src={
            `${discordImageUrl}/icons/${server.id}/${server.icon}.png`
        }
        />
        </Box>
        <Box>
          <p className={classes.providerText}>{server.name}</p>
        </Box>
        <Box>
          <p className={classes.providerText}>{server.isOwner ? "Owner" : "Member"}</p>
        </Box>
    </Box>
  );
};


export default memo(DiscordMediaDataItem);
