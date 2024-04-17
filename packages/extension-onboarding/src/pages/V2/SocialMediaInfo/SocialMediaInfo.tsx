import { useAppContext } from "@extension-onboarding/context/App";
import { DiscordInfo } from "@extension-onboarding/pages/V2/SocialMediaInfo/Platforms";
import Box from "@material-ui/core/Box";
import { ESocialType } from "@snickerdoodlelabs/objects";
import React from "react";

interface ISocialMediaInfoProps {
  name: string;
  icon: string;
  key: ESocialType;
}

export default () => {
  const { socialMediaProviderList } = useAppContext();

  const getSocialMediaComponentGivenProps = ({
    name,
    icon,
    key,
  }: ISocialMediaInfoProps) => {
    switch (key) {
      case ESocialType.DISCORD:
        return <DiscordInfo name={name} icon={icon} />;
      default:
        return null;
    }
  };

  return (
    <Box>
      {socialMediaProviderList.map(({ icon, name, key }) => (
        <Box key={key}>
          {getSocialMediaComponentGivenProps({ icon, name, key })}
        </Box>
      ))}
    </Box>
  );
};
