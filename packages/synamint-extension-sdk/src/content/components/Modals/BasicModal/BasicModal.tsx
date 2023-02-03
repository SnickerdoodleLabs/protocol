import { useStyles } from "@synamint-extension-sdk/content/components/Modals/BasicModal/BasicModal.style";
import { Box, Dialog, IconButton, Typography } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React, { ReactNode } from "react";

interface IBasicModalProps {
  title: string;
  content: ReactNode;
  onCloseButtonClick: () => void;
}

const BasicModal = ({
  title,
  onCloseButtonClick,
  content,
}: IBasicModalProps) => {
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
          //   className={modalClasses.closeButton}
          onClick={onCloseButtonClick}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {content}
    </Dialog>
  );
};

export default BasicModal;
