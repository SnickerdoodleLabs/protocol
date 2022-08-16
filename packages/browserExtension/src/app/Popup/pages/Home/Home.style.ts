import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  nameTx: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: 24,
    lineHeight: "31px",
    color: "#232039",
  },
  emailTx: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 14,
    lineHeight: "18px",
    color: "#232039",
    textDecorationLine: "underline",
  },
  title: {
    fontFamily: "Space Grotesk",
    fontSize: 20,
    lineHeight: "20px",
    color: "#232039",
  },
  link: {
    color: "#8079B4",
    fontFamily: "Inter",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14.05px",
    lineHeight: "17px",
    textDecorationLine: "underline",
    cursor: "pointer"
  },
}));
