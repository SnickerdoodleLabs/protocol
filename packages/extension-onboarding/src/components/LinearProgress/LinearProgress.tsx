import { createStyles, withStyles, LinearProgress } from "@material-ui/core";
import React from "react";

export default withStyles(() =>
  createStyles({
    root: {
      height: 8,
      borderRadius: 4,
    },
    colorPrimary: {
      backgroundColor: "#F5F5F5",
    },
    bar: {
      borderRadius: 5,
      backgroundColor: "#616161",
    },
  }),
)(LinearProgress);
