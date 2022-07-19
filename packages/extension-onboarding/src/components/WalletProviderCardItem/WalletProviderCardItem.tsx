import { Button, Box, makeStyles } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/WalletProviderCardItem/WalletProviderCardItem.style";
import { useAppContext } from "@extension-onboarding/Context/App";
import { IProvider } from "@extension-onboarding/services/providers";
import { useLayoutContext } from "@extension-onboarding/Context/LayoutContext";
import { EAlertSeverity } from "@extension-onboarding/components/CustomizedAlert";
import { ALERT_MESSAGES } from "@extension-onboarding/constants";

export interface ISDLDataWallet {
  // TODO add SDLWallet functions with correct types
  getUnlockMessage(): any;
}

declare global {
  interface Window {
    sdlDataWallet: ISDLDataWallet;
  }
}

interface IWalletProviderCardItemProps {
  provider: IProvider;
}

const WalletProviderCardItem: FC<IWalletProviderCardItemProps> = ({
  provider,
}: IWalletProviderCardItemProps) => {
  const { linkedAccounts, addAccount } = useAppContext();
  const { setAlert } = useLayoutContext();

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
            setAlert({
              message: ALERT_MESSAGES.ACCOUNT_ADDED,
              severity: EAlertSeverity.SUCCESS,
            });
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
            <img className={classes.greenTick} src={tickIcon} />
          )}
        </Box>
        <Box>
          <p className={classes.providerText}>{provider.name}</p>
        </Box>

        <Box>
          <p className={classes.linkedText}>
            {accountCount ? accountCount + " accounts linked" : ""}
          </p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            onClick={() => {
              onClickConnect(provider);
            }}
            className={classes.linkAccountButton}
          >
            {!provider.provider.isInstalled ? "Install" : "Link Account"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default WalletProviderCardItem;
