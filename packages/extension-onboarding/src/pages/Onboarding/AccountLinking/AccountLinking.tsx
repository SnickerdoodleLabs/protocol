import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import accountLinking from "@extension-onboarding/assets/images/account-linking.svg";
import iconBg from "@extension-onboarding/assets/images/icon-bg.svg";
import sdlCircle from "@extension-onboarding/assets/images/sdl-circle.svg";
import WalletProviders from "@extension-onboarding/components/WalletProviders";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/AccountLinking/AccountLinking.style";
import { Box, Grid } from "@material-ui/core";
import React, { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AccountLinking: FC = () => {
  const navigate = useNavigate();
  const { linkedAccounts, invitationInfo } = useAppContext();

  useEffect(() => {
    if (linkedAccounts.length) {
      if (invitationInfo.consentAddress) {
        return navigate(EPaths.ONBOARDING_OPT_IN);
      }
      return navigate(EPaths.ONBOARDING_BUILD_PROFILE);
    }
  }, [linkedAccounts, invitationInfo]);

  const classes = useStyles();
  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <img src={snickerDoodleLogo} />
      </Box>
      <Box mt={4}>
        <Grid container direction="row" alignItems="flex-start" spacing={2}>
          <Grid item sm={6}>
            <Box pt={6} px={4}>
              <img src={accountLinking} />
            </Box>
            <Box flexDirection="column" display="flex" px={4} mt={3}>
              <h3 className={classes.title}>Welcome to Snickerdoodle</h3>
              <p className={classes.description}>
                Snickerdoodle connects you with the brands you love
              </p>
            </Box>
          </Grid>
          <Grid item sm={6}>
            <Box mb={3}>
              <h3 className={classes.title}>
                Create your account with<br></br>
                your crypto wallet and get<br></br>
                ready to earn rewards
              </h3>
              <p className={classes.descriptionSmall}>
                Link your account to view your web3 activity in your secure
                personal<br></br>
                Data Wallet and claim your reward.
                <br />
                <br /> You will only share your public key and consent to
                authenticate your account. You are linking your data, not making
                a transfer or incurring <br></br>
                any gas fees.
              </p>
            </Box>
            <WalletProviders />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};
export default AccountLinking;
