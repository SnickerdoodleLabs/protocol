import { Box } from "@material-ui/core";
import { Radio } from "@snickerdoodlelabs/shared-components";
import React, { FC, useMemo } from "react";

import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import Typography from "@extension-onboarding/components/Typography/Typography";
import {
  ISdlDataWalletProxy,
  IWindowWithSdlDataWallet,
} from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";

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
        <img src={snickerDoodleLogo} />
        <Box mt={1} mb={1}>
          <Typography variant="pageTitle">Welcome to Snickerdoodle</Typography>
        </Box>
        <Typography variant="pageDescription">
          Multiple extensions installed in your browser are using snickerdoodle
          protocol.
          <br /> Please select a provider you want to continue with.
        </Typography>
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
              <Typography variant="pageDescription">{provider.name}</Typography>
            </Box>
          ))}
        </Box>
        <Box display="flex" alignItems="center">
          <Radio />
          <Box>
            <Typography>Remember my choice.</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ProviderSelector;
