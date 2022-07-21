import {Box } from "@material-ui/core";
import React, { useState } from "react";

import ProfileCreation from "./ProfileCreation";
import AccountLinking from "./AccountLinking/AccountLinking";

import Logo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import SnickerProgressBar from "@extension-onboarding/components/SnickerProgressBar";
import { useEffect } from "react";
import { useAppContext } from "@extension-onboarding/Context/App";
import OnboardingWelcome from "./OnboardingWelcome";
import ViewData from "@extension-onboarding/pages/Onboarding/ViewData/ViewData";
import { useStyles } from "@extension-onboarding/pages/Onboarding/Onboarding.style";

export default function Onboarding() {
  const { stepperStatus } = useAppContext();
  const [progressValue, setProgressValue] = useState(0);

  useEffect(() => {
    setProgressValue(stepperStatus);
  }, [stepperStatus]);

  const returnState = (value) => {
    const stateArray = [<ProfileCreation />,
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
          <img src={Logo} />
        {progressValue === 0 ? (
          ""
        ) : (
          <SnickerProgressBar progressStatus={progressValue} />
        )}
        {returnState(progressValue)}
      </Box>
    </Box>
  );
}
