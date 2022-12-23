import AccountsCard from "@extension-onboarding/components/AccountsCard";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/OnChainIfo/OnChainInfo.style";
import { Box, Grid, Typography } from "@material-ui/core";
import React, { FC } from "react";

const OnChainInfo: FC = () => {
  const classes = useStyles();
  const { setModal } = useLayoutContext();
  return (
    <Box>
      <Box mb={5}>
        <Typography className={classes.title}>Crypto Account Settings</Typography>
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
          <AccountsCard />
        </Grid>
      </Grid>
    </Box>
  );
};
export default OnChainInfo;
