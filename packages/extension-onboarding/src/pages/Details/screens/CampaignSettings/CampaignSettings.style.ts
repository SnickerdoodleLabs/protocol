import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
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
  emptyText: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "center",
    color: "rgba(35, 32, 57, 0.8)",
  },
  btnText: {
    fontFamily: "'Public Sans'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center",
    color: "#262626",
  },
}));
