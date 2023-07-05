import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    minWidth: 256,
    maxWidth: 256,
    height: "100vh",
    alignItems: "center",
    backgroundColor: "#F3F2F8",
  },
  linkAccountButtonIcon: {
    fontSize: 24,
  },
  linkAccountButtonText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
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
