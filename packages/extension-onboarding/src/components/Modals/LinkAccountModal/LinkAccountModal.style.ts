import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 537,
    },
  },
  title: {
    color: "#232039",
    fontSize: 22.78,
    fontWeight: 700,
    fontFamily: "Space Grotesk",
  },
  description: {
    color: "##5D5A74",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Space Grotesk",
  },
  primaryButton: {
    background: "#D32F2F !important",
  },
  secondaryButton: {
    background: "#fff !important",
    color: "#000 !important",
  },
  label: {
    fontFamily: "'Space Grotesk'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "18px",
    lineHeight: "20px",
    color: "#232039",
  },
  button: {
    border: "1px solid #B9B6D3",
    width: "142px",
    height: "42px",
    fontFamily: "'Inter'",
    fontWeight: 500,
    fontSize: "12px",
  },
}));
