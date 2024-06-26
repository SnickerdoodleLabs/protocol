import Box from "@material-ui/core/Box";
import Snackbar, { SnackbarOrigin } from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import React, { FC, memo } from "react";
import {
  EAlertSeverity,
  SEVERITY_COLORS,
  SEVERITY_TEXT_COLORS,
} from "@extension-onboarding/components/CustomizedAlert/CustomizedAlert.constants";
import { useStyles } from "@extension-onboarding/components/CustomizedAlert/CustomizedAlert.style";
import { useNotificationContext } from "@extension-onboarding/context/NotificationContext";

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
  const {} = useNotificationContext();
  const classes = useStyles();

  const handleClose = () => {
    onClose();
  };

  return (
    <Snackbar
      disableWindowBlurListener
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
        <Typography
          className={classes.message}
          style={{ color: SEVERITY_TEXT_COLORS[severity] }}
        >
          {message}
        </Typography>
      </Box>
    </Snackbar>
  );
};

export default memo(CustomizedAlert);
