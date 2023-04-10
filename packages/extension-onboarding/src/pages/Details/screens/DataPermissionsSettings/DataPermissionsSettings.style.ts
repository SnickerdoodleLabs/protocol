import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily:"Inter",
    fontSize: "30px",
    fontWeight: 500,
    lineHeight: "38px",
    color: "#101828",
    letterSpacing: "0em",
  },
  description: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
  },
}));
