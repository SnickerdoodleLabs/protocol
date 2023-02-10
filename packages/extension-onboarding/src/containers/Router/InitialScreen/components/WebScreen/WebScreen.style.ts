import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  icon: {
    width: 140,
  },
  video: {
    width: 460,
    borderRadius: 32,
    objectFit: "cover",
  },
  title: {
    fontFamily: "'Shrikhand'",
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: "36px",
    lineHeight: "52px",
    color: "#232039",
  },
  description: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "24px",
    lineHeight: "31px",
    letterSpacing: "0.035em",
    color: "#000000",
  },
  info: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "20px",
    lineHeight: "26px",
    letterSpacing: "0.035em",
    color: "#000000",
  },
}));
