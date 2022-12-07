import snickerDoodleLogo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import sdlCircle from "@extension-onboarding/assets/images/sdl-circle.svg";
import sdlLogo from "@extension-onboarding/assets/images/sdl-logo.png";
import videoBg from "@extension-onboarding/assets/images/video-bg.svg";
import Button from "@extension-onboarding/components/Button";
import {
  DOWNLOAD_URL,
  PRODUCT_VIDEO_URL,
} from "@extension-onboarding/constants";
import { useStyles } from "@extension-onboarding/containers/Router/InitialScreen/components/WebScreen/WebScreen.style";
import { useAppContext } from "@extension-onboarding/context/App";
import { Box, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

const WebScreen = () => {
  const [pageFocused, setPageFocused] = useState<boolean>(false);
  const { invitationInfo } = useAppContext();
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
              {invitationInfo.consentAddress && invitationInfo.brandIcon ? (
                <Box mb={4}>
                  <img
                    className={classes.icon}
                    src={invitationInfo.brandIcon}
                  />

                  <img
                    className={classes.icon}
                    style={{ marginLeft: -15 }}
                    src={sdlCircle}
                  />
                </Box>
              ) : (
                <Box mb={2}>
                  <img width="45%" src={sdlLogo} />
                </Box>
              )}
              <Typography className={classes.title}>
                Welcome to Snickerdoodle
              </Typography>
              <Box pr={3}>
                <Typography className={classes.description}>
                  The matchmaker between you, your data, and the brands you love
                </Typography>
              </Box>
              <Box width="80%" my={4}>
                <Typography className={classes.info}>
                  Install the Snickerdoodle browser extension to claim your NFT!
                </Typography>
              </Box>
              <Button
                style={{ width: 187 }}
                onClick={() => {
                  window.open(DOWNLOAD_URL, "_blank");
                }}
              >
                Get Extension
              </Button>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box display="flex" width="100%" position="relative">
              <img width="100%" src={videoBg} />
              <Box position="absolute" bottom="15%" right="2%">
                <video className={classes.video} controls>
                  <source src={PRODUCT_VIDEO_URL} />
                </video>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default WebScreen;
