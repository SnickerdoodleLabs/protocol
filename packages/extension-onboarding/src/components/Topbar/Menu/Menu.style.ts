import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      width: "80%",
    },
    [theme.breakpoints.up("lg")]: {
      width: "70%",
    },
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
    width: "100%",
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
