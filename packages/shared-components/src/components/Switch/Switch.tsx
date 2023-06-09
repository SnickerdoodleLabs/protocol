import { Switch as MUISSwitch } from "@material-ui/core";
import { withStyles } from "@material-ui/styles";

export const Switch = withStyles({
  switchBase: {
    color: "#F5F5F5",
    "&$checked": {
      color: "#F5F5F5",
    },
    "&$checked + $track": {
      backgroundColor: "#8079B4",
      opacity: 1,
    },
  },
  checked: {},
  track: {},
})(MUISSwitch);
