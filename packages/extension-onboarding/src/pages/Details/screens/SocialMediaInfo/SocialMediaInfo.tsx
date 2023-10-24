import { Box } from "@material-ui/core";
import { ESocialType } from "@snickerdoodlelabs/objects";
import React from "react";

import UnauthScreen from "@extension-onboarding/components/UnauthScreen/UnauthScreen";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import {
  DiscordInfo,
  TwitterInfo,
} from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/SocialMediaInfo.style";

interface ISocialMediaInfoProps {
  name: string;
  icon: string;
  key: ESocialType;
}

export default () => {
  const classes = useStyles();
  const { socialMediaProviderList, appMode } = useAppContext();

  const getSocialMediaComponentGivenProps = ({
    name,
    icon,
    key,
  }: ISocialMediaInfoProps) => {
    switch (key) {
      case ESocialType.DISCORD:
        return <DiscordInfo name={name} icon={icon} />;
      // case ESocialType.TWITTER:
      //   return <TwitterInfo name={name} icon={icon} />;

      default:
        return null;
    }
  };

  if (appMode != EAppModes.AUTH_USER) {
    return <UnauthScreen />;
  }

  return (
    <Box>
      {socialMediaProviderList.map(({ icon, name, key }) => (
        <Box key={key} >
          {getSocialMediaComponentGivenProps({ icon, name, key })}
        </Box>
      ))}
    </Box>
  );
};
