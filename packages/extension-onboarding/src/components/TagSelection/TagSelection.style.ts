import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  description: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "21px",
    letterSpacing: "0.035em",
    color: "#000000",
  },
  checkBoxLabel: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "14px",
    display: "flex",
    alignItems: "center",
    color: "#252525",
  },
  image: {
    boxShadow: "0px 3.6px 7.2px rgba(10, 22, 70, 0.15)",
  },
}));
