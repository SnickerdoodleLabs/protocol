import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  review: {
    fontFamily: "'Inter'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "14.05px",
    lineHeight: "17px",
    textDecorationLine: "underline",
    color: "#8079B4",
    cursor: "pointer",
  },
  name: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "16px",
    lineHeight: "19px",
    color: "rgba(35, 32, 57, 0.87)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  label: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "14px",
    lineHeight: "16px",
    color: "#424242",
  },
  value: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 400,
    fontSize: "14px",
    lineHeight: "16px",
    color: "rgba(35, 32, 57, 0.87)",
  },
}));
