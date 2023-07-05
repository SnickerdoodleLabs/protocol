import { Radio as MUIRadio, RadioProps, withStyles } from "@material-ui/core";
import React from "react";

export const Radio = withStyles({
  root: {
    color: "#8079B4",
    "&$checked": {
      color: "#8079B4",
    },
  },
  checked: {},
})((props: RadioProps) => <MUIRadio color="default" {...props} />);
