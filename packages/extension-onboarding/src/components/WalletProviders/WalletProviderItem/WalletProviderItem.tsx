import { Button, Box } from "@material-ui/core";
import React, { useMemo, FC, memo } from "react";

import tickIcon from "@extension-onboarding/assets/icons/tick.svg";
import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviderItem/WalletProviderItem.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { IProvider } from "@extension-onboarding/services/blockChainWalletProviders";

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

  return (
    <Box className={classes.accountBoxContainer}>
      <Box className={classes.providerContainer}>
        <Box>
          <img className={classes.providerLogo} src={provider.icon} />
        </Box>
        <Box>
          <p className={classes.providerText}>{provider.name}</p>
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
