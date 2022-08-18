import {
  Box,
  Button,
  CircularProgress,
  MobileStepper,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useMemo, useState } from "react";
import artboardImage from "@extension-onboarding/assets/images/initial-page-bg.svg";
import artboardImage2 from "@extension-onboarding/assets/images/initial-page-bg2.svg";
import artboardImage3 from "@extension-onboarding/assets/images/initial-page-bg3.svg";
import artboardImage4 from "@extension-onboarding/assets/images/initial-page-bg4.svg";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/OnboardingWelcome/OnboardingWelcome.style";
import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import ViewDetailsModal from "@extension-onboarding/components/Modals/ViewDetailsModal/ViewDetailsModal";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";

const OnboardingWelcome: FC = () => {
  const { changeStepperStatus, isSDLDataWalletDetected } = useAppContext();
  const [checkTimeOutEnded, setCheckTimeOutEnded] = useState<boolean>(false);
  const [screenIndex, setScreenIndex] = useState<number>();

  const classes = useStyles();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCheckTimeOutEnded(true);
    }, 4000);
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const handleNext = () => {
    if (screenIndex === 2) {
      changeStepperStatus("next");
    } else {
      setScreenIndex((prevActiveStep) => prevActiveStep! + 1);
    }
  };

  const handleBack = () => {
    setScreenIndex((prevActiveStep) => prevActiveStep! - 1);
  };

  const content = useMemo(() => {
    switch (screenIndex) {
      case 0: {
        return (
          <>
            <Box mt={3}>
              <Typography className={classes.title}>
                What is Snickerdoolde Data Wallet?
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography className={classes.description}>
                Snickerdoodle data wallet is an <b>open-source</b>, off-chain
                application enables you to
                <b>manage the storage of your own data</b>
                on your device and allows you to incentivise your data by giving
                other parties permission to use it.
              </Typography>
            </Box>
          </>
        );
      }
      case 1: {
        return (
          <>
            <Box mt={3}>
              <Typography className={classes.title}>
                Why would you like to add your data?
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography className={classes.description}>
                Manage and control your digital assets on blockchain, and
                internet from one place, lease your data and earn rewards.
              </Typography>
            </Box>
          </>
        );
      }
      case 2: {
        return (
          <>
            <Box mt={3}>
              <Typography className={classes.title}>
                What rewards can you get through your data wallet?
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography className={classes.description}>
                Receive discounts, earn game points, coins, dimonds, leveling
                up, early access to content, access to invite only events and
                musch more.
              </Typography>
            </Box>
          </>
        );
      }
      default: {
        return (
          <>
            <Box mt={3}>
              <Typography className={classes.title}>
                Built for All Chains
              </Typography>
            </Box>
            <Box mt={1}>
              <Typography className={classes.description}>
                Snickerdoodle Data Wallet works with all of your favorite
                chains.
              </Typography>
            </Box>
          </>
        );
      }
    }
  }, [screenIndex]);

  const imgSrc = useMemo(() => {
    switch (screenIndex) {
      case 0: {
        return artboardImage2;
      }
      case 1: {
        return artboardImage3;
      }
      case 2: {
        return artboardImage4;
      }
      default: {
        return artboardImage;
      }
    }
  }, [screenIndex]);
  return (
    <>
      <Box
        mt={40}
        display="flex"
        alignItems="center"
        flexDirection="column"
        maxWidth={750}
        height={400}
        textAlign="center"
      >
        <Box>
          <img src={snickerDoodleLogo} className={classes.logo} />
        </Box>
        {content}

        {screenIndex != undefined ? (
          <Box marginTop="auto">
            <MobileStepper
              variant="dots"
              steps={3}
              position="static"
              activeStep={screenIndex}
              className={classes.mobileStepper}
              nextButton={
                <Button size="small" onClick={handleNext}>
                  Next
                  <KeyboardArrowRight />
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={screenIndex === 0}
                >
                  <KeyboardArrowLeft />
                  Back
                </Button>
              }
            />
          </Box>
        ) : (
          <Box mt={3}>
            <PrimaryButton
              type="submit"
              onClick={() => {
                setScreenIndex(0);
              }}
            >
              Get Started
            </PrimaryButton>
          </Box>
        )}
      </Box>
      <img src={imgSrc} className={classes.bgImage} />
    </>
  );
};

export default OnboardingWelcome;
