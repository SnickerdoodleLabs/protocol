import { Button, Box, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";
import metamaskLogo from "@extension-onboarding/assets/icons/metamaskSmall.svg";
import phantomLogo from "@extension-onboarding/assets/icons/phantomSmall.svg";
import coinbaseLogo from "@extension-onboarding/assets/icons/coinbaseSmall.svg";
import walletConnectLogo from "@extension-onboarding/assets/icons/walletConnectSmall.svg";
import greenTick from "@extension-onboarding/assets/icons/greenTickCircle.svg";
import { IProvider } from "@extension-onboarding/services/providers";
import { useAppContext } from "@extension-onboarding/Context/App";
import { useStyles } from "@extension-onboarding/components/WalletProviderCard/WalletProviderCard.style";

export interface ISDLDataWallet {
  // TODO add SDLWallet functions with correct types
  getUnlockMessage(): any;
}

declare global {
  interface Window {
    sdlDataWallet: ISDLDataWallet;
  }
}

interface IWalletProviderCardProps {
  provider: IProvider;
}

const WalletProviderCard: FC<IWalletProviderCardProps> = ({
  provider,
}: IWalletProviderCardProps) => {
  const { linkedAccounts, addAccount } = useAppContext();

  const classes = useStyles();

  const onClickConnect = (providerObj: IProvider) => {
    if (!providerObj.provider.isInstalled) {
      return window.open(providerObj.installationUrl, "_blank");
    }

    return providerObj.provider.connect().andThen((account) => {
      return window.sdlDataWallet.getUnlockMessage().andThen((message) => {
        return providerObj.provider.getSignature(message).map((signature) => {
          if (
            !linkedAccounts?.find(
              (linkedAccount) => linkedAccount.accountAddress === account,
            )
          ) {
            addAccount({
              key: provider.key,
              accountAddress: account,
              name: provider.name,
            });
          }
        });
      });
    });
  };

  const accountCount = useMemo(() => {
    return linkedAccounts.reduce((acc, value) => {
      if (value.key === provider.key) {
        return (acc = acc + 1);
      }
      return acc;
    }, 0);
  }, [JSON.stringify(linkedAccounts)]);

  return (
    <Box className={classes.accountBoxContainer}>
      <Box className={classes.providerContainer}>
        <Box>
          <img className={classes.providerLogo} src={provider.icon} />
          {!!accountCount && (
            <img className={classes.greenTick} src={greenTick} />
          )}
        </Box>
        <Box>
          <p className={classes.providerText}>{provider.name}</p>
        </Box>

        <Box>
          <p className={classes.linkedText}>
            {accountCount ? accountCount : ""}
          </p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            onClick={() => {
              onClickConnect(provider);
            }}
            className={classes.linkAccountButton}
          >
            {provider.provider.isInstalled ? "Install" : "Link Account"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WalletProviderCard;
