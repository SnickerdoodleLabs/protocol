import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    width: 430,
    minHeight: 400,
    border: "1px solid #ECECEC",
    borderRadius: 12,
  },
  title: {
    fontFamily: "Space Grotesk, sans-serif",
    fontWeight: 700,
    fontSize: "20px",
    paddingTop: "35px",
  },
}));
