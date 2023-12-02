import ProviderItem from "@extension-onboarding/components/v2/WalletProviderItem";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box, Grid } from "@material-ui/core";
import { CardTitle, Card } from "@snickerdoodlelabs/shared-components";
import React from "react";

const Wallets = () => {
  const {
    detectedProviders,
    unDetectedProviders,
    onProviderConnectClick,
    onWalletKitConnectClick,
    walletKits,
  } = useAccountLinkingContext();
  return (
    <Card>
      <CardTitle
        title="Supported Web3 Wallets"
        subtitle="Add a new web3 account to your data profile."
      />
      <Box mt={3} />
      <Grid container spacing={2}>
        {detectedProviders.map((provider, index) => (
          <ProviderItem
            key={`d.${index}`}
            label={provider.name}
            icon={provider.icon}
            onClick={() => {
              onProviderConnectClick(provider);
            }}
          />
        ))}
        {walletKits.map((walletKit, index) => (
          <ProviderItem
            key={`wk.${index}`}
            label={walletKit.label}
            icon={walletKit.icon}
            onClick={() => {
              onWalletKitConnectClick(walletKit.key);
            }}
          />
        ))}
        {unDetectedProviders.map((provider, index) => (
          <ProviderItem
            key={`ud.${index}`}
            label={provider.name}
            icon={provider.icon}
            onClick={() => {
              window.open(provider.installationUrl, "_blank");
            }}
            buttonText="Install"
          />
        ))}
      </Grid>
    </Card>
  );
};

export default Wallets;
