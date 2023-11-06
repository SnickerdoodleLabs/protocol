import { useModalStyles } from "@extension-onboarding/components/Modals/Modal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog } from "@material-ui/core";
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
}

const ConfirmationModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const {
    title,
    description,
    actionText = "Confirn",
  } = customProps as IConfirmationModal;

  const modalClasses = useModalStyles();
  return (
    <Dialog open={true} fullWidth className={modalClasses.container}>
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
        <Box display="flex" marginLeft="auto" mt={3} justifyContent="flex-end">
          <SDButton onClick={closeModal} variant="outlined" color="danger">
            Cancel
          </SDButton>
          <Box ml={2} />
          <SDButton
            variant="contained"
            color="danger"
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
          >
            {actionText}
          </SDButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
