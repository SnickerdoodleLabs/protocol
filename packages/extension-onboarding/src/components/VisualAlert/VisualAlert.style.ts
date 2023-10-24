import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  wrapper: {
    width: "100%",
    maxWidth: 1440,
    height: "100%",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99999,
  },
});
