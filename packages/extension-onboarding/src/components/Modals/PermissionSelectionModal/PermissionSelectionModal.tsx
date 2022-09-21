import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/PermissionSelectionModal/PermissionSelectionModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";

const PermissionSelectionModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const onManageClicked: () => void = customProps.onManageClicked;

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
        mb={4}
        alignItems="center"
        justifyContent="space-between"
      >
        <Typography className={classes.title}>
          Manage Your Data Permissions
        </Typography>
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
      <Typography className={classes.contentSubtitle}>
        By clicking “Accept All” you are giving permission for the use of your
        demographic info and wallet activity.
      </Typography>
      <Box mt={4} display="flex">
        <Box marginLeft="auto" mr={2}>
          <Button buttonType="secondary" onClick={onManageClicked}>
            Manage Settings
          </Button>
        </Box>
        <Button
          buttonType="primary"
          onClick={() => {
            onPrimaryButtonClick();
            closeModal();
          }}
        >
          Accept All
        </Button>
      </Box>
    </Dialog>
  );
};

export default PermissionSelectionModal;
