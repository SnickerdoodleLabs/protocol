import { Button, Box } from "@material-ui/core";
import React, { FC, memo } from "react";

import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";

import DiscordMediaDataServersItem from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataServersItem";

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

  return (
    <Box className={classes.discordMediaItemProviderContainer}>
      <Box className={classes.discordMediaItemLinkedAccountContainer}>
        <Box >
          <img
            className={classes.discordIcon}
            src={
              avatar === null
                ? `${discordImageUrl}/embed/avatars/${
                    Number(discriminator) % 5
                  }.png`
                : `${discordImageUrl}/avatars/${userId}/${avatar}.png`
            }
          />
        </Box>
        <Box>
          <p className={classes.providerText}>{`${name}#${discriminator}`}</p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            //onClick={() => unlinkAccount()}
            className={classes.unlinkAccountButton}
          >
            Unlink Account
          </Button>
        </Box>
      </Box>
      <Box>
        <p className={classes.providerText}>Servers</p>
        {servers.map( (server) => {
          return (<DiscordMediaDataServersItem server={server}/>)
        })}
      </Box>
    </Box>
  );
};

export default memo(DiscordMediaDataItem);
