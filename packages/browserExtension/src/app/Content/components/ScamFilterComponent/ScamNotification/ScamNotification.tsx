import { Button, Grid, Typography } from "@material-ui/core";
import Browser from "webextension-polyfill";
import React, { FC } from "react";
import { useStyles } from "./ScamNotification.style";
import { IScamNotification } from "./ScamNotification.interface";

const ScamNotification: FC<IScamNotification> = ({ safeURL }) => {
  const [dangerousOpen, setDangerousOpen] = React.useState(true);


  function acceptRiskHandler() {
    setDangerousOpen(false);
  }

  const classes = useStyles();
  return (
    <Grid>
      {dangerousOpen ? (
        <Grid className={classes.container}>
          <Grid className={classes.container2}>
            <Grid style={{ display: "flex" }}>
              <img
                className={classes.dangerousImg}
                src={Browser.runtime.getURL("assets/img/dangerousIcon.svg")}
              />
              <Grid>
                <Typography className={classes.title} variant="h4">
                  Dangerous URL!
                </Typography>
              </Grid>
            </Grid>
            <Grid className={classes.textContainer}>
              <Typography className={classes.text} variant="h4">
                Snickerdoodle believes this domain could currently compromise
                your security.
              </Typography>
              <Typography className={classes.text2} variant="h4">
                This is because the site tested positive on the Snickerdoodle
                checklist. This includes malicious <br></br> websites and
                legitimate websites that is a malicious actor has compromised.
              </Typography>
              <Typography className={classes.text2} variant="h4">
                <b>
                  We believe that you wanted to visit {safeURL}. Do you
                  want to go to {safeURL}
                </b>
              </Typography>
              <Grid className={classes.bottomContainer}>
                <Button
                  onClick={() => {
                    window.location.href = `${safeURL}`;
                  }}
                  variant="outlined"
                  color="primary"
                  className={classes.primaryButton}
                >
                  {`Go to ${safeURL}`}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 17 16"
                    fill="none"
                    fillRule="evenodd"
                    strokeLinecap="square"
                    strokeWidth={2}
                    stroke="currentColor"
                    aria-hidden="true"
                    className={classes.primaryButtonIcon}
                  >
                    <path
                      d="M1.808 14.535 14.535 1.806"
                      className="arrow-body"
                    />
                    <path
                      d="M3.379 1.1h11M15.241 12.963v-11"
                      className="arrow-head"
                    />
                  </svg>
                </Button>

                <Grid className={classes.acceptRiskContainer}>
                  <Typography
                    onClick={acceptRiskHandler}
                    className={classes.text3}
                    variant="h4"
                  >
                    Accept the Risk
                  </Typography>
                </Grid>
                <Grid className={classes.learnMoreContainer}>
                  <Typography className={classes.text3} variant="h4">
                    Learn More
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default ScamNotification;
