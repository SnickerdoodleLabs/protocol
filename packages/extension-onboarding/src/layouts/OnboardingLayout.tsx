import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import ProgressBar from "@extension-onboarding/components/ProgressBar/ProgressBar";
import { Box } from "@material-ui/core";
import React from "react";
import { Outlet } from "react-router-dom";

const OnboardingLayout = () => {
  return (
    <Box bgcolor="#fff" py={8} px={15}>
      <img src={snickerDoodleLogo} />
      <ProgressBar />
      <Outlet />
    </Box>
  );
};

export default OnboardingLayout;
