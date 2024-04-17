import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import Box from "@material-ui/core/Box";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import {
  CloseButton,
  SDButton,
  SDTypography,
} from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

export interface IConfirmationModal {
  title: string;
  description: string;
  actionText?: string;
  showCancelButton?: boolean;
}

const ConfirmationModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const {
    title,
    description,
    actionText = "Confirm",
    showCancelButton = true,
  } = customProps as IConfirmationModal;

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
        <Box
          display="flex"
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <SDTypography variant="titleLg" fontWeight="bold" color="textHeading">
            {title}
          </SDTypography>

          <CloseButton onClick={closeModal} />
        </Box>
        <Box mt={2} display="flex" justifyContent="flex-start">
          <SDTypography variant="bodyLg">{description}</SDTypography>
        </Box>
        <Box display="flex" mt={3} justifyContent="flex-end">
          <Grid container spacing={2} justifyContent="flex-end">
            {showCancelButton && (
              <Grid item className={modalClasses.buttonWrapper50}>
                <SDButton
                  fullWidth
                  onClick={closeModal}
                  variant="outlined"
                  color="danger"
                >
                  Cancel
                </SDButton>
              </Grid>
            )}
            <Grid
              item
              className={
                showCancelButton
                  ? modalClasses.buttonWrapper50
                  : modalClasses.buttonWrapperFullWidth
              }
            >
              <SDButton
                variant="contained"
                fullWidth
                color="danger"
                onClick={() => {
                  onPrimaryButtonClick();
                  closeModal();
                }}
              >
                {actionText}
              </SDButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
