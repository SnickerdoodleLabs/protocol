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
      <Box
        mt={4}
        style={{ cursor: "pointer" }}
        id="account-linking"
        onClick={(e) => handleClick(e)}
        borderRadius={12}
        p={3}
        borderColor="borderColor"
        border="1px solid"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <SDTypography variant="bodyLg" fontWeight="bold">
          Connect Wallet
        </SDTypography>
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
      </Box>
      {linkedAccounts.length > 0 && <Box mt={4} />}
      {linkedAccounts.map((account) => (
        <Fragment key={account.sourceAccountAddress}>
          <LinkedAccountItem account={account} />
          {linkedAccounts.indexOf(account) !== linkedAccounts.length - 1 && (
            <Box mt={3} />
          )}
        </Fragment>
      ))}
      <Box display="flex">
        {/* <SDButton id="account-linking" onClick={handleClick} variant="outlined">
          Connect Wallet
        </SDButton> */}
        <Menu
          elevation={0}
          getContentAnchorEl={null}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          anchorEl={anchorEl}
          open={anchorEl?.id === "account-linking"}
          onClose={handleClose}
          PaperProps={{
            style: {
              borderRadius: 4,
              boxShadow:
                "0px 2px 6px 2px rgba(0, 0, 0, 0.15), 0px 1px 2px 0px rgba(0, 0, 0, 0.30)",
            },
          }}
          MenuListProps={{
            style: {
              width: anchorEl?.offsetWidth ?? lastWidth.current,
            },
          }}
          style={{
            marginTop: 16,
          }}
        >
          {detectedProviders.map((provider) => (
            <MenuItem
              key={provider.name}
              onClick={() => {
                onProviderConnectClick(provider);
                handleClose();
              }}
            >
              <Box display="flex" py={1} gridGap={12} alignItems="center">
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
              <Box display="flex" py={1} gridGap={12} alignItems="center">
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
              <Box display="flex" py={1} gridGap={12} alignItems="center">
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
