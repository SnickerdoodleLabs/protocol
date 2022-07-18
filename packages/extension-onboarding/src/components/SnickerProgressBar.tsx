import { Grid, makeStyles } from "@material-ui/core";
import React from "react";
import SnickerButton from "./SnickerButton";

export default function SnickerProgressBar({ progressStatus }) {
  const classes = useStyles();
  return (
    <Grid className={classes.progressContainer}>
      <Grid>
        <SnickerButton number="1" status={progressStatus} />
        <h4 className={classes.linkYourAccounts}>Link your Accounts</h4>{" "}
      </Grid>
      <Grid className={classes.lineData}></Grid>
      <Grid>
        <SnickerButton number="2" status={progressStatus} />
        <h4 className={classes.buildYourProfile}>Build your Profile</h4>
      </Grid>
      <Grid className={classes.lineData}></Grid>
      <Grid>
        <SnickerButton number="3" status={progressStatus} />
        <h4 className={classes.viewYourDataText}>View your Data</h4>
      </Grid>
    </Grid>
  );
}
const useStyles = makeStyles({
  viewYourDataText: {
    position: "absolute",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    marginLeft: "-30px",
  },
  lineData: {
    width: "84px",
    height: "1px",
    background: "#000",
    marginLeft: "35px",
    marginRight: "35px",
  },
  buildYourProfile: {
    position: "absolute",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    marginLeft: "-40px",
  },
  linkYourAccounts: {
    position: "absolute",
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 500,
    fontSize: "16px",
    marginLeft: "-45px",
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    marginTop: "50px",
    marginLeft: "330px",
  },
});
