import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import ProgressBar from "@extension-onboarding/components/ProgressBar/ProgressBar";
import { useAppContext } from "@extension-onboarding/context/App";
import AccountLinking from "@extension-onboarding/pages/Onboarding/AccountLinking/AccountLinking";
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

  return (
    <Box>
      {progressValue === 0 ? (
        returnState(progressValue)
      ) : (
        <Box bgcolor="#fff" py={8} px={15}>
          <img src={snickerDoodleLogo} />
          <ProgressBar progressStatus={progressValue} />
          {returnState(progressValue)}
        </Box>
      )}
    </Box>
  );
}
