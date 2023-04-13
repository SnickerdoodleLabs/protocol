import { useStyles } from "@extension-onboarding/components/Modals/LeaveCohortModal/LeaveCohortModal.style";
import { useLayoutContext } from "@extension-onboarding/context/LayoutContext";
import {
  Box,
  Dialog,
  IconButton,
  Typography,
  ButtonProps,
  Button as MaterialButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles } from "@material-ui/styles";
import React, { FC } from "react";

const CancelButton = withStyles({
  root: {
    paddingLeft: 16,
    paddingRight: 16,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    color: "#D32F2F",
    border: "1px solid",
    borderColor: "#D32F2F",
    fontStyle: "normal",
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    height: 43,
    fontSize: "14px",
    lineHeight: "28px",
    textTransform: "none",
    backgroundColor: "#fff",
    "&:hover": {
      backgroundColor: "#fff",
    },
  },
})(MaterialButton);

const UnsubscribeButton = withStyles({
  root: {
    paddingLeft: 16,
    paddingRight: 16,
    boxShadow: "0px 2px 0px rgba(0, 0, 0, 0.016)",
    color: "#fff",
    fontStyle: "normal",
    fontFamily: "Space Grotesk",
    fontWeight: 400,
    height: 43,
    fontSize: "14px",
    lineHeight: "18px",
    textTransform: "none",
    backgroundColor: "#D32F2F",
    "&:hover": {
      backgroundColor: "#D32F2F",
    },
  },
})(MaterialButton);

const LeaveCohortModal: FC = () => {
  const { modalState, closeModal } = useLayoutContext();
  const { onPrimaryButtonClick } = modalState;

  const classes = useStyles();
  return (
    <Dialog open={true} fullWidth className={classes.container}>
      <Box p={3}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography className={classes.title}>
            We’re Sorry to See You Go!
          </Typography>
          <CloseIcon className={classes.closeIcon} onClick={closeModal} />
        </Box>
        <Box
          bgcolor="#FFE0E0"
          borderRadius={2}
          px={2}
          py={1}
          border="1px solid #EB5C5D"
          my={4}
        >
          <Typography>
            Clicking “unsubscribe” means you'll miss out on awesome updates.{" "}
            <br /> Are you sure you want to unsubscribe?
          </Typography>
        </Box>
        <Box display="flex" justifyContent="flex-end">
          <Box mr={3}>
            <CancelButton
              variant="contained"
              onClick={() => {
                closeModal();
              }}
            >
              Cancel
            </CancelButton>
          </Box>
          <UnsubscribeButton
            variant="contained"
            onClick={() => {
              onPrimaryButtonClick();
              closeModal();
            }}
          >
            Unsubscribe
          </UnsubscribeButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default LeaveCohortModal;
