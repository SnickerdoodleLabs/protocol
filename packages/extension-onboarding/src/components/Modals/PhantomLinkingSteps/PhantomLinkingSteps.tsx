import { Button, Box, makeStyles, Dialog, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";

import phantomPlaceholderImage from "@extension-onboarding/assets/images/phantom-placeholder.png";
import phantomStepsImage from "@extension-onboarding/assets/images/phantom-steps.png";
import { useStyles } from "@extension-onboarding/components/Modals/PhantomLinkingSteps/PhantomLinkingSteps.style";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

const PhantomLinkingSteps: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { accountAddress } = customProps;

  const classes = useStyles();
  return (
    <Dialog open={true} fullWidth className={classes.container}>
      <Box p={5}>
        <Typography className={classes.title}>
          Account Already Linked
        </Typography>
        <Box bgcolor="#FFF3DF" mt={6} p={1.25}>
          <Typography className={classes.description}>
            You have already linked the
            <span className={classes.accountTxt}>
              {accountAddress
                ? " " +
                  accountAddress.slice(0, 5) +
                  "................" +
                  accountAddress.slice(-4) +
                  " "
                : " "}
            </span>
            account.
          </Typography>
        </Box>
        <Box mt={3}>
          <Typography className={classes.description}>
            You can link another wallet account by using these steps:
          </Typography>
        </Box>
        <Box
          display="flex"
          flex={1}
          justifyContent="center"
          className={classes.phantomPlaceholderImageXS}
          mt={5}
        >
          <img src={phantomPlaceholderImage} />
        </Box>
        <Box mt={5} display="flex" justifyContent="center">
          <Box
            display="flex"
            flex={1}
            className={classes.phantomPlaceholderImage}
          >
            <img src={phantomPlaceholderImage} />
          </Box>
          <Box
            display="flex"
            alignItems="center"
            flex={3}
            pl={{ xs: 0, sm: 3, md: 5, lg: 5 }}
          >
            <Box width={{ xs: "50px", sm: "50px", md: "70px", lg: "100%" }}>
              <img src={phantomStepsImage} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" mt={5}>
          <PrimaryButton
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
          >
            Got it!
          </PrimaryButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default PhantomLinkingSteps;
