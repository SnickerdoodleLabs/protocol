import { Box, Dialog, IconButton, Typography } from "@material-ui/core";
import React, { ReactNode } from "react";
import { useStyles } from "@app/Content/components/Modals/BasicModal/BasicModal.style";
import { useGenericModalStyles } from "@app/Content/components/Modals/Modal.style";
import CloseIcon from "@material-ui/icons/Close";

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
  const modalClasses = useGenericModalStyles();
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
