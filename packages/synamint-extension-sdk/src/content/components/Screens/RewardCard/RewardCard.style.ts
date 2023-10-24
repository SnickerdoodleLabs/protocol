import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    rewardName: {
      fontFamily: "'Roboto'",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "16px",
      textAlign: "center",
      color: "#222137",
    },
    title: {
      marginBottom: 4,
      fontFamily: "'Roboto'",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "24px",
      lineHeight: "28px",
      textAlign: "center",
      color: "#222137",
    },
    description: {
      marginBottom: 24,
      fontFamily: "'Roboto'",
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "16px",
      textAlign: "center",
      color: "#424242",
    },
    rawHtmlWrapper: {
      color: "#424242",
      fontSize: "14px",
      fontFamily: "'Roboto'",
      "& h1": {
        fontSize: "20px",
      },
      "& h2": {
        fontSize: "18px",
      },
      "& h3": {
        fontSize: "16px",
      },
      "& ol, ul": {
        paddingLeft: "1em",
      },
    },
    primaryButton: {
      textTransform: "unset",
      padding: "21px 26px 10px 12px",
      boxShadow: "8px 8px 0px 0px rgb(0 0 0)",
      background: "#fff",
      fontSize: 12,
      color: "#000",
      borderColor: "#000",
      borderRadius: 0,
      "&:hover": {
        backgroundColor: "inherit",
        borderColor: "inherit",
      },
    },
    primaryButtonIcon: {
      position: "absolute",
      top: 4,
      right: 4,
      width: 14,
    },
    secondaryButton: {
      fontSize: 12,
      textTransform: "unset",
      padding: "21px 26px 10px 12px",
      background: "unset",
      textDecoration: "underline",
    },
  }),
);
