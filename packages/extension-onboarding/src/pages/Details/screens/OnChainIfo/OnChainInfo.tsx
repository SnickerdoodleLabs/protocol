import AccountsCard from "@extension-onboarding/components/AccountsCard";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/OnChainIfo/OnChainInfo.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
import { Box, Grid, Typography } from "@material-ui/core";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import React, { FC, useEffect, useState } from "react";
declare const window: IWindowWithSdlDataWallet;
const OnChainInfo: FC = () => {
  const classes = useStyles();
  const { setModal } = useLayoutContext();
  const [receivingAccount, setReceivingAccount] = useState<AccountAddress>();

  useEffect(() => {
    getRecievingAccount();
  }, []);

  const getRecievingAccount = () => {
    window.sdlDataWallet.getReceivingAddress().map(setReceivingAccount);
  };

  const setDefaultReceivingAccount = (accountAddress) => {
    window.sdlDataWallet
      .setDefaultReceivingAddress(accountAddress)
      .map(getRecievingAccount);
  };
  return (
    <Box>
      <Box mb={5}>
        <Typography className={classes.title}>
          Crypto Account Settings
        </Typography>
        <Typography className={classes.description}>
          Add or remove wallets to control what web 3 data you store in your
          data wallet.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item sm={12}>
          <WalletProviders />
        </Grid>
        <Grid item sm={12}>
          <Box mb={2}>
            <Typography className={classes.itemTitle}>
              Your Linked Accounts
            </Typography>
          </Box>
          <AccountsCard
            topContent={
              <Box
                display="flex"
                justifyContent="space-between"
                py={1.5}
                px={3}
              >
                <Typography className={classes.accountCardTitle}>
                  Account Address
                </Typography>
                <Typography className={classes.accountCardTitle}>
                  Receiving Account
                </Typography>
              </Box>
            }
            receivingAddress={receivingAccount}
            onSelect={setDefaultReceivingAccount}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default OnChainInfo;
