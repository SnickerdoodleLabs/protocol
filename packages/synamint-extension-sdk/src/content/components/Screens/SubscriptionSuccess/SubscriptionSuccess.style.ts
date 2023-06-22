import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    container: {
      "& .MuiDialog-paper": {
        margin: "unset",
        padding: 24,
        borderRadius: 12,
      },
    },
  }),
);
