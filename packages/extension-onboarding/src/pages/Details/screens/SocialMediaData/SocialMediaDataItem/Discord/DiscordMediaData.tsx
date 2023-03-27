import { Button, Box } from "@material-ui/core";
import React, { useMemo, FC, memo, useState, useEffect } from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/SocialMediaDataItem.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { IDiscordDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { BearerAuthToken, DiscordProfile, Integer, SnowflakeID, UnixTimestamp, URLString } from "@snickerdoodlelabs/objects";

import { ILinkedDiscord, default as DiscordMediaDataItem } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataItem";

interface ISocialMediaDataItemProps {
  provider : IDiscordDataProvider;
  name : string;
  icon : string;
}

interface IDiscordAuthResponse {
  access_token : string,
  token_type : string,
  expires_in : number,
  refresh_token : string,
  scope : string
}



declare const window: IWindowWithSdlDataWallet;

const DiscordMediaData: FC<ISocialMediaDataItemProps> = ({
  provider,
  name,
  icon
}: ISocialMediaDataItemProps) => {
  const { linkedAccounts } = useAppContext();
  const [discordToken , setDiscordToken] = useState<BearerAuthToken>()
  const [discordUrl , setDiscordUrl] = useState<URLString>()

  const [discordProfiles , setDiscordProfiles] = useState<DiscordProfile[]>([])  

  const getInstallationUrl =  () => {
     provider.installationUrl().map( (discordUrl) =>{
      if(discordUrl){
        setDiscordUrl(discordUrl)
      }
      
    })
  }
  const getProfiles = (discordProfiles: DiscordProfile[]) => {
    return discordProfiles.reduce<ILinkedDiscord[]>( (profiles , discordProfile) => {
      provider.getGuildProfiles().map( (guildProfile) => {
        profiles.push({
          name : discordProfile.username,
          servers : guildProfile
        })
      })
      return profiles;
    } , []) 
  }
  

  useEffect(() => {
    if(!discordUrl) return;
    fetch(
      discordUrl,
    ).then((res) => {
      res.json().then((data : IDiscordAuthResponse) => {
        setDiscordToken(BearerAuthToken(data.access_token));
      });
    });
    
  }, [discordUrl]);

  useEffect(() => {
    if(!discordToken) return;
    provider.initializeUser({ discordAuthToken : discordToken}).andThen( () => {
      return provider.getUserProfiles().map( (discordProfiles) => {
        return setDiscordProfiles(discordProfiles);
      })
    })
    
  }, [discordToken]);

  //const discordProfilesCached = useMemo(() => getProfiles(discordProfiles), [discordProfiles]);
  const discordProfilesCached = [{
    name : "Ozan",
    servers : [{
      id : SnowflakeID("test"),
      name : "rider",
      permissions : Integer(1),
      icon : "test",
      isOwner : false,
      joinedAt : UnixTimestamp(Date.now()),
    }]
  }]
  const classes = useStyles();
 
  return (
    <Box className={classes.accountBoxContainer}>
      <Box className={classes.providerContainer}>
        <Box>
          <img className={classes.providerLogo} src={icon} />
        </Box>
        <Box>
          <p className={classes.providerText}>{name}</p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            onClick={() => getInstallationUrl()}
            className={classes.linkAccountButton}
          >
           Link Account
          </Button>
        </Box>
        {discordProfilesCached.map( (discordProfile) => {
          //@ts-ignore
            <DiscordMediaDataItem name={discordProfile.name} servers={discordProfile.servers}   />
        })}
      </Box>
    </Box>
  );
};

export default memo(DiscordMediaData);

