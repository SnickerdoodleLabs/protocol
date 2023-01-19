import Button from "@extension-onboarding/components/Button";
import { useStyles } from "@extension-onboarding/components/Modals/CustomizableModal/CustomizableModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import { Box, Dialog, Typography, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { FC } from "react";

interface ICustomizableModal {
  title: string;
  message: string;
  primaryButtonText: string;
  secondaryButtonText?: string;
}

const CustomizableModal: FC<ICustomizableModal> = ({
  title,
  message,
  primaryButtonText,
  secondaryButtonText,
}) => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick, customProps } = modalState;
  const primaryClicked: () => void = customProps.primaryClicked;
  const secondaryClicked: () => void = customProps.secondaryClicked;

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
      <Typography className={classes.contentSubtitle}>{message}</Typography>
      <Box mt={4} display="flex">
        <Box marginLeft="auto" mr={2}>
          {secondaryButtonText ? (
            <Button buttonType="secondary" onClick={secondaryClicked}>
              {secondaryButtonText}
            </Button>
          ) : (
            ""
          )}
        </Box>
        <Button
          buttonType="primary"
          onClick={() => {
            primaryClicked();
            closeModal();
          }}
        >
          {primaryButtonText}
        </Button>
      </Box>
    </Dialog>
  );
};

export default CustomizableModal;
