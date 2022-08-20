import { makeStyles } from "@material-ui/core/styles";

export const useStyles = makeStyles((theme) => ({
  container: {
    paddingLeft: 24,
  },
  title: {
    color: "#5D5A74",
    fontSize: 16,
    fontWeight: 500,
    fontFamily: "Space Grotesk",
    paddingTop: "22px",
    paddingBottom: "22px",
  },
  info: {
    fontFamily: "Space Grotesk",
    fontWeight: 500,
    fontSize: 16,
    color: "#232039",
    paddingTop: "22px",
    paddingBottom: "22px",
  },
}));
