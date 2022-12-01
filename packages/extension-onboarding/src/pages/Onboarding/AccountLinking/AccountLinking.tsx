import { Box, Button, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { FC } from "react";

import AccountsCard from "@extension-onboarding/components/AccountsCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/AccountLinking/AccountLinking.style";
import { useNavigate } from "react-router-dom";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";

const AccountLinking: FC = () => {
  const navigate = useNavigate();
  const { linkedAccounts } = useAppContext();

  const classes = useStyles();
  return (
    <Box>
      <h3 className={classes.linkCryptoText}>Link your Crypto Accounts</h3>
      <p className={classes.manageText}>
        Manage all your personal data from your Snickerdoodle Data Wallet.
      </p>
      <Grid container spacing={2}>
        <Grid item sm={7}>
          <WalletProviders />
        </Grid>
        <Grid item sm={5}>
          <Box mb={2}>
            <Typography className={classes.sectionTitle}>
              Your Linked Accounts
            </Typography>
          </Box>
          <AccountsCard />
        </Grid>
      </Grid>
      <Box className={classes.buttonContainer}>
        <Button
          onClick={() => {
            navigate(EPaths.ONBOARDING_WELCOME);
          }}
        >
          Back
        </Button>
        <Box>
          <PrimaryButton
            type="submit"
            disabled={!linkedAccounts.length}
            onClick={() => {
              navigate(EPaths.ONBOARDING_BUILD_PROFILE);
            }}
          >
            Next
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
};
export default AccountLinking;
