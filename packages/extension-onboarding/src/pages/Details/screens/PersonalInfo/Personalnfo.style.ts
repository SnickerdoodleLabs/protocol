import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  title: {
    fontFamily: "Shrikhand",
    fontSize: 36,
    fontWeight: 400,
    color: "#232039",
  },
  description: {
    fontFamily: "Space Grotesk",
    fontWeight: 400,
    fontSize: 18,
    lineHeight: "23px",
  },
  info: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "26px",
    color: "#232039",
  },
  dividerText: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "20px",
    lineHeight: "20px",
    color: "#232039",
  },
  itemLabel: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#5D5A74",
  },
  itemValue: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "20px",
    color: "#232039",
  },
  divider: {
    display: "flex",
    flex: 1,
    backgroundColor: "#D9D9D9",
    height: "1px",
  },
  editButton: {
    fontFamily: "Space Grotesk",
    fontSize: 16,
    fontWeight: 500,
    color: "#8079B4",
  },
}));
