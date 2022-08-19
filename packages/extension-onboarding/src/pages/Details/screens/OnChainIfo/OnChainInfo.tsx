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
        <Typography className={classes.title}>On Chain Info</Typography>
        <Typography className={classes.description}>
          Manage all your personal data from your Snickerdoodle Data Wallet.
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item sm={7}>
          <WalletProviders />
        </Grid>
        <Grid item sm={5}>
          <Box mb={2}>
            <Typography className={classes.itemTitle}>
              Your Linked Accounts
            </Typography>
          </Box>
          <AccountsCard
            onButtonClick={(account) => {
              setModal({
                modalSelector: EModalSelectors.VIEW_ACCOUNT_DETAILS,
                customProps: { account },
                onPrimaryButtonClick: () => {},
              });
            }}
            buttonText="VIEW DETAILS"
          />
        </Grid>
      </Grid>
    </Box>
  );
};
export default OnChainInfo;
