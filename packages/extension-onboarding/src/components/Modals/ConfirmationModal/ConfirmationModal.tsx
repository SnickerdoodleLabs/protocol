import { useStyles } from "@extension-onboarding/components/Modals/ConfirmationModal/ConfirmationModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { SDButton } from "@snickerdoodlelabs/shared-components";
import React, { FC } from "react";

const ConfirmationModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const { title, content, primaryButtonText } = customProps;

  const classes = useStyles();
  return (
    <Dialog open={true} fullWidth className={classes.container}>
      <Box p={5}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography className={classes.title}>{title}</Typography>
          <IconButton
            disableFocusRipple
            disableRipple
            disableTouchRipple
            aria-label="close"
            onClick={closeModal}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <Box mt={5}>
          <Typography className={classes.description}>{content}</Typography>
        </Box>
        <Box mt={5} display="flex" justifyContent="flex-end">
          <Box mr={3}>
            <SDButton
              onClick={() => {
                closeModal();
              }}
              className={classes.secondaryButton}
            >
              Cancel
            </SDButton>
          </Box>
          <SDButton
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
            className={classes.primaryButton}
          >
            {primaryButtonText}
          </SDButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
