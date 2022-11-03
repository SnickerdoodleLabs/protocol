import card1 from "@extension-onboarding/assets/images/card1.svg";
import card2 from "@extension-onboarding/assets/images/card2.svg";
import card3 from "@extension-onboarding/assets/images/card3.svg";
import welcome1 from "@extension-onboarding/assets/images/welcome-sc1.svg";
import welcome3Right from "@extension-onboarding/assets/images/welcome-sc3-right.svg";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { DOWNLOAD_URL } from "@extension-onboarding/constants";
import { Box, Grid, Hidden } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import { autoPlay } from "react-swipeable-views-utils";

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const WebScreen = () => {
  const [pageFocused, setPageFocused] = useState<boolean>(false);

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
    <Grid container>
      <Grid item xs={12} md={7}>
        <Box
          height="100vh"
          pl={15}
          pr={6}
          display="flex"
          flexDirection="column"
          bgcolor="#fff"
        >
          <Box marginY="auto">
            <img style={{ width: "100%" }} src={welcome1} />
            <PrimaryButton
              type="submit"
              onClick={() => {
                window.open(DOWNLOAD_URL, "_blank");
              }}
            >
              Install
            </PrimaryButton>
          </Box>
        </Box>
      </Grid>
      <Hidden smDown>
        <Grid item md={5}>
          <Box height="100vh" display="flex" bgcolor="#F8D798">
            <Box width="70%" margin="auto">
              <AutoPlaySwipeableViews interval={4500}>
                <img style={{ width: "100%" }} src={welcome3Right} />
                <img style={{ width: "100%" }} src={card1} />
                <img style={{ width: "100%" }} src={card2} />
                <img style={{ width: "100%" }} src={card3} />
              </AutoPlaySwipeableViews>
            </Box>
          </Box>
        </Grid>
      </Hidden>
    </Grid>
  );
};

export default WebScreen;
