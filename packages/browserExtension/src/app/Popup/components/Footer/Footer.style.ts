import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  link: {
    fontFamily: "'Inter'  !important",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px !important",
    lineHeight: "12px !important",
    color: "rgba(36, 34, 58, 0.8)",
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  url: {
    fontFamily: "'Inter' !important",
    fontStyle: "normal !important",
    fontWeight: 500,
    fontSize: "12px !important",
    lineHeight: "12px !important",
    color: "rgba(36, 34, 58, 0.8)",
    cursor: "pointer",
  },
  copyrightLogo: {
    height: 16,
    width: "auto",
  },
}));
