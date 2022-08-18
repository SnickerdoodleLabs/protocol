import React, { FC } from "react";
import { Box, Button } from "@material-ui/core";
import { useStyles } from "@app/Popup/pages/Home/Home.style";
import { useAppContext } from "@app/Popup/context";

const Unauthorized: FC = () => {
  const classes = useStyles();
  const { config } = useAppContext();

  const handleClick = () => {
    window.open(config.getConfig().onboardingUrl, "_blank");
  };

  return (
    <Box mt={16} px={4}>
      <Button variant="contained" onClick={handleClick}>
        Please Complete Onboarding First
      </Button>
    </Box>
  );
};

export default Unauthorized;
