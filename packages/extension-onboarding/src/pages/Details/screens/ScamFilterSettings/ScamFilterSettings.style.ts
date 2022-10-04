import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Shrikhand",
    fontSize: 36,
    fontWeight: 400,
    color: "#232039",
  },
  label: {
    "& .MuiRadio-colorSecondary.Mui-checked ": {
      color: "#8079B4",
    },
    "& .MuiTypography-body1": {
      fontFamily: "'Space Grotesk'",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "16px",
      color: "#232039",
    },
  },
  description: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "24px",
  },
  sectionTitle: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "24px",
    color: "#232039",
  },
  switchLabel: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "28px",
    color: "#232039",
  },
  permissionDescription: {
    fontFamily: "Space Grotesk",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#232039",
  },
}));
