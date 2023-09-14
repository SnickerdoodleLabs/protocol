import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 256,
    maxWidth: 256,
    [theme.breakpoints.down("md")]: {
      minWidth: 251,
      maxWidth: 251,
    },
    [theme.breakpoints.down("sm")]: {
      minWidth: 82,
      maxWidth: 82,
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },
    height: "100vh",
    alignItems: "center",
    backgroundColor: "#F3F2F8",
  },
  linkAccountButtonIcon: {
    fontSize: 24,
    color: "#F2F4F7",
  },
  linkAccountButtonText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#F2F4F7",
  },
  routeWrapper: {
    cursor: "pointer",
  },
  mainRouteIcon: {
    width: 16,
    height: "auto",
  },
  routeText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "22px",
    color: "#27262C",
  },
  textActive: {
    fontWeight: 700,
  },
  button: {
    cursor: "pointer",
  },
  link: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14px",
    lineHeight: "22px",
    marginLeft: 20,
    cursor: "pointer",
    color: "#7D72AC",
  },
}));
