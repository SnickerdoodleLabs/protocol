import { Box } from "@material-ui/core";
import { ESocialType } from "@snickerdoodlelabs/objects";
import React from "react";

import { Amazon } from "./Platforms";

import UnauthScreen from "@extension-onboarding/components/UnauthScreen/UnauthScreen";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { EShoppingDataType } from "@extension-onboarding/objects/enums/EShoppingDataType";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/ShoppingDataDashBoard.style";
import {
  DiscordInfo,
  TwitterInfo,
} from "@extension-onboarding/pages/Details/screens/SocialMediaInfo/Platforms";

interface IShoppingDataProps {
  name: string;
  icon: string;
  key: EShoppingDataType;
}

export default () => {
  const classes = useStyles();
  const { shoppingDataProviderList, appMode } = useAppContext();

  const getShoppingDataComponentGivenProps = ({
    name,
    icon,
    key,
  }: IShoppingDataProps) => {
    switch (key) {
      case EShoppingDataType.AMAZON:
        return <Amazon name={name} icon={icon} />;

      default:
        return null;
    }
  };

  if (appMode != EAppModes.AUTH_USER) {
    return <UnauthScreen />;
  }

  return (
    <Box>
      {shoppingDataProviderList.map(({ icon, name, key }) => (
        <Box key={key} padding={3}>
          {getShoppingDataComponentGivenProps({ icon, name, key })}
        </Box>
      ))}
    </Box>
  );
};
