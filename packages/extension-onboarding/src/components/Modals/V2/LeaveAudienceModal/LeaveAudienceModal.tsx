import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, makeStyles } from "@material-ui/core";
import {
  CloseButton,
  SDButton,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 720,
    },
  },
}));

const LeaveAudienceModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick } = modalState;

  const classes = useStyles();
  return (
    <Dialog open={true} fullWidth className={classes.container}>
      <Box p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <SDTypography variant="titleLg" fontWeight="bold" color="textHeading">
            We’re Sorry to See You Go!
          </SDTypography>
          <CloseButton onClick={closeModal} />
        </Box>
        <Box
          bgcolor="#FFE0E0"
          borderRadius={2}
          px={2}
          py={1}
          border="1px solid #EB5C5D"
          my={4}
        >
          <SDTypography variant="bodyMd">
            Clicking “unsubscribe” means you'll miss out on awesome updates.{" "}
            <br />
            <br /> Are you sure you want to unsubscribe?
          </SDTypography>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box mr={2}>
            <SDButton
              variant="outlined"
              color="danger"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </SDButton>
          </Box>
          <SDButton
            color="danger"
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
          >
            Unsubscribe
          </SDButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LeaveAudienceModal;
