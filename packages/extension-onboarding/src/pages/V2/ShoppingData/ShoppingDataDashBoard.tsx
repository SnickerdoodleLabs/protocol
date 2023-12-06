import { Box } from "@material-ui/core";
import { ECoreProxyType, EKnownDomains } from "@snickerdoodlelabs/objects";
import React from "react";

import { useAppContext } from "@extension-onboarding/context/App";
import { useDataWalletContext } from "@extension-onboarding/context/DataWalletContext";
import IFrameComponent from "@extension-onboarding/pages/V2/ShoppingData/Components";
import { Amazon } from "@extension-onboarding/pages/V2/ShoppingData/Platforms/Amazon/Amazon";

interface IShoppingDataProps {
  name: string;
  icon: string;
  key: EKnownDomains;
}

export default () => {
  const { shoppingDataProviderList } = useAppContext();

  const { sdlDataWallet } = useDataWalletContext();

  const getShoppingDataComponentGivenProps = ({
    name,
    icon,
    key,
  }: IShoppingDataProps) => {
    switch (key) {
      case EKnownDomains.Amazon:
        return <Amazon name={name} icon={icon} />;

      default:
        return null;
    }
  };

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
