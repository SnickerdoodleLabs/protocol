import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    top: "0 !important",
    zIndex: 9999,
  },
  message: {
    fontFamily: "Space Grotesk'",
    fontSize: 14,
    fontWeight: 500,
    color: "#232039",
  },
}));
