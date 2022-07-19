import {
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Box,
  InputBase,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@material-ui/core";
import React, { FC, useEffect, useState } from "react";
import artboard from "@extension-onboarding/assets/icons/artboard.png";
import ethereumCircle from "@extension-onboarding/assets/icons/ethereum-circle.svg";
import avalancheCircle from "@extension-onboarding/assets/icons/avalanche-circle.svg";
import algorandCircle from "@extension-onboarding/assets/icons/algorand-circle.svg";
import solonaCircle from "@extension-onboarding/assets/icons/solona-circle.svg";
import polygonCircle from "@extension-onboarding/assets/icons/polygon-circle.svg";
import arbitrumCircle from "@extension-onboarding/assets/icons/arbitrum-circle.svg";
import SnickerProgressBar from "@extension-onboarding/components/SnickerProgressBar";
import { makeStyles } from "@material-ui/styles";
import { GoogleLogin, GoogleLogout } from "react-google-login";
import { gapi } from "gapi-script";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useAppContext } from "@extension-onboarding/Context/App";

const OnboardingWelcome: FC = () => {
  const { changeStepperStatus } = useAppContext();

  const classes = useStyles();
  return (
    <Box style={{ display: "flex" }}>
      <Box>
        <h3 className={classes.buildYourProfileText}>Built for All Chains</h3>
        <p className={classes.infoText}>
        Snickerdoodle Data Wallet works with all of your favorite chains. 
        </p>
        <Box>
        <Box display="flex" alignItems="center" width={700} mt={4}>
            <Box display="flex" alignItems="center" ml={8}>
              <img src={ethereumCircle} />
              <Typography style={{ paddingLeft: "10px" }}>Ethereum</Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={4}>
              <img src={avalancheCircle} />
              <Typography style={{ paddingLeft: "10px" }}>Ethereum</Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" width={700} mt={4}>
            <Box display="flex" alignItems="center" ml={8}>
              <img src={algorandCircle} />
              <Typography style={{ paddingLeft: "10px" }}>Ethereum</Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={4}>
              <img src={solonaCircle} />
              <Typography style={{ paddingLeft: "10px" }}>Ethereum</Typography>
            </Box>
          </Box>

          <Box display="flex" alignItems="center" width={700} mt={4}>
            <Box display="flex" alignItems="center" ml={8}>
              <img src={polygonCircle} />
              <Typography style={{ paddingLeft: "10px" }}>Ethereum</Typography>
            </Box>
            <Box display="flex" alignItems="center" ml={4}>
              <img src={arbitrumCircle} />
              <Typography style={{ paddingLeft: "10px" }}>Ethereum</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box className={classes.artboard}>
        <img src={artboard} />
      </Box>
      <Box onClick={()=>{changeStepperStatus('next')}}
            style={{
              position: "absolute",
              top: "700px",
              right: "200px",
              marginTop: "140px",
              display: "flex",
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
const useStyles = makeStyles({
  artboard: {
    marginTop: "100px",
    marginLeft: "20px",
  },
  googleButton: {
    width: "330px !important",
    height: "52px !important",
    border: "1px solid #D9D9D9 !important",
    borderRadius: "8px !important",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontSize: "14px !important",
    fontWeight: 500,
    color: "black !important",
    letterSpacing: "1px !important",
    justifyContent: "center",
  },
  authorizeText: {
    marginTop: "40px",
    color: "#232039",
    fontFamily: "'Space Grotesk'",
    fontSize: "18px",
  },
  selectInput: {
    width: "330px",
    height: "55px",
    border: "1px solid #D9D9D9",
    borderRadius: "8px",
    paddingLeft: "25px",
    color: "#929292",
  },
  textInput: {
    border: "1px solid #D9D9D9",
    width: "330px",
    height: "55px",
    borderRadius: "8px",
    paddingLeft: "25px",
    color: "#929292",
  },
  buildYourProfileText: {
    fontSize: "36px",
    fontWeight: 400,
    fontStyle: "italic",
    fontFamily: " 'Shrikhand', cursive ",
    marginTop: "100px",
  },
  infoText: {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 400,
    fontSize: "18px",
  },
});

export default OnboardingWelcome;
