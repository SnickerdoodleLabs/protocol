import { Button, Box } from "@material-ui/core";
import React, { FC, memo, useState } from "react";


import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";

import DiscordMediaDataServersItem from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataServersItem";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { DiscordGuildProfile, SnowflakeID } from "@snickerdoodlelabs/objects";

const DiscordMediaDataItem: FC<ILinkedDiscordAccount> = ({
  name,
  servers,
  avatar,
  discriminator,
  userId,
  token,
}: ILinkedDiscordAccount) => {
  const discordImageUrl = "https://cdn.discordapp.com";
  const classes = useStyles();
  const {discordMediaDataProvider : provider} = useAccountLinkingContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const unlinkAccount = () => {
    return provider.unlink(SnowflakeID(userId))
  }

  const getDiscordAvatar =  () : string => {
    return avatar === null
    ? `${discordImageUrl}/embed/avatars/${
        Number(discriminator) % 5
      }.png`
    : `${discordImageUrl}/avatars/${userId}/${avatar}.png` 
  }

  const getDiscordGuildRow = (guildProfiles : DiscordGuildProfile[])  => {
    const discordGuildRows: React.ReactElement[] = [];
    for(let i = 0; i< guildProfiles.length;i+=2){
      if(i+1 >= guildProfiles.length){
        discordGuildRows.push(<Box className={classes.discordGuildsContainerRow}><DiscordMediaDataServersItem server={guildProfiles[i]}/></Box>)
      }else{
        discordGuildRows.push(<Box className={classes.discordGuildsContainerRow}><DiscordMediaDataServersItem server={guildProfiles[i]}/><DiscordMediaDataServersItem server={guildProfiles[i+1]}/></Box>)
      }
    }
    return discordGuildRows;
  }

  return (
    <Box className={classes.discordMediaItemProviderContainer}>
      <Box className={classes.discordMediaItemLinkedAccountContainer}>
        <Box >
          <img
            className={classes.discordIcon}
            src={
             getDiscordAvatar()
            }
          />
        </Box>
        <Box>
          <p className={classes.providerText}>{`${name}#${discriminator}`}</p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            onClick={() => unlinkAccount()}
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
