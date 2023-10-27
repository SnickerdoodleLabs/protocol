import { Box, Grid, Typography } from "@material-ui/core";
import {  SDButton } from "@snickerdoodlelabs/shared-components";
import React, { useEffect, useState } from "react";

import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import videoBg from "@extension-onboarding/assets/images/video-bg.svg";
import {
  DOWNLOAD_URL,
  PRODUCT_VIDEO_URL,
} from "@extension-onboarding/constants";
import { useStyles } from "@extension-onboarding/setupScreens/InstallationRequired/InstallationRequired.style";

const InstallationRequired = () => {
  const [pageFocused, setPageFocused] = useState<boolean>(false);
  const classes = useStyles();
  useEffect(() => {
    if (pageFocused) {
      window.location.reload();
    }
  }, [pageFocused]);

  const onVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      setPageFocused(true);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  return (
    <Box bgcolor="#fff" py={8} px={15}>
      <img src={snickerDoodleLogo} />
      <Box mt={4}>
        <Grid container alignItems="flex-end">
          <Grid item xs={6}>
            <Box width="100%" mb={3} marginTop="auto">
              <Box mb={5}>
                <video className={classes.video} controls>
                  <source src={PRODUCT_VIDEO_URL} />
                </video>
              </Box>
              <Typography className={classes.title}>
                Welcome to Snickerdoodle
              </Typography>
              <Box pr={3} mb={5}>
                <Typography className={classes.description}>
                  The matchmaker between you, your <br></br> data, and the
                  brands you love
                </Typography>
              </Box>
              <SDButton
                style={{ width: 187 }}
                onClick={() => {
                  window.open(DOWNLOAD_URL, "_blank");
                }}
              >
                Get Extension
              </SDButton>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box display="flex" width="100%" position="relative">
              <img src={videoBg} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default InstallationRequired;
