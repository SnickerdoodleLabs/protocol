import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import artboardImage from "@extension-onboarding/assets/images/artboard.png";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import avalancheCircle from "@extension-onboarding/assets/icons/avalanche-circle.svg";
import algorandCircle from "@extension-onboarding/assets/icons/algorand-circle.svg";
import solonaCircle from "@extension-onboarding/assets/icons/solona-circle.svg";
import polygonCircle from "@extension-onboarding/assets/icons/polygon-circle.svg";
import arbitrumCircle from "@extension-onboarding/assets/icons/arbitrum-circle.svg";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/Context/App";
import { useStyles } from "@extension-onboarding/pages/Onboarding/OnboardingWelcome/OnboardingWelcome.style";

const OnboardingWelcome: FC = () => {
  const { changeStepperStatus } = useAppContext();

  const classes = useStyles();
  return (
    <Box>
      <Box display="flex">
        <Box>
          <h3 className={classes.buildYourProfileText}>Built for All Chains</h3>
          <p className={classes.infoText}>
            Snickerdoodle Data Wallet works with all of your favorite chains.
          </p>
          <Box>
            <Box display="flex" alignItems="center" width={700} mt={4}>
              <Box display="flex" alignItems="center" ml={8}>
                <img src={ethereumCircle} />
                <Typography className={classes.iconText}>Ethereum</Typography>
              </Box>
              <Box display="flex" alignItems="center" ml={4}>
                <img src={avalancheCircle} />
                <Typography className={classes.iconText}>Avalanche</Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" width={700} mt={4}>
              <Box display="flex" alignItems="center" ml={8}>
                <img src={algorandCircle} />
                <Typography className={classes.iconText}>Algorand</Typography>
              </Box>
              <Box display="flex" alignItems="center" ml={4}>
                <img src={solonaCircle} />
                <Typography className={classes.iconText}>Solona</Typography>
              </Box>
            </Box>

            <Box display="flex" alignItems="center" width={700} mt={4}>
              <Box display="flex" alignItems="center" ml={8}>
                <img src={polygonCircle} />
                <Typography className={classes.iconText}>Polygon</Typography>
              </Box>
              <Box display="flex" alignItems="center" ml={4}>
                <img src={arbitrumCircle} />
                <Typography className={classes.iconText}>Arbitrum</Typography>
              </Box>
            </Box>
          </Box>
        </Box>
        <Box className={classes.artboard}>
          <img src={artboardImage} />
        </Box>
      </Box>
      <Box
        className={classes.buttonContainer}
        onClick={() => {
          changeStepperStatus("next");
        }}
      >
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
  );
};

export default OnboardingWelcome;
