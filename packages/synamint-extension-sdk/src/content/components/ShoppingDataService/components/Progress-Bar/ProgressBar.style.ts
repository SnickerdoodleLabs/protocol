import { makeStyles, createStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) =>
  createStyles({
    percentText: {
      fontWeight: 500,
      fontSize: "20px",
      lineHeight: "28px",
      color: "#000000",
    },
    bar: {
      width: "280px",
      height: "16px",
      color: "#6E62A6",
      backgroundColor: "#D2CEE3",
      borderRadius: "6px",
    },
  }),
);
