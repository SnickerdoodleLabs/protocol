import {
  Box,
  Checkbox,
  Color,
  Grid,
  Slide,
  Snackbar,
  SnackbarOrigin,
  Typography,
} from "@material-ui/core";
import Browser from "webextension-polyfill";
import React, { FC, useEffect, useState } from "react";
import { useStyles } from "@extension-onboarding/components/CustomizedAlert/CustomizedAlert.style";
import {
  EAlertSeverity,
  SEVERITY_COLORS,
} from "@extension-onboarding/components/CustomizedAlert/CustomizedAlert.constants";

export interface State extends SnackbarOrigin {
  open: boolean;
}
export interface ICustomizedAlertProps {
  message: string;
  onClose: () => void;
  severity?: EAlertSeverity;
}
const CustomizedAlert: FC<ICustomizedAlertProps> = ({
  message,
  onClose,
  severity = EAlertSeverity.SUCCESS,
}) => {
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <Snackbar
      TransitionComponent={(props) => <Slide {...props} direction="down" />}
      autoHideDuration={5000}
      open={true}
      className={classes.container}
      onClose={(event, reason) => {
        if (reason === "clickaway") {
          return;
        }
        handleClose();
      }}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Box px={5} py={2} bgcolor={SEVERITY_COLORS[severity]} zIndex={9999}>
        <Typography className={classes.message}>{message}</Typography>
      </Box>
    </Snackbar>
  );
};

export default CustomizedAlert;
