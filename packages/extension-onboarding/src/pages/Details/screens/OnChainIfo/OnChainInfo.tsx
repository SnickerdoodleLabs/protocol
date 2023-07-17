import { Box, Grid } from "@material-ui/core";
import { AccountAddress } from "@snickerdoodlelabs/objects";
import { AccountsCard } from "@snickerdoodlelabs/shared-components";
import React, { FC, useEffect, useState } from "react";

import Typography from "@extension-onboarding/components/Typography";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { useAppContext } from "@extension-onboarding/context/App";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/OnChainIfo/OnChainInfo.style";
import { IWindowWithSdlDataWallet } from "@extension-onboarding/services/interfaces/sdlDataWallet/IWindowWithSdlDataWallet";
declare const window: IWindowWithSdlDataWallet;
const OnChainInfo: FC = () => {
  const classes = useStyles();
  const { setModal } = useLayoutContext();
  const { linkedAccounts } = useAppContext();
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
        <Typography variant="pageTitle">Crypto Account Settings</Typography>
        <Box mt={1}>
          <Typography variant="pageDescription">
            Add or remove wallets to control what web 3 data you store in your
            data wallet.
          </Typography>
        </Box>
      </Box>
      <Box>
        <WalletProviders />

        <Box mt={5}>
          <Box pl={2.5} py={1.5} bgcolor="#fff">
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
            accounts={linkedAccounts.map(
              (account) => account.sourceAccountAddress,
            )}
            receivingAddress={receivingAccount}
            onSelect={setDefaultReceivingAccount}
          />
        </Box>
      </Box>
    </Box>
  );
};
export default OnChainInfo;
