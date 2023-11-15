import { Box } from "@material-ui/core";
import { ECoreProxyType } from "@snickerdoodlelabs/objects";
import React from "react";

import UnauthScreen from "@extension-onboarding/components/v2/UnauthScreen";
import { EAppModes, useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import { EShoppingDataType } from "@extension-onboarding/objects";
import IFrameComponent from "@extension-onboarding/pages/Details/screens/ShoppingData/Components";
import { Amazon } from "@extension-onboarding/pages/Details/screens/ShoppingData/Platforms/Amazon/Amazon";

interface IShoppingDataProps {
  name: string;
  icon: string;
  key: EShoppingDataType;
}

export default () => {
  const { shoppingDataProviderList, appMode } = useAppContext();

  const { sdlDataWallet } = useDataWalletContext();

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
      {sdlDataWallet.proxyType === ECoreProxyType.IFRAME_INJECTED ? (
        <IFrameComponent />
      ) : (
        shoppingDataProviderList.map(({ icon, name, key }) => (
          <Box key={key} padding={3}>
            {getShoppingDataComponentGivenProps({ icon, name, key })}
          </Box>
        ))
      )}
    </Box>
  );
};
