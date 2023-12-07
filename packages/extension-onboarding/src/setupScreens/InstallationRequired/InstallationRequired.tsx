import { Box, Grid, Typography } from "@material-ui/core";
import { SDButton } from "@snickerdoodlelabs/shared-components";
import React, { useEffect, useState } from "react";

import { SDLogoCircle } from "@extension-onboarding/assets";
import {
  DOWNLOAD_URL,
  PRODUCT_VIDEO_URL,
} from "@extension-onboarding/constants";
import { useStyles } from "@extension-onboarding/setupScreens/InstallationRequired/InstallationRequired.style";
import Container from "@extension-onboarding/components/v2/Container";

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
    <Container>
      <Box py={4} minHeight="100vh">
        <SDLogoCircle />
        <Box mt={4}>
          <Grid container alignItems="flex-end">
            <Grid item xs={12} sm={6}>
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
            <Grid item xs={12} sm={6}>
              <img
                src="https://storage.googleapis.com/dw-assets/spa/images/video-bg.svg"
                width="100%"
                height="auto"
              />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default InstallationRequired;
