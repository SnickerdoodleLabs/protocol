import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles({
  loadingWrapper: {
    width: "100%",
    maxWidth: 1440,
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },
});
