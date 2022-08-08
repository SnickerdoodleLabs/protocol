import { Box } from "@material-ui/core";
import React, { useState } from "react";

import ProfileCreation from "./ProfileCreation";
import AccountLinking from "./AccountLinking/AccountLinking";

import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import { useEffect } from "react";
import { useAppContext } from "@extension-onboarding/context/App";
import OnboardingWelcome from "./OnboardingWelcome";
import ViewData from "@extension-onboarding/pages/Onboarding/ViewData/ViewData";
import { useStyles } from "@extension-onboarding/pages/Onboarding/Onboarding.style";
import ProgressBar from "@extension-onboarding/components/ProgressBar/ProgressBar";
import ViewAccountDetails from "./ViewAccountDetails";

export default function Onboarding() {
  const { stepperStatus } = useAppContext();
  const [progressValue, setProgressValue] = useState<number>(0);

  useEffect(() => {
    setProgressValue(stepperStatus);
  }, [stepperStatus]);

  const returnState = (value) => {
    const stateArray = [
      <OnboardingWelcome />,
      <AccountLinking />,
      <ProfileCreation />,
      <ViewData />,
      <ViewAccountDetails />,
    ];
    return stateArray[value];
  };

  const classes = useStyles();
  return (
    <Box display="flex" justifyContent="center">
      <Box>
        {progressValue !== 0 && <img src={snickerDoodleLogo} />}
        {progressValue === 0 || 4 ? (
          ""
        ) : (
          <ProgressBar progressStatus={progressValue} />
        )}
        {returnState(progressValue)}
      </Box>
    </Box>
  );
}
