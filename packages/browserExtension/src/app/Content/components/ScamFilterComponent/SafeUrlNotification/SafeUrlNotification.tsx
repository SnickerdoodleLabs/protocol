import {
  Checkbox,
  Grid,
  Slide,
  Snackbar,
  SnackbarOrigin,
  Typography,
} from "@material-ui/core";
import Browser from "webextension-polyfill";
import React, { FC, useEffect } from "react";
import { useStyles } from "./SafeUrlNotification.style";

export interface State extends SnackbarOrigin {
  open: boolean;
}
const SafeUrlNotification: FC = () => {
  const [safeState, setSafeState] = React.useState<State>({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const [dontShow, setDontShow] = React.useState(false);

  const { vertical, horizontal, open } = safeState;

  const classes = useStyles();

  useEffect(() => {
    Browser.storage.local.get("safeDontShow").then((option) => {
      if (option.safeDontShow) {
        setSafeState({ ...safeState, open: false });
      } else {
        setSafeState({ ...safeState, open: true });
      }
    });
  }, []);

  const handleClose = () => {
    if (dontShow) {
      Browser.storage.local.set({ safeDontShow: true });
    }
    setSafeState({ ...safeState, open: false });
  };

  const handleDontShow = () => {
    setDontShow(!dontShow);
  };

  return (
    <Snackbar
      // TransitionComponent={(props) => <Slide {...props} direction="left" />}
      autoHideDuration={5000}
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      key={vertical + horizontal}
    >
      <Grid container direction="row" className={classes.container}>
        <img
          onClick={handleClose}
          className={classes.closeImg}
          src={Browser.runtime.getURL("assets/img/safeClose.svg")}
        />
        <Grid item className={classes.container2}>
          <img
            className={classes.safeImg}
            src={Browser.runtime.getURL("assets/img/safe.png")}
          />
        </Grid>

        <Grid item>
          <Typography className={classes.title} variant="h3" component="h4">
            Verified URL
          </Typography>
          <Typography className={classes.learnMore} variant="h3" component="h4">
            Learn More
          </Typography>
          <Typography className={classes.dontShow}>
            <Checkbox
              className={classes.checkbox}
              checked={dontShow}
              onChange={handleDontShow}
            />
            Don't show again
          </Typography>
        </Grid>
      </Grid>
    </Snackbar>
  );
};

export default SafeUrlNotification;
