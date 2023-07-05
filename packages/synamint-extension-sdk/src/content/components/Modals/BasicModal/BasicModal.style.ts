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
    title: {
      fontFamily: "Space Grotesk",
      fontStyle: "normal",
      fontWeight: 700,
      fontSize: 22,
      lineHeight: "24px",
      color: "#101828",
    },
  }),
);
