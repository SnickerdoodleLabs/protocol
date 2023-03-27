import { Button, Box } from "@material-ui/core";
import React, { useMemo, FC, memo, useState, useEffect } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";

import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/SocialMediaDataItem.style";
import { ISocialMediaProvider } from "@extension-onboarding/services/socialMediaDataProviders";
import { IDiscordDataProvider, ISocialMediaDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { BearerAuthToken, DiscordGuildProfile, DiscordProfile, URLString, Username } from "@snickerdoodlelabs/objects";

export interface ILinkedDiscord {
    name : string,
    servers : DiscordGuildProfile[]
  }

declare const window: IWindowWithSdlDataWallet;

const DiscordMediaDataItem: FC<ILinkedDiscord> = ({
  name,
  servers,
}: ILinkedDiscord) => {
  const { linkedAccounts } = useAppContext();


const classes = useStyles()

  return (
    <Box className={classes.providerContainer}>
        <Box>
          <img className={classes.providerLogo} src={servers[0].icon!} />
        </Box>
        <Box>
          <p className={classes.providerText}>{name}</p>
        </Box>
    </Box>
   
  );
};

export default memo(DiscordMediaDataItem);

