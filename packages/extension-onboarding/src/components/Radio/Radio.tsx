import { Radio, RadioProps, withStyles } from "@material-ui/core";
import React from "react";

export default withStyles({
  root: {
    color: "#8079B4",
    "&$checked": {
      color: "#8079B4",
    },
  },
  checked: {},
})((props: RadioProps) => <Radio color="default" {...props} />);
