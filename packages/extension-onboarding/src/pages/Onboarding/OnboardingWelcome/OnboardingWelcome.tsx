import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import artboardImage from "@extension-onboarding/assets/images/initial-page-bg.svg";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/OnboardingWelcome/OnboardingWelcome.style";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";

const OnboardingWelcome: FC = () => {
  const { changeStepperStatus } = useAppContext();

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
          <PrimaryButton
            type="submit"
            onClick={() => {
              changeStepperStatus("next");
            }}
          >
            Get Started
          </PrimaryButton>
        </Box>
      </Box>
      <img src={artboardImage} className={classes.bgImage} />
    </>
  );
};

export default OnboardingWelcome;
