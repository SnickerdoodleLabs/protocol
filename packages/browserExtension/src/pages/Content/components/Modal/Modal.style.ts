import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useGenericModalStyles = makeStyles((theme) =>
  createStyles({
    container: {
      [theme.breakpoints.down("xs")]: {
        "& .MuiDialog-container": {
          alignItems: "flex-end",
          margin: "unset",
          borderRadius: 0,
        },
        "& .MuiDialog-paper": {
          margin: "unset",
          padding: "unset",
          width: "100%",
          borderRadius: "12px 12px 0 0",
        },
      },
    },
    content: {
      display: "flex",
      minHeight: "50vh",
      flexDirection: "column",
      alignItems: "center",
      padding: "unset",
    },
    image: {
      maxWidth: 204,
    },
    actionsContainer: {
      padding: "26px 40px",
      justifyContent: "center",
    },
    closeButton: {
      position: "absolute",
      right: 16,
      top: 16,
    },
    titleContainer: {
      padding: "26px 40px",
      display: "flex",
      alignItems: "center",
      [theme.breakpoints.down("xs")]: {
        padding: 24,
      },
    },
    contentContainer: {
      padding: "26px 40px",
    },
    title: {
      marginBottom: 4,
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
  }),
);
