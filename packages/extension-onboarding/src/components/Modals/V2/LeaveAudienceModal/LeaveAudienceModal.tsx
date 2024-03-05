import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, Grid } from "@material-ui/core";
import {
  CloseButton,
  SDButton,
  SDTypography,
  useMedia,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

const LeaveAudienceModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick } = modalState;
  const currentBreakpoint = useMedia();
  const modalClasses = useModalStyles();
  return (
    <Dialog
      open={true}
      disablePortal={true}
      disableEnforceFocus={true}
      fullWidth
      className={modalClasses.container}
    >
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
          <Grid container spacing={2} justifyContent="flex-end">
            <Grid item className={modalClasses.buttonWrapper50}>
              <SDButton
                variant="outlined"
                color="danger"
                fullWidth
                onClick={() => {
                  closeModal();
                }}
              >
                Cancel
              </SDButton>
            </Grid>
            <Grid item className={modalClasses.buttonWrapper50}>
              <SDButton
                color="danger"
                fullWidth
                onClick={() => {
                  onPrimaryButtonClick();
                  closeModal();
                }}
              >
                Unsubscribe
              </SDButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LeaveAudienceModal;
