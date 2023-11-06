import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  socialButtonWrapper: {
    cursor: "pointer",
  },
  link: {
    fontFamily: "Roboto !important",
    fontStyle: "normal",
    fontWeight: 500,
    fontSize: "12px !important",
    lineHeight: "12px !important",
    color: "rgba(36, 34, 58, 0.8)",
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  url: {
    fontFamily: "Roboto !important",
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
