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
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
  },
  routeWrapper: {
    cursor: "pointer",
  },
  mainRouteIcon: {
    width: 16,
    height: "auto",
  },
  mainRouteText: {
    fontFamily: "Space Grotesk",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "14px",
    letterSpacing: "0em",
  },
  subrouteText: {
    fontFamily: "Space Grotesk",
    fontSize: "14px",
    fontWeight: 500,
    lineHeight: "14px",
    letterSpacing: "0em",
    textAlign: "left",
  },
  textActive: {
    fontWeight: 700,
  },
  button: {
    cursor: "pointer",
  },
  link: {
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14.05px",
    lineHeight: "17px",
    marginLeft: 20,
    cursor: "pointer",
    textDecorationLine: "underline",
    color: "#7D72AC",
  },
}));
