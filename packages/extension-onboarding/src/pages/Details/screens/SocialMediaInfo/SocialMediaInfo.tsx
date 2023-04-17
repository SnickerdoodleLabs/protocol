import { Box } from "@material-ui/core";
import React from "react";

import { ESocialMediaProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import {
  DiscordInfo,
  TwitterInfo,
} from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/SocialMediaInfo.style";

interface ISocialMediaInfoProps {
  name: string;
  icon: string;
  key: ESocialMediaProviderKeys;
}

export default () => {
  const classes = useStyles();
  const { socialMediaProviderList } = useAppContext();

  const getSocialMediaComponentGivenProps = ({
    name,
    icon,
    key,
  }: ISocialMediaInfoProps) => {
    switch (key) {
      case ESocialMediaProviderKeys.DISCORD:
        return <DiscordInfo name={name} icon={icon} />;
      case ESocialMediaProviderKeys.TWITTER:
        return <TwitterInfo name={name} icon={icon} />;

      default:
        return null;
    }
  };

  return (
    <Box>
      {socialMediaProviderList.map(({ icon, name, key }) => (
        <Box key={key} padding={3}>
          {getSocialMediaComponentGivenProps({ icon, name, key })}
        </Box>
      ))}
    </Box>
  );
};
