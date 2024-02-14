import Card from "@extension-onboarding/components/v2/Card";
import CardTitle from "@extension-onboarding/components/v2/CardTitle";
import LinkedAccountItem from "@extension-onboarding/components/v2/LinkedAccountItem";
import { useAccountLinkingContext } from "@extension-onboarding/context/AccountLinkingContext";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Menu, MenuItem } from "@material-ui/core";
import { SDButton, SDTypography } from "@snickerdoodlelabs/shared-components";
import React, { Fragment, useEffect, useRef, useState } from "react";
const WalletLinking = () => {
  const { linkedAccounts, setLinkerModalOpen } = useAppContext();
  const {
    detectedProviders,
    unDetectedProviders,
    walletKits,
    onProviderConnectClick,
    onWalletKitConnectClick,
  } = useAccountLinkingContext();
  const lastWidth = useRef<number>();

  const [anchorEl, setAnchorEl] = useState<(EventTarget & HTMLElement) | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (anchorEl) {
      const width = anchorEl.offsetWidth;
      if (lastWidth.current !== width) {
        lastWidth.current = width;
      }
    }
  }, [anchorEl]);
  return (
    <Card>
      <CardTitle
        title="Wallets"
        subtitle="Anonymize your wallets and share data sets including Token Balances, NFT Holdings, and dApp usage."
        titleVariant="headlineMd"
        subtitleVariant="bodyLg"
      />
      {linkedAccounts.length > 0 && <Box mt={4} />}
      {linkedAccounts.map((account) => (
        <Fragment key={account.sourceAccountAddress}>
          <LinkedAccountItem account={account} />
          {linkedAccounts.indexOf(account) !== linkedAccounts.length - 1 && (
            <Box mt={3} />
          )}
        </Fragment>
      ))}
      <Box display="flex" mt={4}>
        <SDButton id="account-linking" onClick={handleClick} variant="outlined">
          Connect Wallet
        </SDButton>
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorEl={anchorEl}
          open={anchorEl?.id === "account-linking"}
          onClose={handleClose}
        >
          {detectedProviders.map((provider) => (
            <MenuItem
              key={provider.name}
              onClick={() => {
                onProviderConnectClick(provider);
                handleClose();
              }}
            >
              <Box display="flex" gridGap={16} alignItems="center">
                <img src={provider.icon} width={24} height={24} />
                <SDTypography variant="bodyLg" fontWeight="bold">
                  Connect {provider.name}
                </SDTypography>
              </Box>
            </MenuItem>
          ))}
          {unDetectedProviders.map((provider) => (
            <MenuItem
              key={provider.name}
              onClick={() => {
                window.open(provider.installationUrl, "_blank");
                handleClose();
              }}
            >
              <Box display="flex" gridGap={16} alignItems="center">
                <img src={provider.icon} width={24} height={24} />
                <SDTypography variant="bodyLg" fontWeight="bold">
                  Install {provider.name}
                </SDTypography>
              </Box>
            </MenuItem>
          ))}
          {walletKits.map((wallet) => (
            <MenuItem
              key={wallet.key}
              onClick={() => {
                onWalletKitConnectClick(wallet.key);
                handleClose();
              }}
            >
              <Box display="flex" gridGap={16} alignItems="center">
                <img src={wallet.icon} width={24} height={24} />
                <SDTypography variant="bodyLg" fontWeight="bold">
                  Connect {wallet.label}
                </SDTypography>
              </Box>
            </MenuItem>
          ))}
        </Menu>
      </Box>
    </Card>
  );
};

export default WalletLinking;
