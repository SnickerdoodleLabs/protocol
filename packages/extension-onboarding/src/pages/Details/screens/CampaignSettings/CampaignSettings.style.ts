import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "30px",
    lineHeight: "38px",
    color: "#101828",
  },
  description: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#232039",
  },
  link: {
    textDecorationLine: "underline",
    cursor: "pointer",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 300,
    fontSize: 14.5,
    lineHeight: "17px",
    color: " #D32F2F",
  },
}));
