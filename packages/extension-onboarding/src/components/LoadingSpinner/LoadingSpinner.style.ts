import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles({
  loadingWrapper: {
    width: "100%",
    height: "100%",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    position: "fixed",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999999999,
  },
});
