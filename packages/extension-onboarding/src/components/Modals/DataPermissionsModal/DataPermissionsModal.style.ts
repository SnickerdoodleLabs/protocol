import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      margin: "unset",
      padding: 24,
      borderRadius: 12,
    },
  },
  title: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: 22,
    lineHeight: "24px",
    color: "#101828",
  },
  description: {
    color: "#5D5A74",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Space Grotesk",
  },
  accountTxt: {
    color: "#000000",
  },
  contentSubtitle: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#000000",
  },
  sectionTitle: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "18px",
    lineHeight: "24px",
    color: "#232039",
  },
  switchLabel: {
    "& .MuiTypography-body1": {
      fontFamily: "Space Grotesk",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "18px",
      lineHeight: "28px",
      color: "#232039",
    },
  },
}));
