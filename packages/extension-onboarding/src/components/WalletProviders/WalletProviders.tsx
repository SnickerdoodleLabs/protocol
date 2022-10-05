import WalletProviderItem from "@extension-onboarding/components/WalletProviders/WalletProviderItem";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviders.style";
import { EWalletProviderKeys } from "@extension-onboarding/constants";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box, Typography } from "@material-ui/core";
import React, { FC, memo } from "react";

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
      {!!detectedProviders.length && (
        <Typography className={classes.sectionTitle}>Your Wallets</Typography>
      )}
      {detectedProviders.map((provider) => (
        <Box mt={2} mb={2} key={provider.key}>
          <WalletProviderItem
            onConnectClick={() => {
              onProviderConnectClick(provider);
            }}
            provider={provider}
          />
          {/* {provider.key === EWalletProviderKeys.PHANTOM && (
            <Box mt={2} mb={5}>
              <Typography className={classes.phantomSteps}>
                Steps to add multiple Phantom account
              </Typography>
            </Box>
          )} */}
        </Box>
      ))}
      {!!unDetectedProviders.length && (
        <Typography className={classes.sectionTitle}>
          {`${!!detectedProviders.length ? "Other " : ""}Supported Wallets`}
        </Typography>
      )}
      {unDetectedProviders.map((provider) => (
        <Box mt={2} key={provider.key}>
          <WalletProviderItem
            onConnectClick={() => {
              window.open(provider.installationUrl, "_blank");
            }}
            provider={provider}
          />
        </Box>
      ))}
      {walletConnect && (
        <Box mt={2}>
          <Typography className={classes.sectionTitle}>
            Connect Your Wallets From Your Mobile Devices
          </Typography>
          <Box mt={2}>
            <WalletProviderItem
              onConnectClick={() => {
                onProviderConnectClick(walletConnect);
              }}
              provider={walletConnect}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default memo(WalletProviders);
