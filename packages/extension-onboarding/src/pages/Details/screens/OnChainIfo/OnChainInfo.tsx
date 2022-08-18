import AccountsCard from "@extension-onboarding/components/AccountsCard";
import { EModalSelectors } from "@extension-onboarding/components/Modals";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { useStyles } from "@extension-onboarding/pages/Details/screens/OnChainIfo/OnChainInfo.style";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";

const OnChainInfo: FC = () => {
  const classes = useStyles();
  const { setModal } = useLayoutContext();
  return (
    <Box>
      <Box display="flex">
        <Box>
          <h3 className={classes.linkCryptoText}>On Chain Info</h3>
          <p className={classes.manageText}>
            Manage all your personal data from your Snickerdoodle Data Wallet.
          </p>
          <WalletProviders />
        </Box>
        <Box className={classes.yourLinkedAccountContainer}>
          <Box mb={2} mt={7}>
            <Typography className={classes.sectionTitle}>
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
        </Box>
      </Box>
    </Box>
  );
};
export default OnChainInfo;
