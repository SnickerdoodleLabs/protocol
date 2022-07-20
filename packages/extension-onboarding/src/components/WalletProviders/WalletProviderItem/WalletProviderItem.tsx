import { Button, Box } from "@material-ui/core";
import React, { useMemo, FC, memo } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviderItem/WalletProviderItem.style";
import { useAppContext } from "@extension-onboarding/Context/App";
import { IProvider } from "@extension-onboarding/services/providers";

export interface ISDLDataWallet {
  // TODO add SDLWallet functions with correct types
  getUnlockMessage(): any;
}

declare global {
  interface Window {
    sdlDataWallet: ISDLDataWallet;
  }
}

interface IWalletProviderItemProps {
  provider: IProvider;
  onConnectClick: () => void;
}

const WalletProviderItem: FC<IWalletProviderItemProps> = ({
  provider,
  onConnectClick,
}: IWalletProviderItemProps) => {
  const { linkedAccounts } = useAppContext();

  const classes = useStyles();

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
            {accountCount > 0 &&
              `${accountCount}  account${accountCount !== 1 ? "s" : ""} linked`}
          </p>
        </Box>

        <Box className={classes.linkAccountContainer}>
          <Button
            onClick={onConnectClick}
            className={classes.linkAccountButton}
          >
            {!provider.provider.isInstalled ? "Install" : "Link Account"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(WalletProviderItem);
