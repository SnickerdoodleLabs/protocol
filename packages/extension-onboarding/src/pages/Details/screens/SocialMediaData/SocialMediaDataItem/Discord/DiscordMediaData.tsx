import { Button, Box } from "@material-ui/core";
import React, {
  FC,
  memo,
  useState,
  useEffect,
} from "react";

import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/Discord.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import {
  BearerAuthToken,
  DiscordGuildProfile,
  DiscordProfile,
  SnowflakeID,
} from "@snickerdoodlelabs/objects";

import DiscordMediaDataItem from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/DiscordMediaDataItem";

import {
  ILinkedDiscordAccount,
  ISocialMediaDataItemProps,
  IDiscordAuthResponse,
} from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem/Discord/types";

declare const window: IWindowWithSdlDataWallet;

const DiscordMediaData: FC<ISocialMediaDataItemProps> = ({
  provider,
  name,
  icon,
}: ISocialMediaDataItemProps) => {
  const [requestData , setRequestData] = useState<boolean>();
  const [discordProfiles, setDiscordProfiles] = useState<DiscordProfile[]>([]);
  const [linkedDiscordAccount, setLinkedDiscordAccount] = useState<ILinkedDiscordAccount[]>([]);

  const getGuildProfiles = (discordProfiles: DiscordProfile[]) => {
    provider.getGuildProfiles().map( (guildProfiles) => {
      const profiles = discordProfiles.reduce<ILinkedDiscordAccount[]>(
        (profiles, discordProfile) => {
            profiles.push({
              name: discordProfile.username,
              userId: discordProfile.id,
              avatar: discordProfile.avatar,
              discriminator: discordProfile.discriminator,
              servers: getDiscordUserProfiles(guildProfiles , discordProfile.id),
              token: discordProfile.authToken,
            });
          return profiles;
        },
        [],
      );
      setLinkedDiscordAccount(profiles)
    }) 
  };

  const getDiscordUserProfiles = ( guildProfiles : DiscordGuildProfile[] ,discordProfileId : SnowflakeID ) : DiscordGuildProfile[] => {
    return guildProfiles.filter( (guildProfile) => {  
        return guildProfile.discordUserProfileId === discordProfileId
    })
  }

  //TODO security! , call should be made from a server not on a client ? which we don't have here
  const initializeUser = (code: string) => {
    const options = new URLSearchParams({
      client_id: "1089994449830027344",
      client_secret: "uqIyeAezm9gkqdudoPm9QB-Dec7ZylWQ",
      code,
      grant_type: "authorization_code",
      redirect_uri: "https://localhost:9005/data-dashboard/social-media-data",
      scope: "identify guilds",
    });
    fetch("https://discord.com/api/oauth2/token", {
      method: "POST",
      body: options,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }).then((res) => {
      res.json().then((data: IDiscordAuthResponse) => {
        provider.initializeUser({
          discordAuthToken: BearerAuthToken(data.access_token),
        }).map( () => {
            setRequestData(!requestData)
        });
      });
    });
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const code = queryParams.get("code");
    if (code) {
      initializeUser(code);
    }
  }, [JSON.stringify(window.location.search)]);


  const getUserProfiles =  () => {
    provider.getUserProfiles().map( (discordProfiles) => {
      setDiscordProfiles(discordProfiles)
    })
  };

  useEffect( () => {
    getUserProfiles();
  } , [requestData])

  useEffect( () => {
    if(!discordProfiles) return
    getGuildProfiles(discordProfiles);
  } , [discordProfiles])

  const classes = useStyles();
  return (
    <Box className={classes.accountBoxContainer}>
      <Box className={`${classes.providerContainer} ${classes.mainProvider}`}>
        <Box>
          <img className={classes.providerLogo} src={icon} />
        </Box>
        <Box>
          <p className={classes.providerText}>{name}</p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            className={classes.linkAccountButton}
            href="https://discord.com/oauth2/authorize?response_type=code&client_id=1089994449830027344&scope=identify%20guilds&state=15773059ghq9183habn&redirect_uri=https%3A%2F%2Flocalhost:9005/data-dashboard/social-media-data&prompt=consent"
          >
            Link Account
          </Button>
        </Box>
      </Box>
      {linkedDiscordAccount.map((discordProfile) => {
        return (
          <DiscordMediaDataItem
            token={discordProfile.token}
            name={discordProfile.name}
            servers={discordProfile.servers}
            avatar={discordProfile.avatar}
            discriminator={discordProfile.discriminator}
            userId={discordProfile.userId}
          />
        );
      })}
    </Box>
  );
};

export default memo(DiscordMediaData);
