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

  const getDiscordGuildIcon =  () : string => {
    return `${discordImageUrl}/icons/${server.id}/${server.icon}.png` 
  }

  return (
    
    <Box className={classes.discordMediaItemLinkedAccountContainer}>
        <Box >
        {  server.icon ? <img
        className={classes.discordGuildIcon}
        src={
          getDiscordGuildIcon()
        }
        /> :<Box className={classes.discordGuildNoIconContainer} > <p className={classes.discordGuildNoIcon} >{server.name[0]}</p> </Box>}
        </Box>
        <Box className={classes.discordGuildNoIconContainer}>
          <p className={classes.discordGuildName}>{server.name}</p>
       
          <p className={classes.discordGuildMemberText}>{server.isOwner ? "Owner" : "Member"}</p>
        </Box>
        
    </Box>
  );
};


export default memo(DiscordMediaDataItem);
