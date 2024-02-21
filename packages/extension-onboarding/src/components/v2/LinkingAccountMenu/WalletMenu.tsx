import LinkingAccountMenu from "@extension-onboarding/components/v2/LinkingAccountMenu/LinkingAccountMenu";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { Box } from "@material-ui/core";
import { SDTypography } from "@snickerdoodlelabs/shared-components";
import React from "react";
export const WalletMenu = () => {
  const {
    detectedProviders,
    unDetectedProviders,
    walletKits,
    onProviderConnectClick,
    onWalletKitConnectClick,
  } = useAccountLinkingContext();

  const getItem = (icon, name, action: string) => (
    <Box display="flex" py={1} gridGap={12} alignItems="center">
      <img src={icon} width={24} height={24} />
      <SDTypography variant="bodyLg" fontWeight="bold">
        {`${action} ${name}`}
      </SDTypography>
    </Box>
  );

  return (
    <LinkingAccountMenu
      title="Connect Wallet"
      leftRender={
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gridGap={10}
        >
          {[detectedProviders, unDetectedProviders, walletKits]
            .flat()
            .map((item) => (
              <img key={item.key} width={40} height={40} src={item.icon} />
            ))}
        </Box>
      }
      menuItems={[
        ...detectedProviders.map((provider) => ({
          render: getItem(provider.icon, provider.name, "Connect"),
          onClick: () => {
            onProviderConnectClick(provider);
          },
        })),
        ...unDetectedProviders.map((provider) => ({
          render: getItem(provider.icon, provider.name, "Install"),
          onClick: () => {
            window.open(provider.installationUrl, "_blank");
          },
        })),
        ...walletKits.map((wallet) => ({
          render: getItem(wallet.icon, wallet.label, "Connect"),
          onClick: () => {
            onWalletKitConnectClick(wallet.key);
          },
        })),
      ]}
    />
  );
};
