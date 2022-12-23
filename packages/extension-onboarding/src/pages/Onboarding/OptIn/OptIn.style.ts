import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "36px",
    lineHeight: "46px",
    color: "#212121",
  },
  subtitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "24px",
    lineHeight: "31px",
    color: "#424242",
  },
  infoText: {
    fontFamily: "'Helvetica'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    color: "#5A5292",
  },
}));
