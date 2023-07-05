import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  modal: {
    margin: "0 auto",
    maxWidth: 1440,
    minHeight: "100vh",
    backgroundColor: "#fff",
    "& :focus": {
      outline: "none !important",
    },
  },
  video: {
    width: "100% !important",
    height: "auto !important",
    borderRadius: 16,
  },
}));
