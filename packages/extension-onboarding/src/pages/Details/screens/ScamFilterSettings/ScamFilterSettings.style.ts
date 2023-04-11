import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  label: {
    "& .MuiRadio-colorSecondary.Mui-checked ": {
      color: "#8079B4",
    },
    "& .MuiTypography-body1": {
      fontFamily: "Roboto",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "28px",
      color: "#232039",
    },
  },
  description: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
  },
  sectionTitle: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "23px",
    color: "#000",
  },
  infoText: {
    fonFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#000",
  },
}));
