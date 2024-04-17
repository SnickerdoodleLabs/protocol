import Box from "@material-ui/core/Box";
import React, { FC } from "react";
import Lottie from "react-lottie";

import * as confettiAnimation from "@extension-onboarding/assets/lotties/confetti.json";
import { useStyles } from "@extension-onboarding/components/VisualAlert/VisualAlert.style";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";

const VisualAlert: FC = () => {
  const classes = useStyles();
  const { setVisualAlert } = useNotificationContext();
  const onAnimationEnd = () => {
    setVisualAlert(false);
  };
  return (
    <Box className={classes.wrapper}>
      <Lottie
        isClickToPauseDisabled
        options={{
          loop: false,
          autoplay: true,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
          animationData: confettiAnimation,
        }}
        eventListeners={[
          {
            eventName: "complete",
            callback: onAnimationEnd,
          },
        ]}
      />
    </Box>
  );
};

export default VisualAlert;
