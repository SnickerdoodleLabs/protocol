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
    fontSize: "14px",
    lineHeight: "20px",
    letterSpacing: "0.25px",
    color: "#616161",
  },

  infoCardLabel: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    color: "#101828",
  },
  infoCardValue: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "24px",
    letterSpacing: "-0.02em",
    color: "#101828",
  },
  paginationText: {
    fontFamily: "Roboto",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: 12,
  },
  tableTitle: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px",
    lineHeight: "18px",
    color: "#616161",
  },
}));
