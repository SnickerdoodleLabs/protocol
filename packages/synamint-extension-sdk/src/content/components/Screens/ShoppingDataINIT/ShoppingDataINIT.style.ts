import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: "fixed",
      top: 0,
      right: 78,
      zIndex: 9999,
      borderRadius: 0,
      boxShadow: "none",
    },
    socialButtonWrapper: {
      cursor: "pointer",
    },
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
    title: {
      fontSize: "20px",
      fontWeight: 700,
      lineHeight: "30px",
      color: "#424242",
      textAlign: "center",
    },
    bodyText: {
      fontSize: "16px",
      fontWeight: 400,
      lineHeight: "20px",
      color: "#424242",
    },
    button: {
      backgroundColor: "#6E62A6",
      height: "54px",
      borderRadius: "4px",
      border: "1px solid #6E62A6",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      color: "#FFFFFF",
    },
  }),
);
