import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaData.style";
import { Box, Typography } from "@material-ui/core";
import React from "react";
import { ESocialMediaProviderKeys } from "@extension-onboarding/constants";
import DiscordMediaData from "@extension-onboarding/pages/Details/screens/SocialMediaData/SocialMediaDataItem";
import { IDiscordDataProvider, ISocialMediaDataProvider } from "@extension-onboarding/services/socialMediaDataProviders/interfaces";

interface ISocialMediaDataItemProps {
  name: string;
  icon: string;
  key: ESocialMediaProviderKeys;
}

export default () => {
  const classes = useStyles();
  const {socialMediaProviderList} = useAppContext();

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
    <>
      <Box mb={2}>
        <Box display="flex" mb={1} alignItems="center">
          <Typography className={classes.title}>Social Media Data</Typography>
        </Box>
        {socialMediaProviderList.map(({ icon, name, key }) => (
          <Box mt={2} mb={2} key={key}>
            {getSocialMediaComponentGivenProps({ icon, name, key })}
          </Box>
        ))}
      </Box>
    </>
  );
};
