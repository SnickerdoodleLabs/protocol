import { Button, Box, makeStyles, Dialog, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";
import phantomStepsImage from "@extension-onboarding/assets/images/phantom-steps.png";
import phantomPlaceholderImage from "@extension-onboarding/assets/images/phantom-placeholder.png";
import { useStyles } from "@extension-onboarding/components/Modals/PhantomLinkingSteps/PhantomLinkingSteps.style";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useLayoutContext } from "@extension-onboarding/Context/LayoutContext";

const PhantomLinkingSteps: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick,customProps } = modalState;

  const classes = useStyles();
  return (
    <Dialog open={true} fullWidth className={classes.container}>
      <Box p={5}>
        <Typography className={classes.title}>
          Account Already Linked
        </Typography>
        <Box bgcolor="#FFF3DF" mt={6} p={1.25}>
          <Typography>{`You have already linked the ${customProps?.accountAddress} account.`}</Typography>
        </Box>
        <Box mt={3}>
          <Typography className={classes.description}>
            You can link another wallet account by using these steps:
          </Typography>
        </Box>
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Box display="flex" flex={1}>
            <img src={phantomPlaceholderImage} />
          </Box>
          <Box display="flex" alignItems="center" flex={3} pl={5}>
            <Box width="100%">
              <img src={phantomStepsImage} />
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end"  mt={5}>
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
