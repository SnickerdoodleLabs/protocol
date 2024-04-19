import { SDLogoCircle } from "@extension-onboarding/assets";
import {
  ISdlDataWalletProxy,
  IWindowWithSdlDataWallet,
} from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import Box from "@material-ui/core/Box";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo } from "react";

declare const window: IWindowWithSdlDataWallet;

interface IProviderSelectorProps {
  onProviderSelect: (provider: ISdlDataWalletProxy) => void;
}
const ProviderSelector: FC<IProviderSelectorProps> = ({ onProviderSelect }) => {
  const providerList = useMemo(() => {
    // actually there is no master provider
    // let's just assume the first injected provider is the master provider
    const masterProvider = window.sdlDataWallet;
    const subProviders = masterProvider.providers;
    return [masterProvider, ...(subProviders || [])];
  }, []);
  return (
    <Box display="flex" height="100vh">
      <Box>
        <SDLogoCircle />
        <Box mt={1} mb={1}>
          <SDTypography variant="titleXl">
            Welcome to Snickerdoodle
          </SDTypography>
        </Box>
        <SDTypography variant="titleSm">
          Multiple extensions installed in your browser are using snickerdoodle
          protocol.
          <br /> Please select a provider you want to continue with.
        </SDTypography>
        <Box mt={2}>
          {providerList.map((provider) => (
            <Box
              px={3}
              py={1}
              mb={1}
              mr={2}
              component="button"
              border="none"
              bgcolor="rgb(218, 216, 233)"
              borderRadius={4}
              key={provider.extensionId}
              onClick={() => {
                onProviderSelect(provider);
              }}
            >
              <SDTypography variant="bodyLg">{provider.name}</SDTypography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderSelector;
