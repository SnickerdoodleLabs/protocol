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
}));
