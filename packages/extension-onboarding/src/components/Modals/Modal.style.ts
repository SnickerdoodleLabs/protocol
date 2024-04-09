import { makeStyles } from "@material-ui/core/styles";

export const useModalStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 640,
      [theme.breakpoints.down("xs")]: {
        margin: 8,
      },
    },
    "& .MuiDialog-paperFullWidth": {
      [theme.breakpoints.down("xs")]: {
        width: "unset",
        minWidth: "90%",
      },
    },
  },
  containerLg: {
    "& .MuiDialog-paper": {
      borderRadius: 12,
      maxWidth: 960,
      [theme.breakpoints.down("xs")]: {
        margin: 8,
      },
    },
    "& .MuiDialog-paperFullWidth": {
      [theme.breakpoints.down("xs")]: {
        width: "unset",
        minWidth: "90%",
      },
    },
  },
  buttonWrapper50: {
    [theme.breakpoints.down("xs")]: {
      width: "50%",
      maxWidth: "50%",
      flexBasis: "50%",
    },
  },
  buttonWrapper33: {
    [theme.breakpoints.down("xs")]: {
      width: "33.3333333%",
      maxWidth: "33.3333333%",
      flexBasis: "33.3333333%",
    },
  },
  buttonWrapperFullWidth: {
    [theme.breakpoints.down("xs")]: {
      width: "100%",
      maxWidth: "100%",
      flexBasis: "100%",
    },
  },
  fullSizeContainer: {
    "& .MuiDialog-paper": {
      [theme.breakpoints.down("xs")]: {
        margin: 8,
      },
    },
    "& .MuiDialog-paperFullWidth": {
      [theme.breakpoints.down("xs")]: {
        width: "unset",
        minWidth: "90%",
      },
    },
  },
}));
