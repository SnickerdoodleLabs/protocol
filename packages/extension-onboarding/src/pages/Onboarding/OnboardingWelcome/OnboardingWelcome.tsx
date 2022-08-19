import welcome1Right from "@extension-onboarding/assets/images/welcome-sc1-right.png";
import welcome1 from "@extension-onboarding/assets/images/welcome-sc1.svg";
import welcome2 from "@extension-onboarding/assets/images/welcome-sc2.svg";
import welcome3Right from "@extension-onboarding/assets/images/welcome-sc3-right.svg";
import welcome3 from "@extension-onboarding/assets/images/welcome-sc3.svg";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/OnboardingWelcome/OnboardingWelcome.style";
import { Box, Button, Grid, Hidden, MobileStepper } from "@material-ui/core";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@material-ui/icons";
import React, { FC, useState } from "react";

const OnboardingWelcome: FC = () => {
  const { changeStepperStatus } = useAppContext();
  const [screenIndex, setScreenIndex] = useState<number>(0);
  const classes = useStyles();
  const handleNext = () => {
    setScreenIndex((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setScreenIndex((prevActiveStep) => prevActiveStep - 1);
  };

  const stepper = (
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
        <Button size="small" onClick={handleBack} disabled={screenIndex === 0}>
          <KeyboardArrowLeft />
          Back
        </Button>
      }
    />
  );

  return (
    <>
      {screenIndex === 0 && (
        <Grid container>
          <Grid item xs={12} md={7}>
            <Box
              height="100vh"
              pl={15}
              pr={6}
              display="flex"
              flexDirection="column"
              bgcolor="#fff"
            >
              <Box marginY="auto">
                <img style={{ width: "100%" }} src={welcome1} />
                <Box mt={5}>{stepper}</Box>
              </Box>
            </Box>
          </Grid>
          <Hidden smDown>
            <Grid item md={5}>
              <Box height="100vh" display="flex" bgcolor="#F8D798">
                <Box width="70%" margin="auto">
                  <img style={{ width: "100%" }} src={welcome1Right} />
                </Box>
              </Box>
            </Grid>
          </Hidden>
        </Grid>
      )}
      {screenIndex === 1 && (
        <Box
          height="100vh"
          px={15}
          display="flex"
          flexDirection="column"
          bgcolor="#fff"
        >
          <Box marginY="auto">
            <img style={{ width: "100%" }} src={welcome2} />
            <Box mt={5} display="flex" justifyContent="center">
              {stepper}
            </Box>
          </Box>
        </Box>
      )}
      {screenIndex === 2 && (
        <Grid container>
          <Grid item xs={12} md={7}>
            <Box
              height="100vh"
              pl={15}
              pr={6}
              display="flex"
              flexDirection="column"
              bgcolor="#fff"
            >
              <Box marginY="auto">
                <img style={{ width: "100%" }} src={welcome3} />
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
          </Grid>
          <Hidden smDown>
            <Grid item md={5}>
              <Box height="100vh" display="flex" bgcolor="#F8D798">
                <Box width="70%" margin="auto">
                  <img style={{ width: "100%" }} src={welcome3Right} />
                </Box>
              </Box>
            </Grid>
          </Hidden>
        </Grid>
      )}
    </>
  );
};

export default OnboardingWelcome;
