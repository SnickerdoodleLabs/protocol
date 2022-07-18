import { Grid, makeStyles } from "@material-ui/core";
import React, { useEffect, useState } from "react";

export default function SnickerButton({ number, status }: any) {
  const [click, setClick] = useState(false);

  useEffect(() => {
    if (number <= status + 1) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [status]);

  const classes = useStyles();
  return (
    <>
      <Grid
        className={click ? classes.button1Clicked : classes.button1UnClicked}
      ></Grid>
      <Grid
        className={click ? classes.button2Clicked : classes.button2UnClicked}
      >
        <h3 className={classes.number}>{number}</h3>
      </Grid>
    </>
  );
}

const useStyles = makeStyles({
  number: {
    fontSize: "30px",
    color: "#808080",
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
    position: "absolute",
    marginLeft: "17px",
    marginTop: "6px",
  },
  button1Clicked: {
    width: "50px",
    height: "50px",
    borderRadius: "50px",
    background: "#808080",
    marginLeft: "9px",
  },
  button1UnClicked: {
    width: "50px",
    height: "50px",
    borderRadius: "50px",
    background: "#808080",
    marginLeft: "9px",
  },
  button2Clicked: {
    position: "absolute",
    width: "50px",
    height: "50px",
    borderRadius: "50px",
    background: "#FDF3E1",
    marginTop: "-50px",
    marginLeft: "9px",
    border: "1px solid #808080",
  },
  button2UnClicked: {
    position: "absolute",
    width: "50px",
    height: "50px",
    borderRadius: "50px",
    background: "#FDF3E1",
    marginTop: "-55px",
    border: "1px solid #808080",
  },
});
