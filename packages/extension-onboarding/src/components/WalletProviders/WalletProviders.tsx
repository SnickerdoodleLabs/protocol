import { Box, Typography, Grid } from "@material-ui/core";
import React, { FC, memo } from "react";

import WalletProviderItem from "@extension-onboarding/components/WalletProviders/WalletProviderItem";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviders.style";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";

const WalletProviders: FC = () => {
  const classes = useStyles();
  const {
    detectedProviders,
    unDetectedProviders,
    walletConnect,
    onProviderConnectClick,
  } = useAccountLinkingContext();

  return (
    <Box>
      <Box mb={2} mt={5}>
        <Typography className={classes.sectionTitle}>Wallets</Typography>
      </Box>
      <Grid container spacing={3}>
        {detectedProviders.map((provider) => (
          <Grid item xs={3} key={provider.key}>
            <WalletProviderItem
              onConnectClick={() => {
                onProviderConnectClick(provider);
              }}
              provider={provider}
            />
          </Grid>
        ))}
        {unDetectedProviders.map((provider) => (
          <Grid item xs={3} key={provider.key}>
            <WalletProviderItem
              onConnectClick={() => {
                window.open(provider.installationUrl, "_blank");
              }}
              provider={provider}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default memo(WalletProviders);
