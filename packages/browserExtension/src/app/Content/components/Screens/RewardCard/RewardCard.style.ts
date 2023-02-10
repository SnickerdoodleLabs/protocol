import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    title: {
      marginBottom: 4,
      fontFamily: "'Shrikhand' !important",
    },
    description: {
      marginBottom: 24,
      fontWeight: 300,
    },
    primaryButton: {
      textTransform: "unset",
      padding: "21px 26px 10px 12px",
      boxShadow: "8px 8px 0px 0px rgb(0 0 0)",
      background: "#fff",
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
      textTransform: "unset",
      padding: "21px 26px 10px 12px",
      background: "unset",
      textDecoration: "underline",
    },
    accountInfoText: {
      fontFamily: "'Space Grotesk'",
      fontStyle: "normal",
      fontWeight: 600,
      fontSize: "14px",
      lineHeight: "160%",
      color: "#212121",
      marginRight: 20,
    },
    account: {
      marginLeft: 6,
      fontFamily: "'Space Grotesk'",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "11px",
      lineHeight: "160%",
      color: "#212121",
    },
    changeRecievingAccountText: {
      fontFamily: "'Space Grotesk'",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: "14px",
      lineHeight: "24px",
      textDecorationLine: "underline",
      color: "#181818",
    },
    changeAccountDescription: {
      marginTop: 6,
      fontFamily: "'Space Grotesk'",
      fontStyle: "normal",
      fontWeight: 500,
      fontSize: "11px",
      lineHeight: "14px",
      color: "#8D8B9E",
    },
    accountAddressText: {
      paddingLeft: "12px",
      fontFamily: "'Space Grotesk', sans-serif",
      fontWeight: 500,
      fontSize: "16px",
      color: "#5D5A74",
    },
  }),
);
