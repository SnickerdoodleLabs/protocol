import { Box, Grid, Typography } from "@material-ui/core";
import React from "react";

import { ESocialMediaProviderKeys } from "@extension-onboarding/constants";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaData.style";
import DiscordMediaData from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem";
import {
  IDiscordDataProvider,
  ISocialMediaDataProvider,
} from "@extension-onboarding/services/socialMediaDataProviders/interfaces";

interface ISocialMediaDataItemProps {
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
  }: ISocialMediaDataItemProps) => {
    switch (key) {
      case ESocialMediaProviderKeys.DISCORD:
        return <DiscordMediaData name={name} icon={icon} />;

      default:
        return null;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        {socialMediaProviderList.map(({ icon, name, key }) => (
          <Box key={key}>
            {getSocialMediaComponentGivenProps({ icon, name, key })}
          </Box>
        ))}
      </Grid>
    </Grid>
  );
};
