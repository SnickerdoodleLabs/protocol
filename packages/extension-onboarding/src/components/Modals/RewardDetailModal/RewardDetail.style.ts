import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  modal: {
    margin: "0 auto",
    maxWidth: 1440,
    minHeight: "100vh",
    backgroundColor: "#fff",
    "& :focus": {
      outline: "none !important",
    },
  },
  descriptionTitle: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "23px",
    color: "#212121",
  },
  description: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "22px",
    color: "#2D2944",
  },
  name: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "36px",
    lineHeight: "60px",
    letterSpacing: "-0.02em",
    color: "#212121",
  },
  infoTitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "24px",
    color: "#5A576F",
  },
  price: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "22px",
    textAlign: "justify",
    color: "#2D2944",
  },
}));
