import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      position: "fixed",
      top: 0,
      right: 48,
      zIndex: 9999,
      borderRadius: "12px",
      boxShadow: "none",
      padding: "24px",
    },
    title: {
      fontWeight: 500,
      fontSize: "16px",
      lineHeight: "20px",
      textAlign: "center",
      color: "#424242",
    },
    subText: {
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "22px",
      textAlign: "center",
      color: "#54A858",
    },
    button: {
      borderRadius: "4px",
      height: "40px",
      backgroundColor: "#6E62A6",
      fontWeight: 500,
      fontSize: "14px",
      lineHeight: "20px",
      color: "#FFFFFF",
    },
  }),
);
