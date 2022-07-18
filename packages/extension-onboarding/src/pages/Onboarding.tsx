import SnickerProgressBar from "@browser-extension/components/SnickerProgressBar";
import { Button, Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Logo from "@extension-onboarding/assets/icons/snickerdoodleLogo.svg";
import BuildYourProfile from "./BuildYourProfile/BuildYourProfile";
import LinkAccount from "./LinkAccount/LinkAccount";
import { ProviderContext } from "@browser-extension/Context/ProviderContext";
import { IProvider } from "@browser-extension/services/providers";

const useStyles = makeStyles({
  primaryButton: {
    textTransform: "unset",
    padding: "21px 36px 10px 22px",
    boxShadow: "8px 8px 0px 0px rgb(0 0 0)",
    background: "#8079B4",
    color: "#fff",
    borderColor: "#000",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "black",
      borderColor: "inherit",
    },
  },
  primaryButtonIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
  },
});

export default function Onboarding() {
  const [progressValue, setProgressValue] = useState(0);

  const returnState = (value) => {
    const stateArray = [
      <LinkAccount />,
      <BuildYourProfile />,
      <h3>STEP 3 </h3>,
    ];
    return stateArray[value];
  };
  const classes = useStyles();
  return (
    <Grid
      style={{
        paddingLeft: "calc(100vw*120/1440)",
        paddingTop: "calc(100vw*64/1440)",
      }}
    >
      <Grid>
        <img src={Logo} />
      </Grid>
      <SnickerProgressBar progressStatus={progressValue} />
      {returnState(progressValue)}
      <Grid
        style={{
          position: "absolute",
          right: "calc(100vw*150/1440)",
        }}
      >
        <Grid style={{ display: "flex", alignItems: "center" }}>
          {progressValue > 0 ? (
            <h4
              onClick={() => {
                setProgressValue(progressValue - 1);
              }}
              style={{ paddingRight: "10px", cursor: "pointer" }}
            >
              Back
            </h4>
          ) : (
            ""
          )}
          {progressValue < 2 ? (
            <Button
              onClick={() => {
                setProgressValue(progressValue + 1);
              }}
              variant="outlined"
              color="primary"
              className={classes.primaryButton}
            >
              {`Next   `}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 17 16"
                fill="#fff"
                fillRule="evenodd"
                strokeLinecap="square"
                strokeWidth={2}
                stroke="#fff"
                aria-hidden="true"
                className={classes.primaryButtonIcon}
              >
                <path d="M1.808 14.535 14.535 1.806" className="arrow-body" />
                <path
                  d="M3.379 1.1h11M15.241 12.963v-11"
                  className="arrow-head"
                />
              </svg>
            </Button>
          ) : (
            ""
          )}
        </Grid>
      </Grid>
      <Grid style={{ height: "100px", width: "50px" }}></Grid>
    </Grid>
  );
}
