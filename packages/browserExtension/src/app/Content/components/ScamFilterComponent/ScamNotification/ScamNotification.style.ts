import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    position: "fixed",
    top: 0,
    left: "calc(50vw - 543px)",
    zIndex: 9999,
  },
  container2: {
    width: "1086px",
    height: "396px",
    background: "#C62828",
  },
  dangerousImg: {
    padding: "64px 44px 40px 44px",
  },
  title: {
    fontSize: "32px",
    fontFamily: "'Shrikhand', cursive !important",
    fontStyle: "italic",
    color: "#FFFFFF",
    paddingTop: "64px",
  },
  text: {
    fontSize: "14px",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontWeight: 400,
    color: "#fff",
  },
  text2: {
    fontSize: "14px",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontWeight: 400,
    color: "#fff",
    paddingTop: "32px",
    cursor: "pointer",
  },
  text3: {
    fontSize: "14px",
    fontFamily: "'Space Grotesk', sans-serif !important",
    fontWeight: 400,
    color: "#fff",
    paddingTop: "32px",
    textDecoration: "underline",
    cursor: "pointer",
  },
  textContainer: {
    paddingLeft: "128px",
  },
  bottomContainer: {
    paddingTop: "40px",
    display: "flex",
  },
  acceptRiskContainer: {
    paddingLeft: "48px",
  },
  learnMoreContainer: {
    paddingLeft: "410px",
  },

  primaryButton: {
    textTransform: "unset",
    padding: "21px 36px 10px 22px",
    boxShadow: "8px 8px 0px 0px rgb(0 0 0)",
    background: "#fff",
    color: "#000",
    borderColor: "#000",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "white",
      borderColor: "inherit",
    },
  },
  primaryButtonIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
  },
}));
