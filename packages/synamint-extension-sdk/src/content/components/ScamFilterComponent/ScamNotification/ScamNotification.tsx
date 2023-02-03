import { Button, Grid, Typography } from "@material-ui/core";
import { useStyles } from "@synamint-extension-sdk/content/components/ScamFilterComponent/ScamNotification";
import { safeURLsObject } from "@synamint-extension-sdk/content/constants";
import React, { FC } from "react";
import Browser from "webextension-polyfill";

const ScamNotification: FC = () => {
  const [dangerousOpen, setDangerousOpen] = React.useState(true);
  const safeURL = safeURLsObject[window.location.hostname];

  function acceptHandler() {
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
              {safeURL && (
                <Typography className={classes.text2} variant="h4">
                  <b>
                    We believe that you wanted to visit{" "}
                    {safeURL.replace("https://", "")}. Do you want to go to{" "}
                    {safeURL.replace("https://", "")}
                  </b>
                </Typography>
              )}
              <Grid className={classes.bottomContainer}>
                {safeURL && (
                  <Button
                    onClick={() => {
                      window.open(
                        `${safeURL.replace("https://", "")}`,
                        "_self",
                      );
                    }}
                    variant="outlined"
                    color="primary"
                    className={classes.primaryButton}
                  >
                    {`Go to ${safeURL.replace("https://", "")}`}
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
                )}

                <Grid className={classes.acceptRiskContainer}>
                  <Typography
                    onClick={acceptHandler}
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
