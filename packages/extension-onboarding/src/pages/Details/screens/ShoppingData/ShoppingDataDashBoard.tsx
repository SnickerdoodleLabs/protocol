import { Box } from "@material-ui/core";
import React from "react";

import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { EShoppingDataType } from "@extension-onboarding/objects";
import { Amazon } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon";
import { useStyles } from "@extension-onboarding/pages/Details/screens/ShoppingData/ShoppingDataDashBoard.style";

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
