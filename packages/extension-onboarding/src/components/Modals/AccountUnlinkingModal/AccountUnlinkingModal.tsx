import { Button, Box, makeStyles, Dialog, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useMemo, useState, FC } from "react";
import { useStyles } from "@extension-onboarding/components/Modals/AccountUnlinkingModal/AccountUnlinkingModal.style";
import PrimaryButton from "@extension-onboarding/components/PrimaryButton";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";

const AccountUnlinkingModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick } = modalState;

  const classes = useStyles();
  return (
    <Dialog open={true} fullWidth className={classes.container}>
      <Box p={5}>
        <Typography className={classes.title}>Unlink Account</Typography>
        <Box mt={5}>
          <Typography className={classes.description}>
            Are you sure you want to unlink this account?
          </Typography>
        </Box>
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Box mr={3}>
            <PrimaryButton
              onClick={() => {
                closeModal();
              }}
              className={classes.secondaryButton}
            >
              Cancel
            </PrimaryButton>
          </Box>
          <PrimaryButton
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
            className={classes.primaryButton}
          >
            Unlink
          </PrimaryButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AccountUnlinkingModal;
