import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  "@global": {
    body: {
      margin: 0,
      backgroundColor: "#f9f8f8",
    },
  },
  appWrapper: {
    margin: "0 auto",
    maxWidth: 1440,
    minHeight: "100vh",
    backgroundColor: "#FAFAFA",
  },
}));
