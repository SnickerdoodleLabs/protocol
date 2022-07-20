import { Box, Button, makeStyles, Typography } from "@material-ui/core";
import React from "react";

import AccountsCard from "@extension-onboarding/components/AccountsCard";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { useAppContext } from "@extension-onboarding/Context/App";

export default function AccountLinking() {
  const { changeStepperStatus, linkedAccounts } = useAppContext();

  const classes = useStyles();
  return (
    <Box style={{ display: "flex" }}>
      <Box>
        <h3 className={classes.linkCryptoText}>Link your Crypto Accounts</h3>
        <p className={classes.manageText}>
          Manage all your personal data from your Snickerdoodle Data Wallet.
        </p>
        <WalletProviders />
      </Box>

      <Box className={classes.yourLinkedAccountContainer}>
        <AccountsCard />
      </Box>
      <Box
        style={{
          position: "absolute",
          top: "800px",
          right: "200px",
          marginTop: "140px",
          display: "flex",
        }}
      >
        <Button
          onClick={() => {
            changeStepperStatus("back");
          }}
        >
          Back
        </Button>
        <Box>
          <PrimaryButton
            type="submit"
            disabled={!linkedAccounts.length}
            onClick={() => {
              changeStepperStatus("next");
            }}
          >
            Next
          </PrimaryButton>
        </Box>
      </Box>
    </Box>
  );
}

const useStyles = makeStyles({
  yourLinkedAccountText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    paddingTop: "35px",
  },
  yourLinkedAccountContainer: {
    marginTop: "170px",
    marginLeft: "20px",
  },
  connectText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    marginBottom: "0px",
  },
  manageText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "18px",
    color: "#232039",
  },
  linkCryptoText: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    marginTop: "100px",
  },
});
