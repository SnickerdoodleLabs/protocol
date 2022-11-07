import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  primaryButton: {
    textTransform: "unset",
    padding: "12px 46px 10px 12px",
    boxShadow: "3px 3px 0px 0px rgb(0 0 0)",
    background: "#8079B4",
    color: "#fff",
    borderColor: "#000",
    borderRadius: 0,
    "&:hover": {
      backgroundColor: "#8079B4",
      borderColor: "#000",
    },
  },
  primaryButtonIcon: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 14,
  },
  buttonText: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 10,
    color: "#222137",
    textDecoration: "underline",
    textTransform: "capitalize",
  },
  subtitle: {
    fontFamily: "Space Grotesk",
    fontWeight: 300,
    fontSize: 12,
    color: "#222137",
  },
  footerText: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 9,
    color: "#8D8B9E",
  },
}));
