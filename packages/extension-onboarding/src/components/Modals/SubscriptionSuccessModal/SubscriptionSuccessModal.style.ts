import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    "& .MuiDialog-paper": {
      margin: "unset",
      padding: 24,
      borderRadius: 12,
    },
  },
}));
