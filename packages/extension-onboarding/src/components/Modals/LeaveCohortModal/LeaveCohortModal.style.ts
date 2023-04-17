import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 720,
    },
  },
  closeIcon: {
    cursor: "pointer",
  },
  title: {
    fontFamily: "'Roboto'",
    fontStyle: "normal",
    fontWeight: 700,
    fontSize: "22px",
    lineHeight: "24px",
    color: "#101828",
  },
  description: {
    fontFamily: "'Public Sans'",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "16px",
    lineHeight: "24px",
    textAlign: "justify",
    color: "#262626",
  },
  primaryButton: {
    background: "#D32F2F !important",
  },
  secondaryButton: {
    background: "#fff !important",
    color: "#000 !important",
  },
}));
