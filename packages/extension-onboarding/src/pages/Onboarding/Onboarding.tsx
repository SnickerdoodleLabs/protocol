import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import ProgressBar from "@extension-onboarding/components/ProgressBar/ProgressBar";
import { useAppContext } from "@extension-onboarding/context/App";
import AccountLinking from "@extension-onboarding/pages/Onboarding/AccountLinking/AccountLinking";
import { useStyles } from "@extension-onboarding/pages/Onboarding/Onboarding.style";
import OnboardingWelcome from "@extension-onboarding/pages/Onboarding/OnboardingWelcome";
import ProfileCreation from "@extension-onboarding/pages/Onboarding/ProfileCreation";
import ViewData from "@extension-onboarding/pages/Onboarding/ViewData/ViewData";
import { Box } from "@material-ui/core";
import React, { useState, useEffect } from "react";

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
    ];
    return stateArray[value];
  };

  const classes = useStyles();
  return (
    <Box display="flex" justifyContent="center">
      <Box>
        {progressValue !== 0 && <img src={snickerDoodleLogo} />}
        {progressValue === 0 || progressValue === 4 ? (
          ""
        ) : (
          <ProgressBar progressStatus={progressValue} />
        )}
        {returnState(progressValue)}
      </Box>
    </Box>
  );
}
