import { Box } from "@material-ui/core";
import React from "react";
import { Outlet } from "react-router-dom";

const OnboardingLayout = () => {
  return (
    <Box bgcolor="#fff" py={8} px={15}>
      <Outlet />
    </Box>
  );
};

export default OnboardingLayout;
