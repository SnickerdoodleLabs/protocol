import dot1Faded from "@extension-onboarding/assets/icons/dot-1-faded.svg";
import dot1 from "@extension-onboarding/assets/icons/dot-1.svg";
import dot2Faded from "@extension-onboarding/assets/icons/dot-2-faded.svg";
import dot2 from "@extension-onboarding/assets/icons/dot-2.svg";
import { useStyles } from "@extension-onboarding/components/ProgressBar/ProgressBar.style";
import { EPaths } from "@extension-onboarding/containers/Router/Router.paths";
import { Box, Typography } from "@material-ui/core";
import React, { FC } from "react";
import { useLocation } from "react-router-dom";

const ProgressBar: FC = () => {
  const classes = useStyles();
  const location = useLocation();
  return (
    <Box className={classes.container} mt={5}>
      <Box className={classes.columnContainer}>
        <img
          width={50}
          src={
            location.pathname == EPaths.ONBOARDING_LINK_ACCOUNT
              ? dot1
              : dot1Faded
          }
        />
        <Typography
          className={
            location.pathname == EPaths.ONBOARDING_LINK_ACCOUNT
              ? classes.text
              : classes.textFaded
          }
        >
          Link your Accounts
        </Typography>
      </Box>
      <Box className={classes.lineData} mt={3.25} />
      <Box className={classes.columnContainer}>
        <img
          width={50}
          src={
            location.pathname == EPaths.ONBOARDING_BUILD_PROFILE
              ? dot2
              : dot2Faded
          }
        />
        <Typography
          className={
            location.pathname == EPaths.ONBOARDING_BUILD_PROFILE
              ? classes.text
              : classes.textFaded
          }
        >
          Build your Profile
        </Typography>
      </Box>
      <Box className={classes.lineData} mt={3.25} />
      {/* <Box className={classes.columnContainer}>
        <img
          width={50}
          src={
            location.pathname == EPaths.ONBOARDING_VIEW_DATA ? dot3 : dot3Faded
          }
        />
        <Typography
          className={
            location.pathname == EPaths.ONBOARDING_VIEW_DATA
              ? classes.text
              : classes.textFaded
          }
        >
          View your Data
        </Typography>
      </Box> */}
    </Box>
  );
};

export default ProgressBar;
