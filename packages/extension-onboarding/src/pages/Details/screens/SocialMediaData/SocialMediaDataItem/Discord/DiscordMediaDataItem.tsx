import { Button, Box } from "@material-ui/core";
import React, { FC, memo } from "react";


import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import { ILinkedDiscordAccount } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";


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
    <Box className={classes.providerContainer}>
      <Box>
        <img
          className={classes.providerLogo}
          style={{height : "32px" , width : "32px"}}
          src={
            avatar === null
              ? `${discordImageUrl}/embed/avatars/${Number(discriminator) % 5}.png`
              : `${discordImageUrl}/avatars/${userId}/${avatar}.png`
          }
        />
      </Box>
      <Box>
        <p className={classes.providerText}>{name}</p>
      </Box>

      <Box className={classes.linkAccountContainer}>
        <Button
          //onClick={() => getInstallationUrl()}
          className={classes.linkAccountButton}
        >
          Unlink Account
        </Button>
      </Box>
    </Box>
  );
};

export default memo(DiscordMediaDataItem);
