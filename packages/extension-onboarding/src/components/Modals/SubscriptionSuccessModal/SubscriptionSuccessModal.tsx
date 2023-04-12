import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/SubscriptionSuccessModal/SubscriptionSuccessModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, Typography, IconButton, Grid } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { useEffect, FC, useState } from "react";

const SubscriptionSuccessModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const {
    onPrimaryButtonClick,
    customProps: { campaignImage, campaignName } = {},
  } = modalState;

  const classes = useStyles();
  return (
    <Dialog
      PaperProps={{
        square: true,
      }}
      open={true}
      disablePortal
      maxWidth="sm"
      fullWidth
      className={classes.container}
    >
      <Box
        display="flex"
        mb={3}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.title}>Congrats!</Typography>
        <IconButton
          disableFocusRipple
          disableRipple
          disableTouchRipple
          aria-label="close"
          onClick={() => {
            closeModal();
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      <>
        <Box flexDirection="column" display="flex">
          <Box display="flex" alignItems="center" justifyContent="center">
            <img
              style={{
                width: 230,
                height: 230,
                objectFit: "cover",
                borderRadius: 8,
              }}
              src={campaignImage}
            />
          </Box>
          <Box mt={3} mb={1}>
            <Typography className={classes.subtitle}>
              {`You Subcribed to ${campaignName} Rewards Program`}
            </Typography>
          </Box>
          <Typography className={classes.content}>
            Snickerdoodle is delivering your reward!
          </Typography>
        </Box>
        <Box mt={3} display="flex">
          <Box marginLeft="auto">
            <Button
              buttonType="primary"
              onClick={() => {
                closeModal();
              }}
            >
              Ok
            </Button>
          </Box>
        </Box>
      </>
    </Dialog>
  );
};

export default SubscriptionSuccessModal;
