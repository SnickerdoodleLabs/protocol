import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "26px",
    color: "#232039",
  },
  description: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "16px",
    lineHeight: "22px",
    textAlign: "justify",
    color: "#2D2944",
  },
  name: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "36px",
    lineHeight: "60px",
    letterSpacing: "-0.02em",
    color: "#232039",
  },
  sectionTitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "20px",
    lineHeight: "24px",
    textTransform: "capitalize",
    color: "#232039",
  },
  propertyTitle: {},
  propertyValue: {},
}));
