import {
  Box,
  Checkbox,
  Grid,
  Snackbar,
  SnackbarOrigin,
  Typography,
} from "@material-ui/core";
import { useStyles } from "@synamint-extension-sdk/content/components/ScamFilterComponent/SafeUrlNotification";
import { ExternalCoreGateway } from "@synamint-extension-sdk/gateways";
import React, { FC } from "react";
import Browser from "webextension-polyfill";

export interface State extends SnackbarOrigin {
  open: boolean;
}
interface ISafeURLNotificationProps {
  coreGateway: ExternalCoreGateway;
}
const SafeUrlNotification: FC<ISafeURLNotificationProps> = ({
  coreGateway,
}) => {
  const [safeState, setSafeState] = React.useState<State>({
    open: true,
    vertical: "top",
    horizontal: "right",
  });
  const [dontShow, setDontShow] = React.useState(false);

  const { vertical, horizontal, open } = safeState;

  const classes = useStyles();

  const handleClose = () => {
    setSafeState({ ...safeState, open: false });
  };

  const handleDontShow = () => {
    coreGateway.setScamFilterSettings(true, dontShow);
    setDontShow(!dontShow);
  };

  return (
    <Snackbar
      autoHideDuration={544000}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
    >
      <>
        <Grid container direction="row" className={classes.container}>
          <img
            onClick={handleClose}
            className={classes.closeImg}
            src="https://storage.googleapis.com/dw-assets/extension/close.svg"
          />
          <Grid item className={classes.container2}>
            <img
              className={classes.safeImg}
              src="https://storage.googleapis.com/dw-assets/extension/safe-url.png"
            />
          </Grid>

          <Grid item>
            <Typography className={classes.title} variant="h3" component="h4">
              Verified URL
            </Typography>
            <Typography
              className={classes.learnMore}
              variant="h3"
              component="h4"
            >
              Learn More
            </Typography>
            <Typography className={classes.dontShow}>
              <Checkbox
                color="primary"
                checked={dontShow}
                onChange={handleDontShow}
              />
              Don't show again
            </Typography>
          </Grid>
        </Grid>
      </>
    </Snackbar>
  );
};

export default SafeUrlNotification;
