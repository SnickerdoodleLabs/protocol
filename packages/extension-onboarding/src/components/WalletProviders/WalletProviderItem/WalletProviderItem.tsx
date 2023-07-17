import { useStyles } from "@extension-onboarding/components/WalletProviders/WalletProviderItem/WalletProviderItem.style";
import { IProvider } from "@extension-onboarding/services/blockChainWalletProviders";
import {  Box } from "@material-ui/core";
import { Button } from "@snickerdoodlelabs/shared-components";
import React, { useMemo, FC, memo } from "react";

interface IWalletProviderItemProps {
  provider: IProvider;
  onConnectClick: () => void;
}

const WalletProviderItem: FC<IWalletProviderItemProps> = ({
  provider,
  onConnectClick,
}: IWalletProviderItemProps) => {
  const classes = useStyles();

  return (
    <Box
      px={3}
      py={1.5}
      bgcolor={"#fff"}
      borderRadius={12}
      border="border: 1px solid #ECECEC"
      display="flex"
      flexDirection="column"
    >
      <Box display="flex" alignItems="center">
        <Box mr={3}>
          <img width={40} height={40} src={provider.icon} />
        </Box>
        <p className={classes.providerText}>{provider.name}</p>
      </Box>
      <Box mt={2}>
        <Button buttonType="secondary" onClick={onConnectClick}>
          {!provider.provider.isInstalled ? "Install" : "Link Account"}
        </Button>
      </Box>
    </Box>
  );
};

export default memo(WalletProviderItem);
