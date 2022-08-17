import { Box, CircularProgress, Typography } from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import artboardImage from "@extension-onboarding/assets/images/initial-page-bg.svg";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/OnboardingWelcome/OnboardingWelcome.style";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import ViewDetailsModal from "@extension-onboarding/components/Modals/ViewDetailsModal/ViewDetailsModal";

const OnboardingWelcome: FC = () => {
  const { changeStepperStatus, isSDLDataWalletDetected } = useAppContext();
  const [checkTimeOutEnded, setCheckTimeOutEnded] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCheckTimeOutEnded(true);
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const classes = useStyles();
  return (
    <>
      <Box
        marginTop="45%"
        display="flex"
        alignItems="center"
        flexDirection="column"
      >
        <Box>
          <img src={snickerDoodleLogo} className={classes.logo} />
        </Box>
        <Box mt={3}>
          <Typography className={classes.title}>
            Built for All Chains
          </Typography>
        </Box>
        <Box mt={1}>
          <Typography className={classes.description}>
            Snickerdoodle Data Wallet works with all of your favorite chains.{" "}
          </Typography>

        </Box>
        <Box mt={3}>
          {isSDLDataWalletDetected ? (
            <PrimaryButton
              type="submit"
              onClick={() => {
                changeStepperStatus("next");
              }}
            >
              Get Started
            </PrimaryButton>
            
          ) : checkTimeOutEnded ? (
            <Box justifyContent="center">
              <Typography className={classes.description}>
                We could not detect Snickerdoodle Data Wallet extension please
                install first
              </Typography>
              <Box mt={3} display="flex" justifyContent="center">
                <PrimaryButton type="submit" onClick={() => {}}>
                  Please Install
                </PrimaryButton>
  
              </Box>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </Box>
      </Box>
      <img src={artboardImage} className={classes.bgImage} />
    </>
  );
};

export default OnboardingWelcome;
